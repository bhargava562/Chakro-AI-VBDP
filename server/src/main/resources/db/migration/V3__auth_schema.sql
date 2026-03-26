-- =============================================
-- V3: Authentication & Authorization Schema
-- =============================================

-- User role enum type
CREATE TYPE user_role AS ENUM (
    'owner',
    'manager',
    'analyst'
);

-- =============================================
-- Tenants table
-- =============================================
CREATE TABLE tenants (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(255) NOT NULL UNIQUE,
    company_name        VARCHAR(500),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tenants_name ON tenants(name);

-- =============================================
-- Users table
-- =============================================
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email               VARCHAR(255) NOT NULL UNIQUE,
    name                VARCHAR(255) NOT NULL,
    password_hash       VARCHAR(512) NOT NULL,
    role                user_role NOT NULL DEFAULT 'analyst',
    avatar_url          VARCHAR(2048),
    refresh_token       VARCHAR(512),
    refresh_token_expiry TIMESTAMP WITH TIME ZONE,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_email_active ON users(email) WHERE is_active = true;

-- =============================================
-- Refresh Token Blacklist (for logout)
-- =============================================
CREATE TABLE token_blacklist (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    refresh_token       VARCHAR(512) NOT NULL UNIQUE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blacklisted_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at          TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_token_blacklist_user_id ON token_blacklist(user_id);
CREATE INDEX idx_token_blacklist_expires_at ON token_blacklist(expires_at);
