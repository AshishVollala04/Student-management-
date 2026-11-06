# Phase 13: FutureSchool Production API Contract Specification

**Product:** FutureSchool — Commercial Multi-School Management SaaS Platform  
**Target Architecture:** Java 21 LTS · Spring Boot 3.3.x · Spring MVC REST · Spring Security 6 · PostgreSQL 16 RLS  
**Document Classification:** Production API Specification & Interface Contract (Phase 13)  
**Status:** Pre-Implementation Contract Specification (No controllers, services, repositories, or frontend integration code are created in this phase)  

---

## 1. API Architecture Overview

### 1.1 Architectural Invariants & Scope Principles
- **[DESIGN DECISION] Headless REST Interface Contract:**  
  The FutureSchool backend exposes an opinionated, resource-oriented, stateless RESTful HTTP/JSON API under base namespace `/api/v1`. The API operates strictly as a decoupled contract serving both the React 19 web frontend, mobile applications, and authorized external webhook dispatchers.
- **[DESIGN DECISION] Context-Derived Multi-Tenancy (Zero Trust in Client School ID):**  
  For all school-scoped operations, client applications **must never** supply `schoolId` as a query parameter or body attribute to access domain resources. The backend exclusively resolves tenancy from the cryptographically verified JWT bearer token context:
  $$\text{Bearer JWT} \longrightarrow \text{SecurityContext} \longrightarrow \text{tenant\_id} \longrightarrow \text{PostgreSQL Session } (\texttt{SET LOCAL app.current\_school\_id = ?})$$
  Any client attempt to supply a foreign or mismatched `schoolId` in school-level APIs is rejected or ignored.
- **[DESIGN DECISION] Platform Admin API Segregation:**  
  Platform administration endpoints reside under `/api/v1/platform/*`. These endpoints are isolated by security policy, restricted strictly to principals holding `ROLE_PLATFORM_ADMIN`, and are the only endpoints permitted to pass target `schoolId` parameters when provisioning, suspending, or auditing tenant instances.

---

## 2. API Naming and Versioning Standard

### 2.1 Versioning Convention
- **[DESIGN DECISION] Path-Based Major Versioning:**  
  URL path versioning `/api/v1` is mandated for all public APIs. Minor and backward-compatible changes (additive fields in responses, optional query parameters) are made in-place. Breaking changes (removing fields, altering semantics, changing URL hierarchy) necessitate incrementing to `/api/v2`.
- **[DESIGN DECISION] Resource-Oriented Naming:**  
  - URLs utilize lowercase hyphen-delimited plural nouns (`/api/v1/leave-requests`, `/api/v1/report-cards`).
  - Verbs in URLs are prohibited. State transitions are modeled as sub-resources or dedicated lifecycle actions:
    - Preferred: `POST /api/v1/report-cards/{reportCardId}/approvals`
    - Prohibited: `POST /api/v1/doApproveReportCard`
  - Self-identity endpoints utilize singleton path `/api/v1/me`.

---

## 3. Standard Response & Error Envelope Contracts

### 3.1 Success Response Envelope
- **[DESIGN DECISION] Standardized JSON Envelope:**  
  Every 2xx API response uses a uniform top-level envelope providing consistent structure for client interceptors:

#### Single Resource Envelope:
```json
{
  "data": {
    "id": "18f3a56e-8d2b-4261-9c88-e50a58a98b10",
    "type": "homework",
    "attributes": {
      "title": "Quadratic Equations Problem Set 4",
      "dueDate": "2026-11-10T23:59:59Z",
      "status": "PUBLISHED"
    }
  },
  "meta": {
    "timestamp": "2026-11-04T23:30:00Z",
    "requestId": "req_01JB5V8Z4N8P7A2R1M9K4Q2W"
  }
}
```

#### Paginated Collection Envelope:
```json
{
  "data": [
    {
      "id": "18f3a56e-8d2b-4261-9c88-e50a58a98b10",
      "title": "Quadratic Equations Problem Set 4",
      "dueDate": "2026-11-10T23:59:59Z",
      "status": "PUBLISHED"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "totalElements": 48,
    "totalPages": 3,
    "timestamp": "2026-11-04T23:30:00Z",
    "requestId": "req_01JB5V8Z4N8P7A2R1M9K4Q2W"
  }
}
```

### 3.2 Standard Error Response Contract (RFC 7807 Extended)
- **[DESIGN DECISION] Uniform Error Schema:**  
  All 4xx and 5xx responses emit a standardized RFC 7807 compliant error object:
```json
{
  "timestamp": "2026-11-04T23:30:00Z",
  "status": 422,
  "code": "VALIDATION_FAILED",
  "message": "The request contains invalid or unprocessable values.",
  "fieldErrors": [
    {
      "field": "marksObtained",
      "code": "MAX_EXCEEDED",
      "message": "Marks obtained (105) cannot exceed maximum evaluation marks (100)."
    }
  ],
  "requestId": "req_01JB5V8Z4N8P7A2R1M9K4Q2W"
}
```

#### HTTP Status Code Mapping:
- `400 Bad Request`: Malformed JSON or unparseable payload structure.
- `401 Unauthorized`: Missing, expired, or invalid JWT signature.
- `403 Forbidden`: Authenticated user lacks required permission, role, or dynamic assignment.
- `404 Not Found`: Target resource does not exist within the tenant partition (used on foreign tenant probes to prevent tenant enumeration).
- `409 Conflict`: Concurrency version conflict (`OptimisticLockException`) or unique constraint collision.
- `412 Precondition Failed`: `If-Match` ETag mismatch.
- `422 Unprocessable Entity`: Business invariant violation (e.g., marks entered outside open window).
- `429 Too Many Requests`: Rate limiter exceeded (`Retry-After` header included).
- `500 Internal Server Error`: Sanitized unhandled exception (internal stack traces never exposed to client).
- `502 / 503 Bad Gateway / Unavailable`: External upstream gateway failure (e.g. SMS provider or payment gateway timeout).

---

## 4. Authentication API Contract (`/api/v1/auth`)

### 4.1 Login Endpoint
- **HTTP Method:** `POST`
- **Path:** `/api/v1/auth/login`
- **Purpose:** Authenticate user credentials and establish portal session context.
- **Actor:** `ANONYMOUS` (Student, Parent, Teacher, Principal, Admin, Platform Admin)
- **Required Permission:** None (Public)
- **Tenant Scope:** Resolved automatically from user record or login ID prefix.
- **Valid Source State:** User account status `ACTIVE`.
- **Request Schema:**
```json
{
  "loginId": "GVS-2027-0001",
  "password": "SecurePassword#2027",
  "portal": "STUDENT",
  "deviceInfo": {
    "userAgent": "Mozilla/5.0 ...",
    "ipAddress": "203.0.113.195",
    "clientPlatform": "WEB_SPA"
  }
}
```
- **Validation Rules:**
  - `loginId`: Non-empty string. For staff: email/staff code. For students/parents: Student ID.
  - `portal`: Enum: `STUDENT`, `PARENT`, `TEACHER`, `PRINCIPAL`, `ADMIN`, `PLATFORM_ADMIN`.
  - When `loginId` is Student ID, both `STUDENT` and `PARENT` portal contexts are acceptable; backend loads specific portal scopes.
- **Success Response (200 OK):**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "e4f8d21b-5689-49c0-9a2d-88b0a9f471e1",
      "displayName": "Aarav Sharma",
      "loginId": "GVS-2027-0001",
      "portal": "STUDENT",
      "schoolId": "d93adb49-91de-4613-9846-7b7409120f2d",
      "schoolCode": "GVS",
      "mfaRequired": false
    }
  },
  "meta": {
    "timestamp": "2026-11-04T23:30:00Z",
    "requestId": "req_01JB5V8Z4N8P7A2R1M9K4Q2W"
  }
}
```
*(Refresh token set as `HttpOnly`, `Secure`, `SameSite=Strict` cookie `__Secure-fs_rt`)*
- **Errors:** `401 INVALID_CREDENTIALS`, `423 ACCOUNT_LOCKED`, `429 TOO_MANY_ATTEMPTS`.
- **Idempotency Required?** No
- **Step-Up Required?** No
- **Audit Required?** Yes (`LOGIN_SUCCESS` / `LOGIN_FAILURE`)

---

### 4.2 Current User Context Endpoint (`/api/v1/me`)
- **HTTP Method:** `GET`
- **Path:** `/api/v1/me`
- **Purpose:** Retrieve the full authenticated user runtime profile, active allocations, permissions, and school branding.
- **Actor:** Authenticated principal (`STUDENT`, `PARENT`, `TEACHER`, `PRINCIPAL`, `ADMIN`, `PLATFORM_ADMIN`)
- **Required Permission:** Any authenticated role
- **Tenant Scope:** Scoped to caller tenant
- **Success Response (200 OK):**
```json
{
  "data": {
    "userId": "e4f8d21b-5689-49c0-9a2d-88b0a9f471e1",
    "portal": "TEACHER",
    "name": "Vikram Sen",
    "email": "vikram.sen@greenwoodvalley.edu",
    "school": {
      "id": "d93adb49-91de-4613-9846-7b7409120f2d",
      "code": "GVS",
      "name": "Greenwood Valley School",
      "logoUrl": "/assets/branding/gvs_logo.svg",
      "primaryColor": "#1e3a8a",
      "academicYear": {
        "id": "ay_2026_2027",
        "code": "2026-2027",
        "isCurrent": true
      }
    },
    "entitlements": [
      "core_academics",
      "homework_and_quizzes",
      "fleet_transport",
      "fee_management",
      "ai_tutor_student",
      "teacher_ai_copilot"
    ],
    "permissions": [
      "HOMEWORK_CREATE",
      "HOMEWORK_REVIEW",
      "MARKS_ENTRY",
      "ATTENDANCE_ROLL_CALL"
    ],
    "teacherContext": {
      "isClassTeacher": true,
      "assignedClass": {
        "classId": "cls_10",
        "className": "Class 10",
        "sectionId": "sec_10_a",
        "sectionName": "A"
      },
      "subjectAllocations": [
        {
          "allocationId": "alloc_01",
          "subjectId": "sub_math_10",
          "subjectName": "Mathematics",
          "classId": "cls_10",
          "sectionId": "sec_10_a"
        },
        {
          "allocationId": "alloc_02",
          "subjectId": "sub_math_9",
          "subjectName": "Mathematics",
          "classId": "cls_09",
          "sectionId": "sec_09_b"
        }
      ]
    }
  },
  "meta": {
    "timestamp": "2026-11-04T23:30:00Z",
    "requestId": "req_01JB5V8Z4N8P7A2R1M9K4Q2W"
  }
}
```

---

## 5. Pagination, Filtering, Sorting & Idempotency Standards

### 5.1 Pagination Standard
- **[DESIGN DECISION] Zero-Indexed Offset Pagination:**  
  - Query parameters: `page` (default `0`), `size` (default `20`, maximum `100`).
  - Response metadata provides: `page`, `size`, `totalElements`, `totalPages`.
  - For immutable high-velocity logs (`/api/v1/audit`), cursor-based pagination is supported via `cursor` and `limit`.

### 5.2 Sorting & Filtering Standard
- **[DESIGN DECISION] Whitelisted Field Sorting:**  
  - Format: `sort=fieldName,asc` or `sort=fieldName,desc`.
  - Prohibited: Arbitrary SQL column names. Controller validation strictly permits domain DTO properties (e.g. `createdAt`, `dueDate`, `rollNumber`).
  - Filtering parameters: explicit URL query params (e.g., `status=PUBLISHED&academicYearId=ay_2026_2027&fromDate=2026-11-01`).

### 5.3 Concurrency & Optimistic Locking Standard
- **[DESIGN DECISION] ETag / If-Match Header Contract:**  
  Mutable resources (`marks_draft`, `fee_structures`, `report_cards`, `timetables`) provide a `version` attribute in JSON and emit an `ETag: W/"v_{version}"` response header.
  - On update (`PUT`/`PATCH`), clients must supply `If-Match: W/"v_{version}"`.
  - If server version exceeds provided version, server rejects with `412 Precondition Failed` or `409 Conflict`.

### 5.4 Idempotency Standard
- **[DESIGN DECISION] Distributed Idempotency Key:**  
  All state-creating or consequential financial/activation endpoints require header:
  `Idempotency-Key: <UUIDv4>`
  - Scope: Tenant UUID + User UUID + Endpoint Path + Idempotency-Key.
  - Storage: Redis cache with 24-hour TTL storing the initial response payload and hash of the request body.
  - Replay behavior: If an identical request arrives with the same key, return the cached response with header `Idempotency-Replay: true`. If the request body differs, return `409 IDEMPOTENCY_KEY_PAYLOAD_MISMATCH`.

---

## 6. File Upload & Binary Storage Standard (`/api/v1/files`)

### 6.1 Two-Phase Authorized Upload Workflow
- **[DESIGN DECISION] Pre-Signed Direct-to-Storage Architecture:**  
  Application servers never stream large raw binary payloads directly to disk. File uploads follow an authorized two-phase ticket pattern:
  1. **Phase 1: Ticket Issuance (`POST /api/v1/files/upload-tickets`):**  
     Client submits file metadata (MIME type, file size, intended purpose). Server validates tenant storage quota, file extension, and issues a time-bounded (15 min) pre-signed PUT URL.
  2. **Phase 2: Direct Client Upload:**  
     Client streams binary payload directly to Cloud Storage with Content-Type header.
  3. **Phase 3: Attachment Confirmation (`POST /api/v1/files/confirmations`):**  
     Client confirms upload; backend runs async malware scan and links the file ID to the domain entity.

#### Supported File Constraints:
| Purpose | Allowed MIME Types | Max Size | Tenant Scoped? | Retention Policy |
| :--- | :--- | :--- | :--- | :--- |
| `STUDENT_PHOTO` | `image/jpeg`, `image/png`, `image/webp` | 2 MB | Yes | Active Enrollment + 5 yrs |
| `HOMEWORK_ATTACHMENT` | `application/pdf`, `image/jpeg`, `image/png` | 10 MB | Yes | Academic Year + 1 yr |
| `STUDENT_SUBMISSION` | `application/pdf`, `image/jpeg`, `image/png` | 15 MB | Yes | Academic Year + 1 yr |
| `REPORT_CARD_PDF` | `application/pdf` | 5 MB | Yes | Permanent Institutional Archive |
| `PAYMENT_RECEIPT` | `application/pdf` | 2 MB | Yes | Statutory 8 yrs (Finance) |
| `LEAVE_MEDICAL_CERT` | `application/pdf`, `image/jpeg` | 5 MB | Yes | Academic Year + 1 yr |

---

## 7. Master Domain API Catalogs

---

### 7.1 Student API Catalog (`/api/v1/students/me/*`)

| Method | Path | Purpose | Required Permission | State / Constraint | Idempotent? | Step-Up? | Audit? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/students/me/profile` | View own student profile & enrollment | `STUDENT_PORTAL_VIEW` | Active Enrollment | No | No | No |
| `GET` | `/api/v1/students/me/attendance` | View own historical daily attendance | `ATTENDANCE_VIEW` | Any | No | No | No |
| `GET` | `/api/v1/students/me/timetable` | View weekly section timetable | `STUDENT_PORTAL_VIEW` | Published Timetable | No | No | No |
| `GET` | `/api/v1/students/me/homework` | List assigned homework tasks | `STUDENT_PORTAL_VIEW` | Section Enrolled | No | No | No |
| `GET` | `/api/v1/students/me/homework/{id}` | View homework details & submission | `STUDENT_PORTAL_VIEW` | Section Enrolled | No | No | No |
| `POST`| `/api/v1/students/me/homework/{id}/submissions` | Submit completed homework | `HOMEWORK_SUBMIT` | `due_date >= NOW()` | Yes | No | Yes |
| `GET` | `/api/v1/students/me/quizzes` | List scheduled & open quizzes | `STUDENT_PORTAL_VIEW` | Section Enrolled | No | No | No |
| `POST`| `/api/v1/students/me/quizzes/{id}/attempts` | Start a quiz attempt | `QUIZ_TAKE` | `status == OPEN` | Yes | No | Yes |
| `POST`| `/api/v1/students/me/quizzes/{id}/attempts/{attemptId}/answers` | Save question answer | `QUIZ_TAKE` | Attempt Active | Yes | No | No |
| `POST`| `/api/v1/students/me/quizzes/{id}/attempts/{attemptId}/final-submission` | Submit quiz for scoring | `QUIZ_TAKE` | Attempt Active | Yes | No | Yes |
| `GET` | `/api/v1/students/me/marks` | View published exam marks | `MARKS_VIEW` | `is_published == TRUE` | No | No | No |
| `GET` | `/api/v1/students/me/report-cards` | List published term report cards | `REPORT_CARD_VIEW` | `is_published == TRUE` | No | No | No |
| `GET` | `/api/v1/students/me/hall-tickets` | List released exam hall tickets | `HALL_TICKET_DOWNLOAD`| `released == TRUE` | No | No | Yes |
| `POST`| `/api/v1/students/me/ai-tutor/queries` | Ask curriculum doubt to AI tutor | `AI_TUTOR_QUERY` | Enrolled & Quota > 0 | No | No | No |

---

### 7.2 Parent API Catalog (`/api/v1/parents/me/*`)

*(All Parent operations are automatically bound to the session's single registered Student ID)*

| Method | Path | Purpose | Required Permission | State / Constraint | Idempotent? | Step-Up? | Audit? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/parents/me/ward-overview` | View ward academic snapshot | `PARENT_PORTAL_VIEW` | Active Ward | No | No | No |
| `GET` | `/api/v1/parents/me/attendance` | View ward attendance records | `ATTENDANCE_VIEW` | Active Ward | No | No | No |
| `POST`| `/api/v1/parents/me/leave-requests` | Submit student leave application | `LEAVE_REQUEST_SUBMIT` | `fromDate >= TODAY` | Yes | No | Yes |
| `GET` | `/api/v1/parents/me/invoices` | List fee invoices for ward | `FEE_VIEW` | Active Ward | No | No | No |
| `POST`| `/api/v1/parents/me/payment-orders` | Initiate online fee payment order | `FEE_PAY` | Invoice Unpaid | Yes | No | Yes |
| `GET` | `/api/v1/parents/me/receipts/{id}` | Download official fee receipt | `FEE_VIEW` | Invoice Paid | No | No | Yes |
| `GET` | `/api/v1/parents/me/report-cards` | View ward published report cards | `REPORT_CARD_VIEW` | `is_published == TRUE` | No | No | No |
| `POST`| `/api/v1/parents/me/report-cards/{id}/acknowledgements` | Acknowledge report card | `REPORT_CARD_ACKNOWLEDGE`| Published Report Card | Yes | No | Yes |
| `GET` | `/api/v1/parents/me/transport` | View assigned bus route & stop | `TRANSPORT_VIEW` | Bus Subscribed | No | No | No |
| `POST`| `/api/v1/parents/me/pickup-authorizations` | Issue temporary pickup OTP pass | `PICKUP_AUTHORIZE` | Active Ward | Yes | Yes (OTP) | Yes |
| `POST`| `/api/v1/parents/me/ptm-bookings` | Book PTM conference slot | `PTM_BOOK` | Booking Window Open | Yes | No | Yes |
| `POST`| `/api/v1/parents/me/complaints` | Submit formal grievance/feedback | `COMPLAINT_SUBMIT` | Active Ward | Yes | No | Yes |
| `POST`| `/api/v1/parents/me/events/{id}/consents` | Submit signed event consent | `EVENT_CONSENT_SUBMIT` | Event Published | Yes | No | Yes |

---

### 7.3 Teacher API Catalog (`/api/v1/teachers/me/*`)

*(Scoped strictly to dynamic Teacher Subject Allocations & Class Teacher Assignments)*

| Method | Path | Purpose | Required Permission | Relationship Scope | Idempotent? | Step-Up? | Audit? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/teachers/me/allocations` | List assigned classes & subjects | `TEACHER_PORTAL_VIEW` | Active Staff Member | No | No | No |
| `POST`| `/api/v1/teachers/me/homework` | Create homework assignment | `HOMEWORK_CREATE` | Allocated Subject Teacher | Yes | No | Yes |
| `GET` | `/api/v1/teachers/me/homework/{id}/submissions` | View student homework submissions | `HOMEWORK_REVIEW` | Allocated Subject Teacher | No | No | No |
| `POST`| `/api/v1/teachers/me/homework-submissions/{id}/reviews` | Grade and provide homework feedback | `HOMEWORK_REVIEW` | Allocated Subject Teacher | Yes | No | Yes |
| `GET` | `/api/v1/teachers/me/attendance/sheet` | Load class attendance roster | `ATTENDANCE_ROLL_CALL` | Assigned Class Teacher | No | No | No |
| `POST`| `/api/v1/teachers/me/attendance/morning-session` | Submit morning roll-call attendance | `ATTENDANCE_ROLL_CALL` | Assigned Class Teacher | Yes | No | Yes |
| `POST`| `/api/v1/teachers/me/attendance/afternoon-session` | Submit afternoon roll-call | `ATTENDANCE_ROLL_CALL` | Assigned Class Teacher | Yes | No | Yes |
| `POST`| `/api/v1/teachers/me/attendance/correction-requests` | Request attendance correction | `ATTENDANCE_CORRECT` | Assigned Class Teacher | Yes | No | Yes |
| `GET` | `/api/v1/teachers/me/leave-requests/pending` | Review ward leave applications | `LEAVE_REVIEW` | Assigned Class Teacher | No | No | No |
| `POST`| `/api/v1/teachers/me/leave-requests/{id}/endorsements` | Endorse/recommend ward leave | `LEAVE_REVIEW` | Assigned Class Teacher | Yes | No | Yes |
| `POST`| `/api/v1/teachers/me/ai-copilot/lesson-plans` | Generate AI-assisted lesson plan | `TEACHER_AI_GENERATE` | Allocated Subject Teacher | No | No | No |

---

### 7.4 Marks Workflow API Catalog (`/api/v1/marks/*`)

- **[DESIGN DECISION] Explicit Lifecycle State Machine:**  
  Marks cannot be patched arbitrarily. Every endpoint models an authorized state transition:
  $$\texttt{DRAFT} \xrightarrow[\text{Subject Teacher}]{\text{submit}} \texttt{SUBMITTED\_TO\_MENTOR} \xrightarrow[\text{Class Teacher}]{\text{review}} \texttt{MENTOR\_ACCEPTED} \xrightarrow[\text{Principal}]{\text{endorse}} \texttt{PRINCIPAL\_APPROVED} \xrightarrow[\text{Class Teacher}]{\text{publish}} \texttt{PUBLISHED}$$

| Method | Path | Purpose | Required Permission | Relationship / State Precondition | Idempotent? | Step-Up? | Audit? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/marks/marksheets/{id}` | Load marksheet entry matrix | `MARKS_ENTRY` | Subject Teacher or Class Teacher | No | No | No |
| `PUT` | `/api/v1/marks/marksheets/{id}/draft` | Save draft marks matrix | `MARKS_ENTRY` | Subject Teacher & `status == DRAFT` | Yes | No | No |
| `POST`| `/api/v1/marks/marksheets/{id}/submissions` | Submit marksheet to Class Teacher | `MARKS_SUBMIT_REVIEW` | Subject Teacher & `status == DRAFT` | Yes | No | Yes |
| `POST`| `/api/v1/marks/marksheets/{id}/returns` | Return marksheet with revision notes | `MARKS_REVIEW` | Class Teacher & `status == SUBMITTED` | Yes | No | Yes |
| `POST`| `/api/v1/marks/marksheets/{id}/acceptances`| Accept marksheet into class consolidation | `MARKS_ACCEPT` | Class Teacher & `status == SUBMITTED` | Yes | No | Yes |
| `POST`| `/api/v1/marks/imports/staging` | Upload Excel marks import file | `MARKS_IMPORT` | Subject Teacher & `status == DRAFT` | Yes | No | Yes |
| `POST`| `/api/v1/marks/imports/{batchId}/commit` | Commit validated staging rows | `MARKS_IMPORT` | Staging Validation Succeeded | Yes | No | Yes |
| `POST`| `/api/v1/marks/marksheets/{id}/reopen-requests`| Request emergency marks edit window | `MARKS_REOPEN_REQUEST` | Subject Teacher & `window == CLOSED` | Yes | No | Yes |
| `POST`| `/api/v1/marks/marksheets/{id}/reopen-approvals`| Principal approve reopened marks entry | `MARKS_REOPEN_APPROVE` | Principal Only | Yes | Yes (MFA) | Yes |

---

### 7.5 Report Card Workflow API Catalog (`/api/v1/report-cards/*`)

| Method | Path | Purpose | Required Permission | Preconditions | Idempotent? | Step-Up? | Audit? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/report-cards/classes/{sectionId}/summary` | Class report card readiness audit | `REPORT_CARD_PREPARE` | Class Teacher (All marks accepted) | No | No | No |
| `POST`| `/api/v1/report-cards/classes/{sectionId}/generations` | Generate draft report cards | `REPORT_CARD_PREPARE` | Class Teacher & Status `READY` | Yes | No | Yes |
| `PUT` | `/api/v1/report-cards/{id}/remarks` | Update conduct & mentor remarks | `REPORT_CARD_PREPARE` | Class Teacher & Status `DRAFT` | Yes | No | No |
| `POST`| `/api/v1/report-cards/classes/{sectionId}/submissions` | Submit entire class to Principal | `REPORT_CARD_SUBMIT` | Class Teacher & Status `COMPILED`| Yes | No | Yes |
| `POST`| `/api/v1/report-cards/{id}/principal-approvals` | Principal approve single report card | `REPORT_CARD_APPROVE` | Principal & Status `SUBMITTED` | Yes | No | Yes |
| `POST`| `/api/v1/report-cards/classes/{sectionId}/batch-approvals` | Principal approve whole section | `REPORT_CARD_APPROVE` | Principal & All Marks Endorsed | Yes | Yes (MFA) | Yes |
| `POST`| `/api/v1/report-cards/{id}/returns` | Principal return card with note | `REPORT_CARD_RETURN` | Principal & Status `SUBMITTED` | Yes | No | Yes |
| `POST`| `/api/v1/report-cards/classes/{sectionId}/publications` | Class Teacher publish approved cards | `REPORT_CARD_PUBLISH` | Class Teacher & All Approved | Yes | Yes (MFA) | Yes |

---

### 7.6 Principal Executive API Catalog (`/api/v1/principal/*`)

| Method | Path | Purpose | Required Permission | Scope / Constraints | Idempotent? | Step-Up? | Audit? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/principal/dashboard` | Executive KPI & alerts summary | `PRINCIPAL_DASHBOARD_VIEW`| Institutional Scope | No | No | No |
| `GET` | `/api/v1/principal/action-center` | Pending executive approvals queue | `PRINCIPAL_ACTION_VIEW` | Institutional Scope | No | No | No |
| `POST`| `/api/v1/principal/staff-leaves/{id}/approvals` | Sanction or reject teacher leave | `STAFF_LEAVE_SANCTION` | Status `PENDING` | Yes | No | Yes |
| `POST`| `/api/v1/principal/admissions/{id}/approvals` | Sanction admission candidate | `ADMISSIONS_APPROVE` | Verified Candidate File | Yes | No | Yes |
| `POST`| `/api/v1/principal/student-exits/{id}/approvals` | Sanction TC / exit clearance | `STUDENT_EXIT_APPROVE` | All Dept Dues Cleared | Yes | Yes (MFA) | Yes |
| `POST`| `/api/v1/principal/fee-structures/{id}/approvals`| Sanction proposed fee structure | `FEE_STRUCTURE_APPROVE` | Status `DRAFT` | Yes | Yes (MFA) | Yes |
| `POST`| `/api/v1/principal/refunds/{id}/approvals` | Sanction parent fee refund | `REFUND_APPROVE` | Audit Validated Case | Yes | Yes (MFA) | Yes |
| `POST`| `/api/v1/principal/hall-tickets/{studentId}/overrides`| Release hall ticket despite dues | `HALL_TICKET_OVERRIDE`| Hardship Justification Req | Yes | Yes (MFA) | Yes |
| `POST`| `/api/v1/principal/emergency-broadcasts` | Dispatch emergency campus alert | `EMERGENCY_BROADCAST` | High Priority Broadcast | Yes | Yes (MFA) | Yes |
| `GET` | `/api/v1/principal/my-teaching` | Principal's assigned classes | `TEACHER_PORTAL_VIEW` | Assigned Subject Allocation | No | No | No |

---

### 7.7 Admin Operational API Catalog (`/api/v1/admin/*`)

| Method | Path | Purpose | Required Permission | Bundle Scope | Idempotent? | Step-Up? | Audit? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/dashboard` | Operational daily work-center | `ADMIN_DASHBOARD_VIEW` | Operational Scope | No | No | No |
| `POST`| `/api/v1/admin/admissions` | Create new admission draft | `ADMISSIONS_CREATE` | Admissions Admin | Yes | No | Yes |
| `POST`| `/api/v1/admin/admissions/{id}/activations` | Activate enrolled student | `ADMISSIONS_ACTIVATE` | Approved by Principal | Yes | No | Yes |
| `GET` | `/api/v1/admin/students/{id}/360` | Full administrative student view | `STUDENT_MANAGE` | Student Admin | No | No | Yes |
| `POST`| `/api/v1/admin/staff` | Onboard new staff employee | `STAFF_ADMIN` | Staff Admin | Yes | No | Yes |
| `POST`| `/api/v1/admin/academic-years` | Configure next academic year | `ACADEMIC_YEAR_SETUP`| Academic Ops Admin | Yes | No | Yes |
| `POST`| `/api/v1/admin/allocations` | Assign subject teacher mapping | `SUBJECT_ALLOCATION` | Academic Ops Admin | Yes | No | Yes |
| `POST`| `/api/v1/admin/fee-structures` | Create fee structure proposal | `FEE_STRUCTURE_MANAGE`| Finance Admin | Yes | No | Yes |
| `POST`| `/api/v1/admin/billing-runs` | Execute batch fee generation | `BILLING_RUN_EXECUTE` | Approved Structure | Yes | Yes (MFA) | Yes |
| `POST`| `/api/v1/admin/offline-payments` | Record offline cash/cheque voucher | `RECORD_OFFLINE_PAYMENT`| Finance Admin | Yes | No | Yes |
| `POST`| `/api/v1/admin/offline-payments/{id}/verifications`| Verify & issue receipt (Maker-Checker)| `VERIFY_OFFLINE_PAYMENT`| Must not be creator | Yes | No | Yes |
| `POST`| `/api/v1/admin/promotions/executions` | Execute annual grade promotion | `PROMOTION_EXECUTE` | Principal Approved List | Yes | Yes (MFA) | Yes |
| `POST`| `/api/v1/admin/security/staff-resets`| Issue staff temporary credential | `RESET_STAFF_CREDENTIAL`| Security Admin | Yes | Yes (MFA) | Yes |
| `POST`| `/api/v1/admin/sensitive-exports` | Generate sensitive CSV/PDF dump | `SENSITIVE_EXPORT` | Security Admin | Yes | Yes (MFA) | Yes |

---

### 7.8 Platform Admin API Catalog (`/api/v1/platform/*`)

*(Strictly restricted to SaaS platform operators holding `ROLE_PLATFORM_ADMIN`)*

| Method | Path | Purpose | Required Permission | Target Scope | Idempotent? | Step-Up? | Audit? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/platform/schools` | List all provisioned school tenants | `PLATFORM_GOVERNANCE` | Multi-Tenant Platform | No | No | No |
| `POST`| `/api/v1/platform/schools` | Provision new school tenant | `TENANT_PROVISION` | SaaS Platform Engine | Yes | Yes (MFA) | Yes |
| `GET` | `/api/v1/platform/schools/{id}` | Inspect tenant health & usage | `PLATFORM_GOVERNANCE` | Specific Tenant | No | No | No |
| `POST`| `/api/v1/platform/schools/{id}/activations` | Transition tenant to `ACTIVE` | `TENANT_STATE_MANAGE` | Setup Complete | Yes | Yes (MFA) | Yes |
| `POST`| `/api/v1/platform/schools/{id}/suspensions` | Suspend tenant for contract breach | `TENANT_STATE_MANAGE` | Any Active Tenant | Yes | Yes (MFA) | Yes |
| `PUT` | `/api/v1/platform/schools/{id}/subscriptions` | Update SaaS contract & student rate | `SUBSCRIPTION_MANAGE`| Specific Tenant | Yes | Yes (MFA) | Yes |
| `PUT` | `/api/v1/platform/schools/{id}/entitlements` | Enable/disable licensed add-ons | `ENTITLEMENT_MANAGE` | Specific Tenant | Yes | No | Yes |
| `GET` | `/api/v1/platform/billing-reconciliations` | Global monthly billing run | `PLATFORM_BILLING` | SaaS Finance Engine | No | No | Yes |
| `POST`| `/api/v1/platform/support-access-tokens` | Request supervised support token | `SUPERVISED_SUPPORT` | Dual-Party Sign-off | Yes | Yes (MFA) | Yes |
| `GET` | `/api/v1/platform/audit-logs` | Global immutable audit stream | `PLATFORM_AUDIT` | Global Platform Stream | No | No | Yes |

---

## 8. Specific Lifecycle & Workflow Contract Details

### 8.1 Admissions API (`/api/v1/admin/admissions`)
- **[DESIGN DECISION] Non-Admitted Draft Isolation:**  
  Admissions are staged in `admission_drafts`. A draft record does **not** create a student user account, student enrollment, fee invoices, attendance roster eligibility, or bus seat allocation.
- **Request Schema (`POST /api/v1/admin/admissions`):**
```json
{
  "academicYearId": "ay_2026_2027",
  "targetClassId": "cls_09",
  "applicant": {
    "firstName": "Dev",
    "lastName": "Patel",
    "dob": "2012-05-14",
    "gender": "MALE",
    "bloodGroup": "O_POSITIVE",
    "aadhaarNumberEncrypted": "enc_aadhaar_89a7f..."
  },
  "guardians": [
    {
      "relationship": "FATHER",
      "fullName": "Sanjay Patel",
      "phone": "+919876543210",
      "email": "sanjay.patel@example.com",
      "occupation": "Chartered Accountant"
    }
  ],
  "address": {
    "street": "42 Heritage Enclave",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560001"
  }
}
```
- **Activation Lifecycle (`POST /api/v1/admin/admissions/{id}/activations`):**
  - Preconditions: Principal approval recorded (`approvalStatus == SANCTIONED`), application fee cleared.
  - Action: In a single atomic database transaction:
    1. Generates sequential `admission_number` and stable `student_id` (e.g. `GVS-2027-0042`).
    2. Inserts `students` master record.
    3. Creates initial `student_enrollments` in designated Section with assigned Roll Number.
    4. Creates `users` record with role `STUDENT` and `PARENT` credential context.
    5. Generates initial term fee invoice based on standard grade fee structure.
  - Replay guarantee: Governed by `Idempotency-Key`.

---

### 8.2 Payment Order & Webhook Contract (`/api/v1/payments/*`)

#### 1. Payment Order Initiation (`POST /api/v1/parents/me/payment-orders`):
- **Request Schema:**
```json
{
  "invoiceId": "inv_88a91b2c-3d4e-4f5a-6b7c-8d9e0f1a2b3c",
  "paymentAmount": "25000.00",
  "currency": "INR",
  "paymentMethod": "RAZORPAY_UPI"
}
```
- **Success Response (201 Created):**
```json
{
  "data": {
    "orderId": "pord_01JB5VZ2QW8N9M1K3P7R4S6T8V",
    "gatewayOrderId": "order_Rzp98A2bK1L4mN",
    "amount": "25000.00",
    "currency": "INR",
    "keyId": "rzp_live_GVS88a91b2c",
    "expiresAt": "2026-11-04T23:45:00Z"
  },
  "meta": {
    "requestId": "req_01JB5V8Z4N8P7A2R1M9K4Q2W"
  }
}
```

#### 2. Provider Webhook Ingestion (`POST /api/v1/payments/webhooks/{provider}`):
- **[DESIGN DECISION] Signature-Verified Webhook Boundary:**  
  - No user Bearer token required. Authentication is validated strictly via HMAC-SHA256 signature in request header (e.g. `X-Razorpay-Signature`).
  - Webhook processing is idempotent: duplicate gateway event IDs are safely acknowledged with `200 OK` without double-crediting invoices.
  - Client frontend is **never** permitted to post a "Payment Successful" status; invoices update strictly via verified webhook or signed server-to-server gateway callback.

---

### 8.3 Offline Payment & Maker-Checker Contract (`/api/v1/admin/offline-payments/*`)

- **[DESIGN DECISION] Dual-Control Separation:**
  - Maker (`RECORD_OFFLINE_PAYMENT`): Records cash or physical cheque voucher into `PENDING_VERIFICATION` state.
  - Checker (`VERIFY_OFFLINE_PAYMENT`): Validates physical bank deposit slip or cash register voucher and executes invoice settlement.
  - **Invariant:** The verifying user ID cannot match the voucher author ID (`voucher.recorded_by != current_user.id`).

#### Record Voucher (`POST /api/v1/admin/offline-payments`):
```json
{
  "studentId": "GVS-2027-0001",
  "invoiceId": "inv_88a91b2c-3d4e-4f5a-6b7c-8d9e0f1a2b3c",
  "amount": "15000.00",
  "paymentMode": "CASH",
  "voucherReference": "CSH-2026-0881",
  "receivedDate": "2026-11-04",
  "remarks": "Term 2 tuition fee collected at campus cash counter"
}
```

#### Verify Voucher (`POST /api/v1/admin/offline-payments/{id}/verifications`):
```json
{
  "action": "VERIFY",
  "depositBankSlipReference": "HDFC-DEP-99120",
  "cashDrawerVerified": true
}
```
*(If author attempts verification, backend throws `403 MAKER_CHECKER_VIOLATION: Author cannot verify own cash voucher`)*

---

### 8.4 Student Safety & Early Pickup Contract (`/api/v1/safety/pickups/*`)

- **[DESIGN DECISION] Immutable Gate Release Protocol:**
  - Parent submits temporary pickup authorization with photo ID and emergency contact details.
  - Backend issues an encrypted, single-use, 6-digit dynamic OTP and QR pass valid for a 2-hour window.
  - Campus Gate Security scans QR and enters OTP at `/api/v1/safety/pickups/verifications`.
  - Once student passes gate, record is marked `COMPLETED` and becomes append-only/immutable. An automated SMS/Push alert is dispatched immediately to both registered parents.

---

## 9. Date, Time, Currency & Status Standards

### 9.1 Date & Time Formatting Standard
- **[DESIGN DECISION] UTC ISO-8601 Storage & Serialization:**  
  - All timestamps transmitted across API contracts must adhere to ISO-8601 extended format with UTC offset: `YYYY-MM-DDTHH:mm:ssZ` (e.g. `2026-11-04T23:30:00Z`).
  - Calendar dates without time components (birthdates, academic terms, attendance days) use `YYYY-MM-DD` (e.g. `2026-11-04`).
  - School local timezone is maintained in school metadata (`Asia/Kolkata` for India) and applied during client rendering and scheduled daily cron triggers.

### 9.2 Currency & Money Representation
- **[DESIGN DECISION] Explicit Decimal String Representation:**  
  - Floating-point numbers (`Float`, `Double`) are strictly prohibited in API schemas for financial figures to eliminate IEEE 754 precision loss.
  - All monetary values are represented as high-precision decimal strings with 2 fractional digits: `"25000.00"`.
  - Every financial object explicitly accompanies its ISO-4217 3-letter currency code: `"currency": "INR"`.

### 9.3 Centralized Status Enumerations
All statuses across the platform use uppercase, snake-cased standardized strings:
- **`AccountStatus`:** `SETUP`, `ACTIVE`, `SUSPENDED`, `LOCKED`, `EXITED`
- **`AttendanceStatus`:** `PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `EXCUSED_LEAVE`, `SCHOOL_ACTIVITY`
- **`MarksheetStatus`:** `DRAFT`, `SUBMITTED_TO_MENTOR`, `RETURNED_TO_TEACHER`, `MENTOR_ACCEPTED`, `PRINCIPAL_APPROVED`, `PUBLISHED`
- **`ReportCardStatus`:** `DRAFT`, `PENDING_REVIEW`, `SUBMITTED_TO_PRINCIPAL`, `PRINCIPAL_APPROVED`, `RETURNED`, `PUBLISHED`, `ACKNOWLEDGED`
- **`InvoiceStatus`:** `DRAFT`, `ISSUED`, `PARTIALLY_PAID`, `PAID`, `OVERDUE`, `CANCELLED`, `WRITTEN_OFF`
- **`PaymentStatus`:** `INITIATED`, `PENDING`, `SUCCESS`, `FAILED`, `BOUNCED`, `REFUNDED`
- **`RefundStatus`:** `REQUESTED`, `UNDER_REVIEW`, `PRINCIPAL_APPROVED`, `PROCESSING`, `SUCCEEDED`, `REJECTED`
- **`ComplaintStatus`:** `SUBMITTED`, `ACKNOWLEDGED`, `IN_INVESTIGATION`, `RESOLVED`, `CLOSED`, `REOPENED`

---

## 10. Dashboard Aggregation API Strategy

To prevent mobile clients and SPAs from executing 30+ sequential REST requests on login, the architecture provides role-specific composite view contracts:

| Endpoint | Target Portal | Payload Contents | Excluded Elements |
| :--- | :--- | :--- | :--- |
| `GET /api/v1/students/me/dashboard` | Student | Today's timetable, pending homework, unread notices, attendance rate, upcoming exams | Detailed gradebooks, financial breakdowns, peer records |
| `GET /api/v1/parents/me/dashboard` | Parent | Ward attendance summary, fee due alert, latest report card status, upcoming PTM, bus ETA status | Other students, internal teacher remarks, school budget |
| `GET /api/v1/teachers/me/dashboard` | Teacher | Today's teaching schedule, roll-call status, unread doubts, pending homework review count | Other teachers' marksheets, school finance data |
| `GET /api/v1/principal/dashboard` | Principal | Action center counts, overall attendance %, fee collection pace, critical safety incidents | Raw student homework submissions, routine logs |
| `GET /api/v1/admin/dashboard` | Admin | Today's admissions count, pending cash vouchers, transport capacity alerts, staff leave queue | Student academic marks, teacher private feedback |

---

## 11. API Testing Matrix & Quality Assurance Plan

Every controller endpoint implemented in future phases must validate against this standardized test matrix:

| Test ID | Test Scenario | Expected Status | Behavioral Invariant |
| :--- | :--- | :--- | :--- |
| `TC-API-01` | Valid Happy Path Request | `200 OK` / `201 Created` | Standard envelope returned with unique `requestId`. |
| `TC-API-02` | Unauthenticated Request | `401 Unauthorized` | Rejected before reaching domain controllers. |
| `TC-API-03` | Unauthorized Role Request | `403 Forbidden` | Access denied with `INSUFFICIENT_PERMISSIONS`. |
| `TC-API-04` | Cross-Tenant Probe (`School A` probes `School B` resource) | `404 Not Found` | Tenant isolation prevents resource existence disclosure. |
| `TC-API-05` | Unassigned Subject Mark Entry | `403 Forbidden` | Rejects teacher not assigned to specific subject. |
| `TC-API-06` | Parent Probing Peer Student ID | `403 Forbidden` | Session locked to single ward; security alert logged. |
| `TC-API-07` | Invalid Workflow State (Submit marks on closed window) | `422 Unprocessable` | State engine rejects transition with business error code. |
| `TC-API-08` | Concurrency Conflict (`If-Match` version mismatch) | `412 Precondition` | Optimistic lock prevents dirty overwrite. |
| `TC-API-09` | Replayed Idempotency Key (Same payload) | `200 / 201 Cached` | Cached result returned; duplicate mutation bypassed. |
| `TC-API-10` | Idempotency Key Reused with Different Payload | `409 Conflict` | Rejects payload tampering under identical key. |
| `TC-API-11` | Maker-Checker Violation (Author verifies own cash payment) | `403 Forbidden` | Segregation of duties strictly enforced. |

---

## 12. Frontend Mock-to-API Migration Plan

### 12.1 Decoupled API Client Architecture
- **[DESIGN DECISION] Transport-Agnostic Service Layer:**  
  The current React 19 frontend uses local mock data services. Migration to real backend endpoints will occur smoothly without rewriting UI components by adhering to the Service Adapter pattern:
```
UI Component (e.g. TeacherAttendance.tsx)
      │
      ▼
Domain Service Interface (AttendanceService)
      │
      ├── MockAttendanceService.ts (Development / Demo Mode)
      └── HttpAttendanceApiClient.ts (Production REST API via Axios/Fetch)
```

### 12.2 Interceptor Configuration Pipeline
1. **Request Interceptor:**
   - Injects `Authorization: Bearer <token>` from AuthContext.
   - Attaches `X-Request-ID: req_<uuid>` for distributed tracing.
   - Generates and attaches `Idempotency-Key: <uuid>` on non-idempotent `POST` requests.
2. **Response Interceptor:**
   - Unwraps `response.data.data` into standard TypeScript model objects.
   - Automatically catches `401 Unauthorized` and dispatches silent token refresh flow via `/api/v1/auth/refresh`.
   - Normalizes `422` field validation errors into form field error state.

---

## 13. Open Decisions Requiring Product Owner Approval

1. **[OPEN DECISION #1 - PO APPROVAL REQUIRED] Offline Payment Cash Limit:**  
   Should single cash payments exceeding ₹20,000 require an additional OTP step-up from the School Bursar/Finance Director in addition to the standard dual-control maker-checker verification?
2. **[OPEN DECISION #2 - PO APPROVAL REQUIRED] Parent Sibling Switching UX:**  
   For families with multiple siblings in the same school, should the backend support an explicit switch-ward token exchange endpoint (`POST /api/v1/auth/switch-ward`), or remain strictly one independent login session per student credential as specified in Phase 11 & 12?
3. **[OPEN DECISION #3 - PO APPROVAL REQUIRED] AI Tutor Daily Token Quota:**  
   What should be the statutory ceiling for daily AI Tutor queries per student (recommended: 30 requests/day per student) before returning `429 QUOTA_EXCEEDED`?

---

## 14. Recommended Backend Implementation Sequence (Phases 14–22)

To ensure low risk and seamless testability, backend development will proceed in ordered vertical slices:
1. **Phase 14: Core Engine Baseline:** Java 21 / Spring Boot 3.3 skeleton, Flyway V1 baseline, PostgreSQL RLS filter, Global Exception Handler, and `/api/v1/auth` + `/api/v1/me`.
2. **Phase 15: Academic Structure & Rostering:** Classes, Sections, Subjects, Staff, and Teacher Allocations.
3. **Phase 16: Daily Operations & Attendance:** Roll-call sheets, leave requests, and student daily tracking.
4. **Phase 17: Assignments & Classroom:** Homework, quizzes, and study material uploads.
5. **Phase 18: Grading & Report Card State Engine:** Marksheet submissions, mentor review, principal sign-off, and card publication.
6. **Phase 19: Finance, Invoicing & Razorpay Payments:** Fee structures, billing runs, online gateway webhooks, and offline cash maker-checker.
7. **Phase 20: Student Safety & Transport:** Bus routes, stops, and gate security OTP pickup authorization.
8. **Phase 21: Communication & Governance:** School notices, PTM scheduler, complaints, and audit stream.
9. **Phase 22: Platform Multi-Tenant SaaS Engine:** Tenant provisioning, subscription meters, and platform governance.

---
*End of Phase 13 API Contract Specification.*
