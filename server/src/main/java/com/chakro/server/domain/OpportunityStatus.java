package com.chakro.server.domain;

/**
 * Lifecycle status of a tender opportunity through the VBDP pipeline.
 */
public enum OpportunityStatus {
    INGESTED,
    ANALYZING,
    ANALYSIS_COMPLETE,
    GENERATING_PROPOSAL,
    AWAITING_REVIEW,
    REVISION_REQUESTED,
    APPROVED,
    REJECTED
}
