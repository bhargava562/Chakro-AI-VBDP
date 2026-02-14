-- =============================================
-- Docker Postgres Init Script
-- Runs on FIRST container startup only
-- =============================================
-- This script is mounted into /docker-entrypoint-initdb.d/
-- and executes against the default database before Flyway runs.

-- Enable extensions at database level
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant all privileges to the app user
-- (The POSTGRES_USER env var controls which user is created)
