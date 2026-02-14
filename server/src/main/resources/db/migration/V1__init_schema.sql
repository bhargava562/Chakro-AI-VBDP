-- =============================================
-- V1: Baseline Schema — Extensions & Foundation
-- =============================================
-- Flyway migration: runs automatically on application startup.
-- Future entity tables go in V2__, V3__, etc.

-- Enable pgvector for AI embedding storage
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Flyway metadata (tracks migration provenance)
-- =============================================
CREATE TABLE IF NOT EXISTS flyway_info (
    id          SERIAL PRIMARY KEY,
    key         VARCHAR(255) NOT NULL UNIQUE,
    value       TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO flyway_info (key, value) VALUES
    ('project', 'Chakro AI'),
    ('initialized_at', NOW()::TEXT),
    ('schema_version', '1');
