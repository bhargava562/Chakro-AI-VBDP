package com.chakro.server.vbdp.model;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Aggregates the output of a discovery run.
 */
public final class DiscoveryReport {

    private final String query;
    private final List<HackathonOpportunity> opportunities;
    private final Instant startedAt;
    private final Instant completedAt;

    public DiscoveryReport(String query,
                           List<HackathonOpportunity> opportunities,
                           Instant startedAt,
                           Instant completedAt) {
        this.query = Objects.requireNonNull(query);
        this.opportunities = Collections.unmodifiableList(Objects.requireNonNull(opportunities));
        this.startedAt = Objects.requireNonNull(startedAt);
        this.completedAt = Objects.requireNonNull(completedAt);
    }

    public String getQuery() {
        return query;
    }

    public List<HackathonOpportunity> getOpportunities() {
        return opportunities;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }
}
