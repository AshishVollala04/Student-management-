-- ====================================================================
-- FutureSchool Phase 15 Foundational Schema Migration
-- Flyway Migration V1__foundational_schema.sql
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Schools (Tenant Entity)
CREATE TABLE schools (
    school_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_code         VARCHAR(32) NOT NULL UNIQUE,
    school_name         VARCHAR(255) NOT NULL,
    status              VARCHAR(32) NOT NULL DEFAULT 'SETUP',
    branding_logo_url   VARCHAR(512),
    branding_primary_color VARCHAR(16) DEFAULT '#1e3a8a',
    timezone            VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_schools_status ON schools(status);

-- 2. Users (Identity Entity)
CREATE TABLE users (
    user_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID REFERENCES schools(school_id), -- Nullable for platform users
    login_id            VARCHAR(64) NOT NULL,
    email               VARCHAR(255),
    phone               VARCHAR(32),
    display_name        VARCHAR(255) NOT NULL,
    status              VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    password_hash       VARCHAR(255) NOT NULL,
    mfa_enabled         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_school_login UNIQUE (school_id, login_id)
);

CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_users_login ON users(login_id);

-- 3. Roles
CREATE TABLE roles (
    role_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name           VARCHAR(64) NOT NULL UNIQUE,
    description         VARCHAR(255),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Permissions
CREATE TABLE permissions (
    permission_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_code     VARCHAR(64) NOT NULL UNIQUE,
    module              VARCHAR(64) NOT NULL,
    description         VARCHAR(255),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. User Roles (Junction)
CREATE TABLE user_roles (
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role_id             UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- 6. Role Permissions (Junction)
CREATE TABLE role_permissions (
    role_id             UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    permission_id       UUID NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- 7. Academic Years (Tenant Scoped)
CREATE TABLE academic_years (
    academic_year_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    code                VARCHAR(32) NOT NULL, -- e.g. "2027-28"
    name                VARCHAR(128) NOT NULL,
    start_date          DATE NOT NULL,
    end_date            DATE NOT NULL,
    status              VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    is_current          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_academic_year_code UNIQUE (school_id, code)
);

CREATE INDEX idx_academic_years_school ON academic_years(school_id);

-- 8. School Classes (Tenant Scoped)
CREATE TABLE school_classes (
    class_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    name                VARCHAR(64) NOT NULL, -- e.g. "Class 10"
    grade_level         INT NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_school_classes_name UNIQUE (school_id, name)
);

CREATE INDEX idx_school_classes_school ON school_classes(school_id);

-- 9. Sections (Scoped to School Class)
CREATE TABLE sections (
    section_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    class_id            UUID NOT NULL REFERENCES school_classes(class_id) ON DELETE CASCADE,
    name                VARCHAR(32) NOT NULL, -- e.g. "A"
    max_capacity        INT NOT NULL DEFAULT 40,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_section_name UNIQUE (class_id, name)
);

CREATE INDEX idx_sections_school ON sections(school_id);
CREATE INDEX idx_sections_class ON sections(class_id);

-- 10. Subjects (Tenant Scoped)
CREATE TABLE subjects (
    subject_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    code                VARCHAR(32) NOT NULL, -- e.g. "MATH-10"
    name                VARCHAR(128) NOT NULL,
    department          VARCHAR(64),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_subject_code UNIQUE (school_id, code)
);

CREATE INDEX idx_subjects_school ON subjects(school_id);

-- 11. Students (Long-lived Student Identity)
CREATE TABLE students (
    student_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    student_number      VARCHAR(64) NOT NULL, -- Human-readable Student ID e.g. "GVS-2027-0001"
    admission_number    VARCHAR(64) NOT NULL,
    first_name          VARCHAR(128) NOT NULL,
    last_name           VARCHAR(128) NOT NULL,
    date_of_birth       DATE NOT NULL,
    gender              VARCHAR(16) NOT NULL,
    emergency_contact   VARCHAR(32),
    status              VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_number UNIQUE (school_id, student_number),
    CONSTRAINT uq_admission_number UNIQUE (school_id, admission_number)
);

CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_students_number ON students(student_number);

-- 12. Student Enrollments (Year-specific Academic Placement)
CREATE TABLE student_enrollments (
    enrollment_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    student_id          UUID NOT NULL REFERENCES students(student_id) ON DELETE RESTRICT,
    academic_year_id    UUID NOT NULL REFERENCES academic_years(academic_year_id) ON DELETE RESTRICT,
    class_id            UUID NOT NULL REFERENCES school_classes(class_id) ON DELETE RESTRICT,
    section_id          UUID NOT NULL REFERENCES sections(section_id) ON DELETE RESTRICT,
    roll_number         VARCHAR(16),
    status              VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_year_enrollment UNIQUE (student_id, academic_year_id)
);

CREATE INDEX idx_enrollments_school ON student_enrollments(school_id);
CREATE INDEX idx_enrollments_section ON student_enrollments(section_id);

-- 13. Staff (Faculty & Administrative Employees)
CREATE TABLE staff (
    staff_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    staff_code          VARCHAR(64) NOT NULL, -- Human-readable Staff Code e.g. "TCH0001"
    first_name          VARCHAR(128) NOT NULL,
    last_name           VARCHAR(128) NOT NULL,
    designation         VARCHAR(128) NOT NULL,
    department          VARCHAR(64),
    email               VARCHAR(255) NOT NULL,
    phone               VARCHAR(32),
    status              VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_staff_code UNIQUE (school_id, staff_code),
    CONSTRAINT uq_staff_email UNIQUE (school_id, email)
);

CREATE INDEX idx_staff_school ON staff(school_id);
CREATE INDEX idx_staff_code ON staff(staff_code);

-- 14. Teacher Subject Allocations (Dynamic Assignment)
CREATE TABLE teacher_subject_allocations (
    allocation_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    academic_year_id    UUID NOT NULL REFERENCES academic_years(academic_year_id) ON DELETE RESTRICT,
    staff_id            UUID NOT NULL REFERENCES staff(staff_id) ON DELETE RESTRICT,
    section_id          UUID NOT NULL REFERENCES sections(section_id) ON DELETE RESTRICT,
    subject_id          UUID NOT NULL REFERENCES subjects(subject_id) ON DELETE RESTRICT,
    effective_from      DATE NOT NULL,
    effective_to        DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_teacher_subject_section UNIQUE (academic_year_id, section_id, subject_id, staff_id)
);

CREATE INDEX idx_alloc_school ON teacher_subject_allocations(school_id);
CREATE INDEX idx_alloc_staff ON teacher_subject_allocations(staff_id);

-- 15. Class Teacher Assignments (Mentor Assignment)
CREATE TABLE class_teacher_assignments (
    assignment_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    academic_year_id    UUID NOT NULL REFERENCES academic_years(academic_year_id) ON DELETE RESTRICT,
    section_id          UUID NOT NULL REFERENCES sections(section_id) ON DELETE RESTRICT,
    staff_id            UUID NOT NULL REFERENCES staff(staff_id) ON DELETE RESTRICT,
    effective_from      DATE NOT NULL,
    effective_to        DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_teacher_section UNIQUE (academic_year_id, section_id)
);

CREATE INDEX idx_class_teacher_school ON class_teacher_assignments(school_id);
CREATE INDEX idx_class_teacher_staff ON class_teacher_assignments(staff_id);

-- 16. Audit Events (Append-only Immutable Historical Records)
CREATE TABLE audit_events (
    audit_event_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id               UUID REFERENCES schools(school_id) ON DELETE SET NULL,
    platform_scope          BOOLEAN NOT NULL DEFAULT FALSE,
    actor_user_id           UUID NOT NULL,
    actor_login_id          VARCHAR(64) NOT NULL,
    actor_role              VARCHAR(32) NOT NULL,
    effective_permission    VARCHAR(64) NOT NULL,
    delegated_authority_id  UUID,
    action                  VARCHAR(64) NOT NULL,
    module                  VARCHAR(32) NOT NULL,
    entity_type             VARCHAR(64) NOT NULL,
    entity_id               VARCHAR(128) NOT NULL,
    parent_entity_type      VARCHAR(64),
    parent_entity_id        VARCHAR(128),
    previous_state          TEXT,
    new_state               TEXT,
    reason                  TEXT,
    approval_reference      VARCHAR(128),
    policy_version          VARCHAR(32),
    workflow_state_before   VARCHAR(32),
    workflow_state_after    VARCHAR(32),
    request_id              VARCHAR(64) NOT NULL,
    correlation_id          VARCHAR(64) NOT NULL,
    idempotency_key         VARCHAR(64),
    source_ip               VARCHAR(45),
    source_user_agent       VARCHAR(512),
    source_channel          VARCHAR(24) NOT NULL DEFAULT 'WEB_PORTAL',
    security_classification VARCHAR(24) NOT NULL DEFAULT 'INTERNAL',
    audit_category          VARCHAR(32) NOT NULL,
    severity                VARCHAR(16) NOT NULL DEFAULT 'INFO',
    alert_dispatched        BOOLEAN NOT NULL DEFAULT FALSE,
    previous_event_hash     VARCHAR(64) NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
    event_hash              VARCHAR(64) NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_events_school ON audit_events(school_id);
CREATE INDEX idx_audit_events_action ON audit_events(action);
CREATE INDEX idx_audit_events_created ON audit_events(created_at);
CREATE INDEX idx_audit_events_entity ON audit_events(entity_type, entity_id);
