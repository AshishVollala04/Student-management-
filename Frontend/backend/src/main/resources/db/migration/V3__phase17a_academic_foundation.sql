-- V3__phase17a_academic_foundation.sql
-- FutureSchool Phase 17A: School and Academic Foundation Schema

-- 1. Enhance school_classes with capacity, display order, status, and optimistic locking version
ALTER TABLE school_classes ADD COLUMN IF NOT EXISTS normal_capacity INT NOT NULL DEFAULT 35;
ALTER TABLE school_classes ADD COLUMN IF NOT EXISTS max_capacity INT NOT NULL DEFAULT 40;
ALTER TABLE school_classes ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 0;
ALTER TABLE school_classes ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE school_classes ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

-- 2. Enhance sections with normal capacity, status, and version
ALTER TABLE sections ADD COLUMN IF NOT EXISTS normal_capacity INT NOT NULL DEFAULT 35;
ALTER TABLE sections ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE sections ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

-- 3. Enhance subjects with type, status, weekly period requirement, and version
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS subject_type VARCHAR(32) NOT NULL DEFAULT 'CORE';
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS weekly_period_requirement INT NOT NULL DEFAULT 5;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

-- 4. Class-Subject Configuration (Maps Academic Year + Class + Subject)
CREATE TABLE IF NOT EXISTS class_subject_configurations (
    config_id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id                   UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    academic_year_id            UUID NOT NULL REFERENCES academic_years(academic_year_id) ON DELETE CASCADE,
    class_id                    UUID NOT NULL REFERENCES school_classes(class_id) ON DELETE CASCADE,
    subject_id                  UUID NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
    is_required                 BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_periods_override     INT,
    is_assessment_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
    version                     BIGINT NOT NULL DEFAULT 0,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_subject_config UNIQUE (academic_year_id, class_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_class_subject_school ON class_subject_configurations(school_id);
CREATE INDEX IF NOT EXISTS idx_class_subject_ay_class ON class_subject_configurations(academic_year_id, class_id);

-- 5. School Calendars (Versioned, draft -> published)
CREATE TABLE IF NOT EXISTS school_calendars (
    calendar_id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id                   UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    academic_year_id            UUID NOT NULL REFERENCES academic_years(academic_year_id) ON DELETE CASCADE,
    name                        VARCHAR(128) NOT NULL,
    version                     INT NOT NULL DEFAULT 1,
    status                      VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_school_calendar_ay_version UNIQUE (school_id, academic_year_id, version)
);

CREATE INDEX IF NOT EXISTS idx_school_calendars_school ON school_calendars(school_id);
CREATE INDEX IF NOT EXISTS idx_school_calendars_ay ON school_calendars(academic_year_id);

-- 6. School Calendar Entries (Daily dates, day type, instructional flag)
CREATE TABLE IF NOT EXISTS school_calendar_entries (
    entry_id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id                 UUID NOT NULL REFERENCES school_calendars(calendar_id) ON DELETE CASCADE,
    school_id                   UUID NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    entry_date                  DATE NOT NULL,
    day_type                    VARCHAR(32) NOT NULL, -- WORKING_DAY, HOLIDAY, VACATION, SPECIAL_WORKING_DAY, EXAM_DAY, PTM_EVENT
    description                 VARCHAR(255),
    is_instructional            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_calendar_entry_date UNIQUE (calendar_id, entry_date)
);

CREATE INDEX IF NOT EXISTS idx_calendar_entries_calendar ON school_calendar_entries(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_entries_date ON school_calendar_entries(school_id, entry_date);
