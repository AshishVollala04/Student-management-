# FutureSchool: Production Spring Boot Backend & Data Architecture Blueprint
**Product:** FutureSchool — Commercial Multi-School Management SaaS Platform  
**Target Runtime:** Java 21 LTS · Spring Boot 3.3.x · Spring Security 6 · PostgreSQL 16 · Flyway · Maven  
**Architecture Style:** Modular Monolith with Multi-Tenant Row-Level Security (RLS)  

---

## 1. High-Level Architectural Overview

FutureSchool is built as a commercial, multi-tenant SaaS platform where every school (tenant) operates with strict logical data isolation, custom educational board configurations (CBSE, ICSE, IB, Cambridge), and role-segregated portals.

```
+-----------------------------------------------------------------------------------+
|                           FutureSchool React 19 Client SPA                        |
|   (Student Portal | Parent Portal | Teacher Portal | Principal | Admin | Platform) |
+-----------------------------------------+-----------------------------------------+
                                          | HTTPS / REST + WebSocket
                                          v
+-----------------------------------------------------------------------------------+
|                        Spring Boot 3.3+ Application Gateway                       |
|   - Multi-Tenant Filter (Resolves X-Tenant-ID / JWT Tenant Claim)                 |
|   - Spring Security 6 (Stateless JWT Auth + 6-digit MFA Enforcement)              |
|   - Rate Limiting (Bucket4j / Redis)                                              |
+-----------------------------------------+-----------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                 |                                 |
        v                                 v                                 v
+-----------------------+     +-----------------------+     +-----------------------+
|  Platform & Tenant    |     |  Academic & Grading   |     |  Finance & Transport  |
|  - TenantProvisioning |     |  - Student 360        |     |  - Invoicing Engine   |
|  - PlanEntitlements   |     |  - Marks Pipeline     |     |  - Hall Ticket Locks  |
|  - CapacityManager    |     |  - Attendance Matrix  |     |  - Fleet GPS Beacon   |
+-----------------------+     +-----------------------+     +-----------------------+
        |                                 |                                 |
        +---------------------------------+---------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        PostgreSQL 16 Multi-Tenant Engine                          |
|   - Shared Database, Tenant Discriminator Column (`tenant_id`)                    |
|   - PostgreSQL Row-Level Security (RLS) Enforced at Connection Level              |
|   - Flyway Schema Migrations (`V1__baseline.sql`, `V2__rls_policies.sql`)         |
+-----------------------------------------------------------------------------------+
```

---

## 2. Multi-Tenancy Isolation Strategy

### 2.1 Connection-Level Row-Level Security (RLS)
To guarantee zero cross-tenant data leakage while maintaining efficient connection pooling, FutureSchool uses PostgreSQL Row-Level Security.

1. Every incoming HTTP request passes through `TenantContextFilter`:
   ```java
   @Component
   public class TenantContextFilter extends OncePerRequestFilter {
       @Override
       protected void doFilterInternal(HttpServletRequest request, 
                                      HttpServletResponse response, 
                                      FilterChain filterChain) throws ServletException, IOException {
           String tenantId = resolveTenantId(request);
           TenantContextHolder.setTenantId(tenantId);
           try {
               filterChain.doFilter(request, response);
           } finally {
               TenantContextHolder.clear();
           }
       }
   }
   ```
2. The custom `RoutingDataSource` or JPA `ConnectionPreparer` sets the PostgreSQL session parameter:
   ```sql
   SET LOCAL app.current_tenant_id = 'GVS';
   ```
3. PostgreSQL enforces the isolation policy on all tenant-scoped tables:
   ```sql
   ALTER TABLE students ENABLE ROW LEVEL SECURITY;
   CREATE POLICY tenant_isolation_policy ON students
       FOR ALL
       USING (tenant_id = current_setting('app.current_tenant_id', true));
   ```

---

## 3. Spring Boot Modular Monolith Structure

```
com.futureschool
├── platform                   // SaaS Layer: Tenant onboarding, plans, capacity
│   ├── controller
│   ├── service
│   ├── repository
│   └── model
├── auth                       // Security: JWT, MFA, Password reset, RBAC
│   ├── config
│   ├── jwt
│   ├── mfa
│   └── service
├── academic                   // Core Academics: Structure, Subjects, Timetable
│   ├── controller
│   ├── service
│   └── model
├── attendance                 // Daily Biometric & Roll-Call Registry
├── examination                // Marksheets, Moderation, Report Card Endorsements
├── finance                    // Fee Structures, Billing Runs, Online Gateway
├── transport                  // Fleet Operations, GPS Tracker, Route Reassignments
└── workflow                   // Central State Machine: Multi-Role Approvals
```

---

## 4. PostgreSQL DDL Schema (Flyway V1__init_schema.sql)

```sql
-- 1. Tenants (SaaS Platform Layer)
CREATE TABLE tenants (
    id VARCHAR(32) PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    affiliation_number VARCHAR(128) NOT NULL,
    board VARCHAR(32) NOT NULL, -- CBSE, ICSE, IB, CAMBRIDGE
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_VERIFICATION', -- ACTIVE, SUSPENDED
    subscription_tier VARCHAR(32) NOT NULL DEFAULT 'STANDARD', -- STARTER, STANDARD, PRO, ENTERPRISE
    capacity_limit INT NOT NULL DEFAULT 600,
    current_enrolled INT NOT NULL DEFAULT 0,
    principal_name VARCHAR(128) NOT NULL,
    principal_email VARCHAR(128) NOT NULL,
    admin_name VARCHAR(128) NOT NULL,
    admin_email VARCHAR(128) NOT NULL,
    onboarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    renews_at TIMESTAMPTZ NOT NULL
);

-- 2. Users & Credentials (RBAC)
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(32) REFERENCES tenants(id),
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL, -- STUDENT, PARENT, TEACHER, PRINCIPAL, ADMIN, PLATFORM_ADMIN
    mfa_secret VARCHAR(64),
    mfa_required BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Students Registry
CREATE TABLE students (
    id VARCHAR(64) PRIMARY KEY, -- GVS-2027-0001
    tenant_id VARCHAR(32) NOT NULL REFERENCES tenants(id),
    full_name VARCHAR(128) NOT NULL,
    admission_number VARCHAR(64) NOT NULL,
    roll_number INT NOT NULL,
    grade VARCHAR(16) NOT NULL,
    section VARCHAR(8) NOT NULL,
    parent_user_id VARCHAR(64) REFERENCES users(id),
    attendance_rate DECIMAL(5,2) DEFAULT 0.0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_roll UNIQUE (tenant_id, grade, section, roll_number)
);

-- 4. Marksheets & Evaluation Pipeline
CREATE TABLE marks_entries (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL REFERENCES tenants(id),
    class_id VARCHAR(32) NOT NULL,
    subject VARCHAR(64) NOT NULL,
    teacher_id VARCHAR(64) REFERENCES users(id),
    principal_approval_status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, RETURNED
    is_published_to_students BOOLEAN NOT NULL DEFAULT FALSE,
    return_reason TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE student_marks (
    id BIGSERIAL PRIMARY KEY,
    marks_entry_id VARCHAR(64) REFERENCES marks_entries(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES students(id),
    score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
    max_score DECIMAL(5,2) NOT NULL DEFAULT 100.0,
    is_absent BOOLEAN NOT NULL DEFAULT FALSE,
    conduct_remarks TEXT
);

-- 5. Finance, Fees & Hall Ticket Clearance
CREATE TABLE fee_accounts (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL REFERENCES tenants(id),
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) UNIQUE,
    total_annual DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    pending_amount DECIMAL(10,2) NOT NULL,
    has_past_due BOOLEAN NOT NULL DEFAULT FALSE,
    hall_ticket_cleared BOOLEAN NOT NULL DEFAULT FALSE,
    override_reason TEXT,
    override_by VARCHAR(64) REFERENCES users(id)
);

CREATE TABLE fee_transactions (
    id VARCHAR(64) PRIMARY KEY,
    fee_account_id VARCHAR(64) REFERENCES fee_accounts(id),
    receipt_number VARCHAR(64) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Fleet Transport Operations
CREATE TABLE transport_routes (
    id VARCHAR(32) PRIMARY KEY, -- RT-04, RT-07
    tenant_id VARCHAR(32) NOT NULL REFERENCES tenants(id),
    route_name VARCHAR(128) NOT NULL,
    vehicle_registration VARCHAR(64) NOT NULL,
    driver_name VARCHAR(128) NOT NULL,
    driver_phone VARCHAR(32) NOT NULL,
    capacity INT NOT NULL,
    occupied INT NOT NULL DEFAULT 0
);

CREATE TABLE transport_change_requests (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL REFERENCES tenants(id),
    student_id VARCHAR(64) REFERENCES students(id),
    current_route VARCHAR(32) NOT NULL,
    requested_route VARCHAR(32) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    admin_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Audit Compliance Log
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    event_payload JSONB,
    network_ip VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 5. Core REST API Contract Specification (OpenAPI 3.0 Summary)

### 5.1 Authentication & Profile
- `POST /api/v1/auth/login`
  - Body: `{ "identifier": "GVS-2027-0001", "password": "...", "role": "STUDENT" }`
  - Response: `{ "token": "JWT...", "requiresMfa": false, "user": { ... } }`
- `POST /api/v1/auth/verify-mfa`
  - Body: `{ "userId": "PRN0001", "mfaCode": "849201" }`
  - Response: `{ "token": "JWT...", "user": { ... } }`

### 5.2 Academics & Marksheet Verification (Teacher <-> Principal)
- `POST /api/v1/marks/submit-verification`
  - Role: `TEACHER`
  - Body: `{ "classId": "Grade 10-A", "subject": "Mathematics", "studentMarks": [ ... ] }`
- `POST /api/v1/marks/principal-endorse`
  - Role: `PRINCIPAL`
  - Body: `{ "classId": "Grade 10-A", "subject": "Mathematics", "action": "APPROVE" }`
- `POST /api/v1/marks/publish-class`
  - Role: `TEACHER` (Requires Principal Endorsement flag = true)
  - Action: Publishes marks to student and parent portal endpoints.

### 5.3 Finance & Exam Hall Ticket Desk
- `POST /api/v1/fees/process-payment`
  - Role: `PARENT` or `STUDENT`
  - Body: `{ "amount": 1200, "method": "Online Banking" }`
  - Action: Unlocks admit card automatically if balance is zero.
- `POST /api/v1/fees/principal-override-hallticket`
  - Role: `PRINCIPAL`
  - Body: `{ "studentId": "GVS-2027-0001", "reason": "Hardship undertaking accepted" }`
  - Action: Audit-logged override unlocking the admit card despite pending fees.

### 5.4 Platform Admin Multi-Tenant Governance
- `GET /api/v1/platform/tenants`
  - Role: `PLATFORM_ADMIN`
  - Response: List of all school tenants with enrollment gauges, board codes, and subscription tiers.
- `POST /api/v1/platform/tenants/{tenantId}/verify`
  - Role: `PLATFORM_ADMIN`
  - Action: Verifies board affiliation and activates tenant schema partition.

---

## 6. Migration Strategy: Prototype to Production

1. **Repository Setup:** Clone frontend into a monorepo or dual-repo alongside a Spring Boot 3.3 Maven project.
2. **API Client Integration:** The frontend services in `/src/services/` already use Axios/Fetch abstractions matching these REST payloads. Replacing the mock handlers with `VITE_API_URL` switches the client to the real backend with zero UI rewrites.
3. **Database Seeding:** Execute `V1__init_schema.sql` and run `TenantDataSeeder.java` to populate Greenwood Valley School, Oakridge International, and Delhi Public Heritage High.
