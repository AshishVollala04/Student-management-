-- ====================================================================
-- FutureSchool Phase 16 Authentication & Security Migration
-- Flyway Migration V2__security_and_auth_schema.sql
-- ====================================================================

-- 1. User Refresh Sessions (Stateful Refresh Token Tracking & Session Controls)
CREATE TABLE user_sessions (
    session_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    school_id           UUID REFERENCES schools(school_id) ON DELETE CASCADE,
    refresh_token_hash  VARCHAR(64) NOT NULL UNIQUE,
    portal_context      VARCHAR(32) NOT NULL,
    device_info         VARCHAR(255),
    ip_address          VARCHAR(45),
    is_revoked          BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_reason      VARCHAR(128),
    expires_at          TIMESTAMPTZ NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_school ON user_sessions(school_id);
CREATE INDEX idx_user_sessions_token_hash ON user_sessions(refresh_token_hash);

-- 2. Password Reset Tokens (Single-Use, Time-Bounded)
CREATE TABLE password_reset_tokens (
    token_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash          VARCHAR(64) NOT NULL UNIQUE,
    is_used             BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at          TIMESTAMPTZ NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pwd_reset_user ON password_reset_tokens(user_id);
CREATE INDEX idx_pwd_reset_hash ON password_reset_tokens(token_hash);

-- 3. Step-Up Verification Tokens (15-min TTL for privileged/sensitive actions)
CREATE TABLE step_up_tokens (
    step_up_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash          VARCHAR(64) NOT NULL UNIQUE,
    purpose             VARCHAR(64) NOT NULL,
    is_used             BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at          TIMESTAMPTZ NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_step_up_user ON step_up_tokens(user_id);
CREATE INDEX idx_step_up_hash ON step_up_tokens(token_hash);

-- 4. School Feature Entitlements (Backend-Enforced Module Licensing)
CREATE TABLE school_feature_entitlements (
    entitlement_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    feature_code        VARCHAR(64) NOT NULL, -- e.g. 'ai', 'fleet_transport', 'advanced_reports'
    is_enabled          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_school_feature UNIQUE (school_id, feature_code)
);

CREATE INDEX idx_entitlements_school ON school_feature_entitlements(school_id);

-- 5. MFA Configurations (Hardware/TOTP Secrets for Principal, Admin, Platform Admin)
CREATE TABLE mfa_configurations (
    mfa_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    mfa_secret          VARCHAR(255) NOT NULL,
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
