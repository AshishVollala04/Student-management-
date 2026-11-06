# FUTURESCHOOL PHASE 16: REAL AUTHENTICATION AND AUTHORIZATION

## 1. Executive Summary

Phase 16 implements production-ready authentication and authorization architecture for FutureSchool, building upon the foundations of Phase 10 (Security Architecture), Phase 11 (Database Architecture), Phase 12 (Authorization Matrix), Phase 13 (API Contract), Phase 14 (Audit Model), and Phase 15 (Backend Foundation).

The implementation strictly enforces:
- **Role + Permission + Tenant + Relationship + Workflow + Feature Entitlement** authorization (role alone never grants access).
- **Dual Token Architecture**: Short-lived cryptographic JWT access tokens (15 minutes) paired with stateful, server-managed refresh sessions stored in PostgreSQL with SHA-256 token hashing and rotation.
- **Refresh Reuse Detection**: Presentation of an expired, already rotated, or invalid refresh token triggers automatic invalidation and revocation of all active sessions for that user identity.
- **Shared Student Credential Resolution**: Students and Parents utilize the same student registration number (`GVS-2027-0001`) and password, but the server validates `portal`:
  - `PortalContext.STUDENT` grants `ROLE_STUDENT`.
  - `PortalContext.PARENT` grants `ROLE_PARENT` strictly bound to the target student's ID (`studentId`). Cross-student probing is structurally rejected.
- **Strict Tenant & Relationship Boundaries**:
  - Teacher marks entry requires active subject allocation (`TeacherSubjectAllocation`) in the specified class, section, and subject, matching tenant school ID and an open workflow window.
  - Class teacher actions require verified `ClassTeacherAssignment`.
  - School Administrators cannot access platform endpoints or enter marks directly without teaching allocation.
  - Platform Administrators cannot mutate tenant-owned marks or probe student records without explicit tenant delegation.
- **Adaptive Password Security & Throttling**:
  - BCrypt password hashing (strength 12).
  - Rate limiting / login throttling: 5 consecutive failed attempts lock the identifier for 900 seconds (15 minutes).
  - Safe constant-time responses: Identical generic error message (`Invalid credentials or portal context`) across missing users, incorrect passwords, and portal mismatches.
- **Sensitive Operations Step-Up Security**:
  - Critical actions (staff credential reset, offline payment processing, fee structure modification) require single-use, 15-minute step-up tokens (`X-Step-Up-Token`) verified before execution.

---

## 2. Token Claims & Session Model

### JWT Access Token Claims
| Claim | Type | Description |
|---|---|---|
| `iss` | String | Token issuer (`futureschool-auth`) |
| `sub` | UUID | User ID |
| `loginId` | String | Login Identifier (Student ID, Staff ID, Platform ID) |
| `displayName` | String | User display name |
| `portal` | String | Active portal context (`STUDENT`, `PARENT`, `STAFF`, `PLATFORM`) |
| `schoolId` | UUID | Tenant / School UUID (null for Platform Admin) |
| `schoolCode` | String | Tenant school code (`GVS`, `HZA`) |
| `studentId` | UUID | Bound Student UUID (for `STUDENT` and `PARENT` portal sessions) |
| `staffId` | UUID | Bound Staff UUID (for `STAFF` portal sessions) |
| `sessionId` | UUID | Database session UUID in `user_sessions` |
| `authorities` | List<String> | Composite roles (`ROLE_*`) and permissions (`PERM_*`) |
| `iat` / `exp` | Numeric | Issued at and expiration timestamp (900 seconds) |

---

## 3. Database Schema Updates (`V2__security_and_auth_schema.sql`)

The following relational entities were added in Flyway migration `V2`:
1. `user_sessions`:
   - `session_id` (UUID PK)
   - `user_id` (FK -> users)
   - `school_id` (FK -> schools, nullable)
   - `refresh_token_hash` (VARCHAR(64) UNIQUE, SHA-256)
   - `portal_context` (VARCHAR(32))
   - `device_info` (TEXT)
   - `ip_address` (VARCHAR(45))
   - `is_revoked` (BOOLEAN)
   - `revoked_reason` (VARCHAR(128))
   - `revoked_at` (TIMESTAMPTZ)
   - `expires_at` (TIMESTAMPTZ)
   - `last_used_at` (TIMESTAMPTZ)
2. `password_reset_tokens`:
   - `token_id` (UUID PK)
   - `user_id` (FK -> users)
   - `token_hash` (VARCHAR(64) UNIQUE)
   - `is_used` (BOOLEAN)
   - `expires_at` (TIMESTAMPTZ)
3. `step_up_tokens`:
   - `step_up_id` (UUID PK)
   - `user_id` (FK -> users)
   - `token_hash` (VARCHAR(64) UNIQUE)
   - `purpose` (VARCHAR(64))
   - `is_used` (BOOLEAN)
   - `expires_at` (TIMESTAMPTZ)
4. `school_feature_entitlements`:
   - `entitlement_id` (UUID PK)
   - `school_id` (FK -> schools)
   - `feature_code` (VARCHAR(64))
   - `is_enabled` (BOOLEAN)
5. `mfa_configurations`:
   - `mfa_id` (UUID PK)
   - `user_id` (FK -> users UNIQUE)
   - `mfa_secret` (TEXT)
   - `is_verified` (BOOLEAN)

---

## 4. Automated Verification Results

All 35 automated unit and integration tests execute cleanly with zero failures and zero warnings:

```
[INFO] Results:
[INFO] 
[INFO] Tests run: 35, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

### Test Breakdown
- `com.futureschool.identity.AuthenticationSecurityTest` (10 tests):
  1. Valid student login with student portal context.
  2. Shared student credential in PARENT portal issuing `ROLE_PARENT` and bound `studentId`.
  3. Valid teacher login returning `STAFF` portal and `staffId`.
  4. Valid platform admin login without school code.
  5. Invalid password returns generic 401 without disclosure.
  6. Non-existent user returns identical 401 error message (enumeration resistance).
  7. Portal mismatch: Student credentials rejected for STAFF portal context.
  8. Refresh token rotation: rotates token and revokes upon re-use of old token.
  9. Logout session revocation immediately invalidates access token.
  10. Password reset flow: single-use token changes password, invalidates old credentials, and invalidates reused reset tokens.
- `com.futureschool.identity.AuthorizationMatrixTest` (16 tests):
  1. Student accesses own grades -> ALLOW (200).
  2. Student probes other student's grades -> DENY (403).
  3. Parent accesses bound ward's grades -> ALLOW (200).
  4. Parent probes another student's grades -> DENY (403).
  5. Teacher enters marks for allocated subject (Math 10-A) when window is OPEN -> ALLOW (200).
  6. Teacher enters marks for unallocated subject (Physics 10-A) -> DENY (403).
  7. Teacher enters marks when window is CLOSED -> DENY (403).
  8. Teacher cross-tenant probe (School GVS teacher probes School HZA) -> DENY (403).
  9. Admin attempts to enter marks directly without teaching allocation -> DENY (403).
  10. School Admin attempts platform-only endpoint -> DENY (403).
  11. Platform Admin accesses platform endpoint -> ALLOW (200).
  12. Admin with `PERM_RECORD_OFFLINE_PAYMENT` records payment -> ALLOW (200).
  13. Teacher without payment permission attempts to record payment -> DENY (403).
  14. Sensitive staff credential reset without step-up token -> DENY (403 STEP_UP_REQUIRED).
  15. Sensitive staff credential reset with valid step-up token -> ALLOW (200).
  16. Feature Entitlement check: GVS has AI enabled -> ALLOW (200), HZA has AI disabled -> DENY (403).
- Foundational Tests (`HealthControllerTest`, `TenantIsolationRepositoryTest`, `AuditServiceIntegrationTest`, `DomainIdentifierTest`, `GlobalExceptionHandlerTest`) (9 tests).
