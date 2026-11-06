# Phase 12: FutureSchool Production Authorization Matrix Specification

**Product:** FutureSchool — Commercial Multi-School Management SaaS Platform  
**Target Architecture:** Java 21 LTS · Spring Boot 3.3.x · Spring Security 6 · PostgreSQL 16 RLS  
**Document Classification:** Architectural Specification & ABAC/RBAC Authorization Matrix (Phase 12)  
**Status:** Pre-Implementation Specification (No controllers, security filters, or business APIs are coded in this phase)  

---

## 1. Authorization Architecture

### 1.1 Multi-Dimensional Decision Invariant
- **[DESIGN DECISION] Composite Context Authorization Invariant:**  
  A caller is never authorized solely by their user role (e.g. `TEACHER` or `ADMIN`). Every authorization decision in FutureSchool must satisfy a 6-dimensional composite context:
  $$\text{Authorize} = f(\text{Role}, \text{Permission}, \text{Tenant/School}, \text{Resource Relationship}, \text{Workflow State}, \text{Feature Entitlement})$$
  1. **Role:** Security principal's role (`STUDENT`, `PARENT`, `TEACHER`, `PRINCIPAL`, `ADMIN`, `PLATFORM_ADMIN`).
  2. **Permission:** Granular operational grant (e.g. `MARKS_ENTRY`, `PROCESS_APPROVED_REFUND`, `SENSITIVE_EXPORT`).
  3. **Tenant / School:** Non-bypassable isolation check (`securityContext.schoolId == resource.schoolId`).
  4. **Relationship:** Active domain linkage (e.g. `teacher_subject_allocations` for Class 10-A Maths; `student_enrollments` for Aarav Sharma).
  5. **Workflow State:** Lifecycle validity (e.g. Marks entry window `OPEN`; Report Card state `DRAFT` vs `PUBLISHED`).
  6. **Feature Entitlement:** Institutional subscription license check (e.g. `school_feature_entitlements.fleet_transport == true`).

---

## 2. Role Catalog

- **[DESIGN DECISION] Base Roles vs Dynamic Domain Relationships:**
  - `STUDENT`: Authenticated student principal with read-only access to own published academic records and submit access to own homework/quizzes.
  - `PARENT`: Authenticated guardian principal bound strictly to **one** Student ID (`actor_id = student_id`).
  - `TEACHER`: Certified faculty member. Teaching powers are granted exclusively via dynamic relationship allocations (`Subject Teacher` and `Class Mentor`).
  - `PRINCIPAL`: Executive academic director. Holds school-wide academic review and sign-off authority. Holds zero automatic subject marks entry powers unless assigned via `My Teaching`.
  - `ADMIN`: Operational campus administrator. Specific scopes granted via admin permission bundles.
  - `PLATFORM_ADMIN`: SaaS platform director. Scoped to platform-level tenant governance; zero business access to classroom student records.

---

## 3. Permission Catalog

- **[DESIGN DECISION] Granular Atomic Permissions:**
  - **Academic:** `ACADEMIC_YEAR_SETUP`, `ACADEMIC_STRUCTURE_MANAGE`, `SUBJECT_ALLOCATION_MANAGE`, `TIMETABLE_MANAGE`, `TIMETABLE_APPROVE`, `CALENDAR_MANAGE`.
  - **Classroom & Grading:** `HOMEWORK_CREATE`, `HOMEWORK_REVIEW`, `MARKS_ENTRY`, `MARKS_SUBMIT_REVIEW`, `MARKS_PRINCIPAL_ENDORSE`, `MARKS_REOPEN_WINDOW`, `REPORT_CARD_PREPARE`, `REPORT_CARD_SIGN`, `REPORT_CARD_PUBLISH`.
  - **Attendance:** `ATTENDANCE_ROLL_CALL`, `ATTENDANCE_CORRECT`, `LEAVE_REQUEST_SUBMIT`, `LEAVE_REQUEST_SANCTION`, `STAFF_LEAVE_SANCTION`.
  - **Finance:** `FEE_STRUCTURE_MANAGE`, `FEE_STRUCTURE_APPROVE`, `BILLING_RUN_EXECUTE`, `RECORD_OFFLINE_PAYMENT`, `VERIFY_OFFLINE_PAYMENT`, `PROCESS_APPROVED_REFUND`, `CONCESSION_APPLY`.
  - **Transport & Safety:** `TRANSPORT_ROUTE_MANAGE`, `TRANSPORT_CHANGE_SANCTION`, `STUDENT_RELEASE_VERIFY`, `INCIDENT_RECORD`.
  - **Governance & Audit:** `MANAGE_ADMIN_PERMISSIONS`, `PRINCIPAL_DELEGATION_MANAGE`, `SENSITIVE_EXPORT`, `AUDIT_LOG_VIEW`.

---

## 4. Admin Permission Bundles

- **[DESIGN DECISION] Admin Segregation of Duties:**
  The `ADMIN` role is segmented into strict operational bundles:
  1. `ADMISSIONS_ADMIN`: `ADMISSIONS_CREATE`, `STUDENT_ENROLLMENT_MANAGE`, `STUDENT_EXIT_PROCESS`.
  2. `FINANCE_ADMIN`: `FEE_STRUCTURE_MANAGE`, `BILLING_RUN_EXECUTE`, `RECORD_OFFLINE_PAYMENT`, `INVOICE_ADJUST`. (Excluded: `VERIFY_OFFLINE_PAYMENT` maker-checker).
  3. `TRANSPORT_ADMIN`: `TRANSPORT_ROUTE_MANAGE`, `TRANSPORT_CHANGE_SANCTION`, `VEHICLE_ASSIGN`.
  4. `ACADEMIC_OPS_ADMIN`: `TIMETABLE_MANAGE`, `CALENDAR_MANAGE`, `CLASS_SECTION_SETUP`.
  5. `SECURITY_ADMIN`: `MANAGE_ADMIN_PERMISSIONS`, `RESET_STAFF_CREDENTIAL`, `AUDIT_LOG_VIEW`.

---

## 5. Master Authorization Matrix by Domain

### Column Schema Legend
- **Actor:** Role + Context
- **Action:** Operation attempted
- **Resource:** Target entity
- **Tenant Scope:** Required tenancy check
- **Permission:** Required permission string
- **Relationship:** Active domain linkage
- **State:** Workflow requirement
- **Entitlement:** Required subscription flag
- **Step-Up:** Requires re-authentication / MFA
- **Decision:** `ALLOW` or `DENY`
- **Audit:** Append-only forensic log required

---

### 5.1 Student Authorization Matrix

| Actor | Action | Resource | Tenant Scope | Permission | Relationship | State | Entitlement | Step-Up | Decision | Audit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `STUDENT` | View Dashboard | `student_dashboard` | Same Tenant | `STUDENT_PORTAL_VIEW` | Self (`actor_id == student_id`) | Active Enrollment | `core_academics` | No | `ALLOW` | No |
| `STUDENT` | View Attendance | `student_daily_attendance` | Same Tenant | `ATTENDANCE_VIEW` | Self (`record.student_id == actor_id`) | Any | `core_academics` | No | `ALLOW` | No |
| `STUDENT` | View Attendance of Peer | `student_daily_attendance` | Same Tenant | `ATTENDANCE_VIEW` | Peer (`record.student_id != actor_id`) | Any | `core_academics` | No | `DENY` | Yes |
| `STUDENT` | Submit Homework | `homework_submissions` | Same Tenant | `HOMEWORK_SUBMIT` | Enrolled in homework section | `due_date >= NOW()` | `homework_and_quizzes` | No | `ALLOW` | Yes |
| `STUDENT` | Submit Expired Homework | `homework_submissions` | Same Tenant | `HOMEWORK_SUBMIT` | Enrolled in homework section | `due_date < NOW()` & Late Blocked | `homework_and_quizzes` | No | `DENY` | No |
| `STUDENT` | View Published Marks | `student_marks` | Same Tenant | `MARKS_VIEW` | Self | `is_published == TRUE` | `core_academics` | No | `ALLOW` | No |
| `STUDENT` | View Draft Marks | `student_marks` | Same Tenant | `MARKS_VIEW` | Self | `is_published == FALSE` | `core_academics` | No | `DENY` | Yes |
| `STUDENT` | Download Hall Ticket | `hall_ticket_releases` | Same Tenant | `HALL_TICKET_DOWNLOAD`| Self | `fee_cleared == TRUE` OR `override == TRUE` | `core_academics` | No | `ALLOW` | Yes |
| `STUDENT` | Download Blocked Hall Ticket | `hall_ticket_releases` | Same Tenant | `HALL_TICKET_DOWNLOAD`| Self | `fee_cleared == FALSE` & `override == FALSE` | `core_academics` | No | `DENY` | Yes |
| `STUDENT` | Query AI Tutor | `ai_tutor_session` | Same Tenant | `AI_TUTOR_QUERY` | Enrolled student | Daily quota available | `ai_tutor_student` | No | `ALLOW` | No |
| `STUDENT` | Access Payment Gateway | `payments` | Same Tenant | Any | Any | Any | Any | No | `DENY` | Yes |

---

### 5.2 Parent Authorization Matrix

| Actor | Action | Resource | Tenant Scope | Permission | Relationship | State | Entitlement | Step-Up | Decision | Audit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `PARENT` | View Ward Academics | `student_enrollments` | Same Tenant | `PARENT_PORTAL_VIEW` | Ward (`session.student_id == record.student_id`)| Active Enrollment | `core_academics` | No | `ALLOW` | No |
| `PARENT` | View Sibling via URL Tamper | `student_enrollments` | Same Tenant | `PARENT_PORTAL_VIEW` | Sibling (`target_id != session.student_id`)| Any | `core_academics` | No | `DENY` | Yes |
| `PARENT` | Pay Outstanding Fees | `payment_orders` | Same Tenant | `FEE_PAYMENT_INITIATE`| Ward | `invoice.balance_due > 0` | `fees_and_invoicing`| No | `ALLOW` | Yes |
| `PARENT` | Apply Student Leave | `leave_requests` | Same Tenant | `LEAVE_REQUEST_SUBMIT`| Ward | `start_date >= TODAY` | `core_academics` | No | `ALLOW` | Yes |
| `PARENT` | Request Route Change | `transport_change_requests`| Same Tenant | `TRANSPORT_CHANGE_REQ`| Ward enrolled in transport | `current_route.is_active` | `fleet_transport` | No | `ALLOW` | Yes |
| `PARENT` | View Live Bus Radar | `vehicle_telemetry` | Same Tenant | `TRANSPORT_RADAR_VIEW`| Ward assigned to bus route | Vehicle in transit | `fleet_transport` | No | `ALLOW` | No |
| `PARENT` | Log Safety Grievance | `complaints` | Same Tenant | `COMPLAINT_SUBMIT` | Ward parent | Any | `core_academics` | No | `ALLOW` | Yes |
| `PARENT` | View Internal Staff Notes | `complaint_responses` | Same Tenant | `COMPLAINT_VIEW` | Ward parent | `is_internal_only == TRUE` | Any | No | `DENY` | Yes |

---

### 5.3 Subject Teacher Authorization Matrix

| Actor | Action | Resource | Tenant Scope | Permission | Relationship | State | Entitlement | Step-Up | Decision | Audit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TEACHER` | Enter Marks (Assigned Class) | `student_marks` | Same Tenant | `MARKS_ENTRY` | Active `teacher_subject_allocations` | Schedule `WINDOW_OPEN` & `DRAFT` | `core_academics` | No | `ALLOW` | Yes |
| `TEACHER` | Enter Marks (Unassigned Subj)| `student_marks` | Same Tenant | `MARKS_ENTRY` | No allocation (Physics vs Maths) | Window Open | `core_academics` | No | `DENY` | Yes |
| `TEACHER` | Enter Marks (Locked Window) | `student_marks` | Same Tenant | `MARKS_ENTRY` | Active allocation | `WINDOW_LOCKED` & No Waiver | `core_academics` | No | `DENY` | Yes |
| `TEACHER` | Submit Marksheet to Principal | `marks_submissions` | Same Tenant | `MARKS_SUBMIT_REVIEW` | Primary allocated teacher | All marks entered | `core_academics` | No | `ALLOW` | Yes |
| `TEACHER` | Author Homework Assignment | `homework` | Same Tenant | `HOMEWORK_CREATE` | Active allocation for section | Academic year active | `homework_and_quizzes` | No | `ALLOW` | Yes |
| `TEACHER` | Edit Peer Teacher Homework | `homework` | Same Tenant | `HOMEWORK_CREATE` | Not author / Not allocated | Any | `homework_and_quizzes` | No | `DENY` | Yes |
| `TEACHER` | Review Homework Submission | `homework_submissions` | Same Tenant | `HOMEWORK_REVIEW` | Allocated teacher for section | `SUBMITTED` | `homework_and_quizzes` | No | `ALLOW` | No |

---

### 5.4 Class Teacher (Mentor) Authorization Matrix

| Actor | Action | Resource | Tenant Scope | Permission | Relationship | State | Entitlement | Step-Up | Decision | Audit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TEACHER` | Mark Morning/Afternoon Roll | `student_daily_attendance`| Same Tenant | `ATTENDANCE_ROLL_CALL`| Active `class_teacher_assignments` | Attendance Date == TODAY | `attendance_and_timetable`| No | `ALLOW` | Yes |
| `TEACHER` | Roll Call on Unassigned Class| `student_daily_attendance`| Same Tenant | `ATTENDANCE_ROLL_CALL`| Not Class Mentor | Attendance Date == TODAY | `attendance_and_timetable`| No | `DENY` | Yes |
| `TEACHER` | Sanction Parent Leave | `leave_requests` | Same Tenant | `LEAVE_REQUEST_SANCTION`| Class Mentor of Student | `PENDING` | `core_academics` | No | `ALLOW` | Yes |
| `TEACHER` | Prepare Class Report Cards | `report_cards` | Same Tenant | `REPORT_CARD_PREPARE` | Class Mentor | All subject marks accepted | `core_academics` | No | `ALLOW` | Yes |
| `TEACHER` | Submit Report Cards to Principal | `report_cards` | Same Tenant | `REPORT_CARD_SUBMIT` | Class Mentor | Incomplete checks pass | `core_academics` | No | `ALLOW` | Yes |
| `TEACHER` | Publish Report Cards | `report_cards` | Same Tenant | `REPORT_CARD_PUBLISH` | Class Mentor | Principal signed == TRUE | `core_academics` | No | `ALLOW` | Yes |
| `TEACHER` | Publish Unapproved Cards | `report_cards` | Same Tenant | `REPORT_CARD_PUBLISH` | Class Mentor | Principal signed == FALSE | `core_academics` | No | `DENY` | Yes |
| `TEACHER` | Release Eligible Hall Tickets| `hall_ticket_releases` | Same Tenant | `HALL_TICKET_RELEASE` | Class Mentor | `fee_cleared == TRUE` | `core_academics` | No | `ALLOW` | Yes |
| `TEACHER` | Release Blocked Hall Ticket | `hall_ticket_releases` | Same Tenant | `HALL_TICKET_RELEASE` | Class Mentor | `fee_cleared == FALSE` & No Override | `core_academics` | No | `DENY` | Yes |

---

### 5.5 Principal Authorization Matrix

| Actor | Action | Resource | Tenant Scope | Permission | Relationship | State | Entitlement | Step-Up | Decision | Audit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `PRINCIPAL` | Endorse Marksheet | `marks_submissions` | Same Tenant | `MARKS_PRINCIPAL_ENDORSE`| Executive Directorate | `SUBMITTED` | `core_academics` | No | `ALLOW` | Yes |
| `PRINCIPAL` | Return Marksheet with Directives | `marks_submissions` | Same Tenant | `MARKS_RETURN_REVISION` | Executive Directorate | `SUBMITTED` | `core_academics` | No | `ALLOW` | Yes |
| `PRINCIPAL` | Sign Off Report Cards | `report_cards` | Same Tenant | `REPORT_CARD_SIGN` | Executive Directorate | `PENDING_PRINCIPAL` | `core_academics` | No | `ALLOW` | Yes |
| `PRINCIPAL` | Execute Hall Ticket Override | `hall_ticket_releases` | Same Tenant | `HALL_TICKET_OVERRIDE` | Executive Directorate | Fee Blocked / Hardship Reason | `core_academics` | Yes (MFA) | `ALLOW` | Yes |
| `PRINCIPAL` | Sanction Faculty Leave & Sub | `staff_leaves` | Same Tenant | `STAFF_LEAVE_SANCTION` | Executive Directorate | Coverage conflict validated | `core_academics` | No | `ALLOW` | Yes |
| `PRINCIPAL` | Sanction Re-Exam Paper | `re_exam_requests` | Same Tenant | `RE_EXAM_APPROVE` | Executive Directorate | Certified medical/sports evidence | `core_academics` | No | `ALLOW` | Yes |
| `PRINCIPAL` | Arbitrary Marks Edit (Direct) | `student_marks` | Same Tenant | Direct SQL / Write | No Teacher Allocation | Window Closed | Any | No | `DENY` | Yes |
| `PRINCIPAL` | Enter Marks (Assigned Subj) | `student_marks` | Same Tenant | `MARKS_ENTRY` | Active allocation (`My Teaching`)| Window Open | `core_academics` | No | `ALLOW` | Yes |
| `PRINCIPAL` | Approve Own Marksheet (My Teaching)| `marks_submissions` | Same Tenant | `MARKS_PRINCIPAL_ENDORSE`| Same Author (`submitted_by == principal`)| Self-Approval | `core_academics` | Any | `DENY` | Yes |
| `PRINCIPAL` | Delegate Acting Authority | `principal_delegations` | Same Tenant | `PRINCIPAL_DELEGATE` | Executive Principal | Vice Principal candidate | `core_academics` | Yes (MFA) | `ALLOW` | Yes |

---

### 5.6 School Admin Authorization Matrix

| Actor | Action | Resource | Tenant Scope | Permission | Relationship | State | Entitlement | Step-Up | Decision | Audit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ADMIN` | Complete New Admission | `students` / `enrollments` | Same Tenant | `ADMISSIONS_CREATE` | School Admin | Application Verified | `core_academics` | No | `ALLOW` | Yes |
| `ADMIN` | Deploy Approved Config (CFG) | `system_configurations` | Same Tenant | `CONFIG_DEPLOY` | School Admin | Principal Signed == TRUE | `core_academics` | No | `ALLOW` | Yes |
| `ADMIN` | Deploy Unapproved Config | `system_configurations` | Same Tenant | `CONFIG_DEPLOY` | School Admin | Principal Signed == FALSE | `core_academics` | No | `DENY` | Yes |
| `ADMIN` | Execute Billing Run Batch | `billing_runs` | Same Tenant | `BILLING_RUN_EXECUTE` | Finance Admin Bundle | Active Term | `fees_and_invoicing`| Yes (MFA) | `ALLOW` | Yes |
| `ADMIN` | Sanction Route Reassignment | `transport_change_requests`| Same Tenant | `TRANSPORT_CHANGE_SANCT`| Transport Admin Bundle | Seat Capacity >= 1 | `fleet_transport` | No | `ALLOW` | Yes |
| `ADMIN` | Record Offline Cash Payment | `payments` | Same Tenant | `RECORD_OFFLINE_PAYMENT`| Finance Admin (Maker) | Student balance > 0 | `fees_and_invoicing`| No | `ALLOW` | Yes |
| `ADMIN` | Verify Own Offline Payment | `payments` | Same Tenant | `VERIFY_OFFLINE_PAYMENT`| Same User (`maker == checker`) | Self-Approval | `fees_and_invoicing`| Any | `DENY` | Yes |
| `ADMIN` | Modify Class 10-A Marks | `student_marks` | Same Tenant | Any | School Admin (Not Teacher) | Any | Any | No | `DENY` | Yes |
| `ADMIN` | Manage Platform Tenants | `schools` (Platform) | Cross-Tenant | Platform Admin role | School Admin | Any | Any | No | `DENY` | Yes |

---

### 5.7 Platform Admin Authorization Matrix

| Actor | Action | Resource | Tenant Scope | Permission | Relationship | State | Entitlement | Step-Up | Decision | Audit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `PLATFORM_ADMIN` | Verify School Affiliation | `schools` | Platform Scope | `TENANT_VERIFY_ACTIVATE` | Platform Directorate | `PENDING_VERIFICATION` | SaaS Platform | Yes (MFA) | `ALLOW` | Yes |
| `PLATFORM_ADMIN` | Suspend School Tenant | `schools` | Platform Scope | `TENANT_SUSPEND` | Platform Directorate | Non-payment / Violation | SaaS Platform | Yes (MFA) | `ALLOW` | Yes |
| `PLATFORM_ADMIN` | Expand Student Capacity Cap | `school_subscriptions` | Platform Scope | `CAPACITY_ENTITLEMENT_MOD`| Platform Directorate | Contract Addendum signed | SaaS Platform | No | `ALLOW` | Yes |
| `PLATFORM_ADMIN` | Query Student Marks Direct | `student_marks` | Target School | Any | Platform Admin (No school context)| Any | Any | No | `DENY` | Yes |
| `PLATFORM_ADMIN` | Read-Only Tenant Support View| `tenant_support_cases` | Platform Scope | `TENANT_SUPPORT_READ` | Explicit Support Ticket Grant | Ticket OPEN | SaaS Platform | Yes (MFA) | `ALLOW` | Yes |

---

## 6. Self-Approval & Segregation of Duties (Maker-Checker Invariants)

- **[DESIGN DECISION] Non-Negotiable Maker-Checker Invariants:**
  1. **Dual-Key Offline Fee Verification:**  
     An administrator holding `RECORD_OFFLINE_PAYMENT` who enters a cash receipt cannot execute `VERIFY_OFFLINE_PAYMENT` on that receipt. A second administrator with Finance verification permission must endorse the ledger voucher.
  2. **Principal "My Teaching" Conflict Routing:**  
     When the Principal is allocated as a Subject Teacher (e.g. Class 10-A Maths):  
     - Principal submits marks as Teacher $\rightarrow$ Principal is **DENIED** from executing `MARKS_PRINCIPAL_ENDORSE` on their own marksheet.  
     - *Conflict resolution:* The marksheet routes to the Vice Principal / Senior Academic Dean under a designated Academic Conflict Delegation rule.
  3. **Protected Admin Permission Escalation:**  
     An administrator cannot grant sensitive permissions (e.g. `SENSITIVE_EXPORT`, `MANAGE_ADMIN_PERMISSIONS`) to their own user account.

---

## 7. Delegation Matrix (Acting Principal Governance)

- **[DESIGN DECISION] Time-Scoped, Least-Privilege Delegation:**
  ```
  Principal (Dr. Vance)
        ↓  Issues Delegation Token (MFA Verified)
  Vice Principal (Dr. Rostova)
        ↓  Inherits: REPORT_CARD_SIGN, TEACHER_LEAVE_SANCTION, TIMETABLE_APPROVE
        ✕  Blocked: PERMANENT_STAFF_EXIT, EXPENSE_AUTHORIZATION > ₹1,00,000, BANK_CHANGE
  ```
- **[DESIGN DECISION] Delegation Invariant Rules:**
  - Mandatory parameters: `delegated_from_user_id`, `delegated_to_user_id`, `permissions_bundle`, `valid_from`, `valid_until`.
  - Hard expiry enforced at database and security context level (`NOW() <= valid_until`).
  - Active delegations are immutable; expanding authority requires revoking the active delegation and issuing a new delegation ticket.

---

## 8. Closed Academic Year & Historical Record Authorization

- **[DESIGN DECISION] Academic Year Temporal Access Bounds:**
  - `ACTIVE_YEAR`: Full operational privileges (Attendance, Marks Entry, Invoicing).
  - `CLOSED_YEAR`: Read-only access across all roles. Marks, attendance, and fee invoices are immutable.
  - `HISTORICAL_CORRECTION_WORKFLOW`: Modifying a closed-year record requires an explicit `HISTORICAL_RECORD_AMEND` permission, Principal digital signature, and board audit notation.

---

## 9. File & Document Download Authorization

- **[DESIGN DECISION] Context-Inherited Object Access:**  
  Possessing an S3 / GCS presigned storage key does not confer file authorization. The backend download gateway verifies:
  1. File tenant matches caller tenant (`file_asset.school_id == caller.school_id`).
  2. Parent access requires linking to the file's student (`file_asset.student_id == parent.ward_id`).
  3. Report card download requires state `is_published == TRUE`.
  4. Complaint evidence marked internal is denied to parents.

---

## 10. Sensitive Export Authorization

- **[DESIGN DECISION] Export vs View Segregation:**  
  `VIEW` permission does **not** grant `EXPORT` permission.  
  Exporting student directories, financial ledgers, or attendance registers requires:
  - `SENSITIVE_EXPORT` permission.
  - Step-Up TOTP MFA verification.
  - Mandatory audit log recording record count, filter criteria, and client IP.
  - Dynamic visual watermark embedding the exporting administrator's ID and timestamp.

---

## 11. Account Status Enforcement

- **[DESIGN DECISION] Identity State Invariants:**
  - `LOCKED`: Authentication rejected (`HTTP 423 Locked`).
  - `SUSPENDED`: Authentication accepted but all operational requests return `HTTP 403 Forbidden` with account review notice.
  - `EXITED`: Permanent authentication block. All historical authored records remain intact.

---

## 12. Authorization Failure Responses

- **[DESIGN DECISION] Anti-Enumeration Failure Policy:**
  - Unauthenticated request: `HTTP 401 Unauthorized` with `WWW-Authenticate: Bearer`.
  - Authenticated but unauthorized role: `HTTP 403 Forbidden`.
  - Cross-tenant probe (`school_id != caller.school_id`): Return `HTTP 404 Not Found` (never leak whether a tenant or resource exists in another school partition).

---

## 13. Minimum Required Spring Security Architecture

```
Incoming Request
      ↓
JwtAuthenticationFilter (Validates Token Signature & Expiry)
      ↓
TenantContextFilter (Resolves Tenant UUID from Claims & Sets RLS Session)
      ↓
CompositeAuthorizationFilter
   ├── Step 1: FeatureEntitlementEvaluator (Is module licensed for School?)
   ├── Step 2: RoleHierarchy & PermissionEvaluator (@PreAuthorize)
   ├── Step 3: DomainRelationshipEvaluator (Is Teacher assigned to Class/Subject?)
   └── Step 4: WorkflowStateEvaluator (Is Window OPEN? Is Report Card SIGNED?)
      ↓
Controller & Service Execution
      ↓
Repository Layer (Protected by PostgreSQL RLS app.current_school_id)
```

---

## 14. Authorization Test Plan

- **[DESIGN DECISION] Mandatory Test Scenarios:**
  - *TC-AUTH-01 (Cross-Tenant):* School A Admin attempts GET on School B student $\rightarrow$ Expect `HTTP 404`.
  - *TC-AUTH-02 (Subject Allocation):* Teacher attempts marks entry on unassigned subject $\rightarrow$ Expect `HTTP 403`.
  - *TC-AUTH-03 (Parent Isolation):* Parent modifies student ID query param to peer student $\rightarrow$ Expect `HTTP 403`.
  - *TC-AUTH-04 (Maker-Checker):* Admin recording payment attempts self-verification $\rightarrow$ Expect `HTTP 403`.
  - *TC-AUTH-05 (Principal Conflict):* Principal who authored Class 10-A marks attempts self-endorsement $\rightarrow$ Expect `HTTP 403`.
  - *TC-AUTH-06 (Hall Ticket Lock):* Class Teacher attempts release for student with pending fees and no override $\rightarrow$ Expect `HTTP 400/403`.

---

## 15. Open Product Decisions

1. **[OPEN DECISION #1 - PO APPROVAL REQUIRED] Offline Payment Verification Threshold:**  
   Should maker-checker dual authorization be required for *all* cash payments, or only those exceeding a statutory threshold (e.g. > ₹10,000)?
2. **[OPEN DECISION #2 - PO APPROVAL REQUIRED] Principal Self-Approval Fallback:**  
   If the Principal teaches a subject and the school has no Vice Principal, should the marks endorsement fall back to the School Governing Board / Academic Dean or require an external Platform Auditor verification?
3. **[OPEN DECISION #3 - PO APPROVAL REQUIRED] Step-Up MFA Re-auth Window:**  
   For sensitive exports and hall ticket overrides, should step-up MFA remain valid for 15 minutes of idle session or require fresh OTP for every single discrete export?
