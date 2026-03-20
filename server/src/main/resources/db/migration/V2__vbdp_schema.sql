-- =============================================
-- V2: VBDP Schema — Opportunities & Proposals
-- =============================================

-- Opportunity status enum type
CREATE TYPE opportunity_status AS ENUM (
    'INGESTED',
    'ANALYZING',
    'ANALYSIS_COMPLETE',
    'GENERATING_PROPOSAL',
    'AWAITING_REVIEW',
    'REVISION_REQUESTED',
    'APPROVED',
    'REJECTED'
);

-- =============================================
-- Opportunities table
-- =============================================
CREATE TABLE opportunities (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title                   VARCHAR(500) NOT NULL,
    description             TEXT,
    source_url              VARCHAR(2048),
    source_document_text    TEXT,
    status                  opportunity_status NOT NULL DEFAULT 'INGESTED',
    raw_analysis_json       TEXT,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_created_at ON opportunities(created_at DESC);

-- =============================================
-- Proposal Drafts table
-- =============================================
CREATE TABLE proposal_drafts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id      UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    content_html        TEXT,
    content_text        TEXT,
    download_token      VARCHAR(255) UNIQUE,
    token_expiry        TIMESTAMP WITH TIME ZONE,
    review_feedback     TEXT,
    version             INTEGER NOT NULL DEFAULT 1,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_proposal_drafts_opportunity_id ON proposal_drafts(opportunity_id);
CREATE INDEX idx_proposal_drafts_download_token ON proposal_drafts(download_token);
