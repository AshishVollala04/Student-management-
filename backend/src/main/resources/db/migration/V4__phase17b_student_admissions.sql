-- V4__phase17b_student_admissions.sql
-- FutureSchool Phase 17B: Student Admissions & Student 360 Schema

-- 1. Enhance students table with comprehensive 360 profile attributes
ALTER TABLE students ADD COLUMN IF NOT EXISTS middle_name VARCHAR(128);
ALTER TABLE students ADD COLUMN IF NOT EXISTS blood_group VARCHAR(8);
ALTER TABLE students ADD COLUMN IF NOT EXISTS medical_alerts TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS current_address TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS permanent_address TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS nationality VARCHAR(64);
ALTER TABLE students ADD COLUMN IF NOT EXISTS religion VARCHAR(64);
ALTER TABLE students ADD COLUMN IF NOT EXISTS category VARCHAR(32);
ALTER TABLE students ADD COLUMN IF NOT EXISTS aadhar_or_national_id VARCHAR(64);
ALTER TABLE students ADD COLUMN IF NOT EXISTS profile_photo_url VARCHAR(512);
ALTER TABLE students ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

-- 2. Admission Applications
CREATE TABLE IF NOT EXISTS admission_applications (
    application_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id                   UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    application_number          VARCHAR(64) NOT NULL,
    target_academic_year_id     UUID NOT NULL REFERENCES academic_years(academic_year_id) ON DELETE RESTRICT,
    target_class_id             UUID NOT NULL REFERENCES school_classes(class_id) ON DELETE RESTRICT,
    target_section_id           UUID REFERENCES sections(section_id) ON DELETE SET NULL,
    first_name                  VARCHAR(128) NOT NULL,
    middle_name                 VARCHAR(128),
    last_name                   VARCHAR(128) NOT NULL,
    date_of_birth               DATE NOT NULL,
    gender                      VARCHAR(16) NOT NULL,
    blood_group                 VARCHAR(8),
    medical_alerts              TEXT,
    nationality                 VARCHAR(64),
    religion                    VARCHAR(64),
    category                    VARCHAR(32),
    current_address             TEXT,
    permanent_address           TEXT,
    previous_school_name        VARCHAR(255),
    previous_grade              VARCHAR(64),
    previous_tc_number          VARCHAR(64),
    previous_academic_percentage DECIMAL(5,2),
    father_name                 VARCHAR(128),
    father_phone                VARCHAR(32),
    father_email                VARCHAR(255),
    father_occupation           VARCHAR(128),
    mother_name                 VARCHAR(128),
    mother_phone                VARCHAR(32),
    mother_email                VARCHAR(255),
    mother_occupation           VARCHAR(128),
    guardian_name               VARCHAR(128),
    guardian_phone              VARCHAR(32),
    guardian_email              VARCHAR(255),
    guardian_relation           VARCHAR(64),
    primary_contact             VARCHAR(32) NOT NULL DEFAULT 'FATHER',
    emergency_contact_number    VARCHAR(32),
    status                      VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    rejection_reason            TEXT,
    return_reason               TEXT,
    approval_notes              TEXT,
    approved_by                 UUID REFERENCES users(user_id),
    approved_at                 TIMESTAMPTZ,
    activated_student_id        UUID REFERENCES students(student_id),
    activated_at                TIMESTAMPTZ,
    activated_by                UUID REFERENCES users(user_id),
    version                     BIGINT NOT NULL DEFAULT 0,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_admission_app_number UNIQUE (school_id, application_number)
);

CREATE INDEX IF NOT EXISTS idx_admission_apps_school ON admission_applications(school_id);
CREATE INDEX IF NOT EXISTS idx_admission_apps_status ON admission_applications(school_id, status);
CREATE INDEX IF NOT EXISTS idx_admission_apps_ay ON admission_applications(target_academic_year_id);

-- 3. Admission Documents
CREATE TABLE IF NOT EXISTS admission_documents (
    document_id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id              UUID REFERENCES admission_applications(application_id) ON DELETE CASCADE,
    student_id                  UUID REFERENCES students(student_id) ON DELETE CASCADE,
    school_id                   UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    document_type               VARCHAR(64) NOT NULL,
    file_name                   VARCHAR(255) NOT NULL,
    file_url                    VARCHAR(512) NOT NULL,
    file_size_bytes             BIGINT,
    mime_type                   VARCHAR(128),
    verification_status         VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    verified_by                 UUID REFERENCES users(user_id),
    verified_at                 TIMESTAMPTZ,
    verification_notes          TEXT,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admission_docs_app ON admission_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_admission_docs_student ON admission_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_admission_docs_school ON admission_documents(school_id);

-- 4. Parent / Guardians Profiles
CREATE TABLE IF NOT EXISTS parent_guardians (
    guardian_id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id                   UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    first_name                  VARCHAR(128) NOT NULL,
    last_name                   VARCHAR(128) NOT NULL,
    phone                       VARCHAR(32) NOT NULL,
    email                       VARCHAR(255),
    occupation                  VARCHAR(128),
    employer_or_business        VARCHAR(255),
    annual_income               DECIMAL(15,2),
    address                     TEXT,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_guardian_phone UNIQUE (school_id, phone)
);

CREATE INDEX IF NOT EXISTS idx_guardians_school ON parent_guardians(school_id);

-- 5. Family Relationships (Students to Guardians Junction)
CREATE TABLE IF NOT EXISTS family_relationships (
    relationship_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id                   UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    student_id                  UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    guardian_id                 UUID NOT NULL REFERENCES parent_guardians(guardian_id) ON DELETE CASCADE,
    relationship_type           VARCHAR(32) NOT NULL,
    is_primary                  BOOLEAN NOT NULL DEFAULT FALSE,
    can_pickup                  BOOLEAN NOT NULL DEFAULT TRUE,
    receives_billing_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    receives_academic_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_guardian UNIQUE (student_id, guardian_id)
);

CREATE INDEX IF NOT EXISTS idx_fam_rel_student ON family_relationships(student_id);
CREATE INDEX IF NOT EXISTS idx_fam_rel_guardian ON family_relationships(guardian_id);

-- 6. Student Profile Change Requests
CREATE TABLE IF NOT EXISTS student_profile_change_requests (
    request_id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id                   UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    student_id                  UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    field_name                  VARCHAR(64) NOT NULL,
    old_value                   TEXT,
    proposed_value              TEXT NOT NULL,
    reason                      TEXT,
    status                      VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    requested_by                UUID NOT NULL REFERENCES users(user_id),
    reviewed_by                 UUID REFERENCES users(user_id),
    reviewed_at                 TIMESTAMPTZ,
    review_notes                TEXT,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_profile_changes_student ON student_profile_change_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_profile_changes_school_status ON student_profile_change_requests(school_id, status);
