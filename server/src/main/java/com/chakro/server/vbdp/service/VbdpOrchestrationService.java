package com.chakro.server.vbdp.service;

import com.chakro.server.vbdp.agent.DiscoveryAgent;
import com.chakro.server.vbdp.agent.SecurityAgent;
import com.chakro.server.vbdp.model.DiscoveryReport;
import com.chakro.server.vbdp.model.HackathonOpportunity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

/**
 * Orchestration service that runs the Discovery and Security agents concurrently.
 */
@Service
public class VbdpOrchestrationService {

    private final DiscoveryAgent discoveryAgent;
    private final SecurityAgent securityAgent;
    private final ExecutorService executor;

    public VbdpOrchestrationService(DiscoveryAgent discoveryAgent,
                                    SecurityAgent securityAgent,
                                    ExecutorService executor) {
        this.discoveryAgent = discoveryAgent;
        this.securityAgent = securityAgent;
        this.executor = executor;
    }

    /**
     * Runs a discovery operation in a virtual thread to avoid blocking OS threads.
     */
    public DiscoveryReport runDiscovery(String query) {
        return CompletableFuture.supplyAsync(() -> discoveryAgent.discover(query), executor).join();
    }

    /**
     * Runs an additional security review over an existing set of opportunities.
     */
    public List<HackathonOpportunity> runSecurityReview(List<HackathonOpportunity> opportunities) {
        return CompletableFuture.supplyAsync(() -> securityAgent.validateOpportunities(opportunities), executor).join();
    }
}
