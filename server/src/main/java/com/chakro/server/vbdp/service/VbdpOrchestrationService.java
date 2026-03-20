package com.chakro.server.vbdp.service;

import com.chakro.server.domain.Opportunity;
import com.chakro.server.domain.OpportunityStatus;
import com.chakro.server.domain.ProposalDraft;
import com.chakro.server.exception.SecurityViolationException;
import com.chakro.server.repository.OpportunityRepository;
import com.chakro.server.service.AnalysisService;
import com.chakro.server.service.ProposalService;
import com.chakro.server.vbdp.agent.DiscoveryAgent;
import com.chakro.server.vbdp.agent.SecurityAgent;
import com.chakro.server.vbdp.model.DiscoveryReport;
import com.chakro.server.vbdp.model.HackathonOpportunity;
import com.chakro.server.vbdp.model.SecurityAssessment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * The CEO Agent of the Virtual Business Development Partner (VBDP).
 * Orchestrates the full lifecycle of an opportunity:
 * Discovery -> Security Validate -> Analysis -> Proposal Response.
 * Utilizes Java 25+ Virtual Threads to manage high concurrency without blocking platform threads.
 */
@Service
public class VbdpOrchestrationService {

    private static final Logger log = LoggerFactory.getLogger(VbdpOrchestrationService.class);

    private final DiscoveryAgent discoveryAgent;
    private final SecurityAgent securityAgent;
    private final AnalysisService analysisService;
    private final ProposalService proposalService;
    private final OpportunityRepository opportunityRepository;
    private final ExecutorService executor;

    public VbdpOrchestrationService(DiscoveryAgent discoveryAgent,
                                    SecurityAgent securityAgent,
                                    AnalysisService analysisService,
                                    ProposalService proposalService,
                                    OpportunityRepository opportunityRepository,
                                    ExecutorService executor) {
        this.discoveryAgent = discoveryAgent;
        this.securityAgent = securityAgent;
        this.analysisService = analysisService;
        this.proposalService = proposalService;
        this.opportunityRepository = opportunityRepository;
        this.executor = executor;
    }

    /**
     * Executes the comprehensive end-to-end pipeline.
     * @param query the search term or tender query
     */
    public void executeFullPipeline(String query) {
        log.info("CEO Agent Initiating Pipeline for query: {}", query);

        // 1. Discovery Phase
        log.info("Phase 1: Discovering opportunities...");
        DiscoveryReport report = discoveryAgent.discover(query);
        log.info("Discovery complete. Found {} candidates.", report.getOpportunities().size());

        // We use Java Virtual Threads to optimize I/O bounds for all subsequent phases per opportunity.
        try (var virtualExecutor = Executors.newVirtualThreadPerTaskExecutor()) {
            
            List<CompletableFuture<Void>> futures = report.getOpportunities().stream()
                .map(opp -> CompletableFuture.runAsync(() -> processSingleOpportunity(opp), virtualExecutor))
                .toList();

            // Wait for all pipelines to conclude
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        }

        log.info("CEO Agent completed full pipeline for query: {}", query);
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

    private void processSingleOpportunity(HackathonOpportunity opp) {
        log.info("Validating URL: {}", opp.getUrl());

        // 2. Security Phase
        List<HackathonOpportunity> sanitizedList = securityAgent.validateOpportunities(List.of(opp));
        if (sanitizedList.isEmpty()) {
             log.warn("Opportunity dropped entirely during security phase.");
             return;
        }
        HackathonOpportunity secureOpp = sanitizedList.get(0);

        // Halt pipeline on Security Violation (Guardrail)
        if (secureOpp.getSecurityAssessment() != null &&
                secureOpp.getSecurityAssessment().getStatus() == SecurityAssessment.Status.SECURITY_VIOLATION) {
             throw new SecurityViolationException("SECURITY HALT: Malicious content detected at " + secureOpp.getUrl() + 
                     " Details: " + String.join(", ", secureOpp.getSecurityAssessment().getFindings()));
        }

        // Bridge to Analysis context via DB Entity
        Opportunity entity = new Opportunity();
        entity.setTitle(secureOpp.getTitle());
        entity.setSourceUrl(secureOpp.getUrl());
        entity.setSourceDocumentText(secureOpp.getProblemStatement());
        entity.setStatus(OpportunityStatus.INGESTED);
        entity = opportunityRepository.save(entity);

        try {
            // 3. Analysis Phase
            log.info("Phase 3: Triggering Analysis for {}", entity.getId());
            analysisService.runAnalysis(entity.getId());

            // 4. Response Phase (Triggers HITL)
            log.info("Phase 4: Generating Response Draft for {}", entity.getId());
            ProposalDraft draft = proposalService.generateProposal(entity.getId());
            
            log.info("Draft generated seamlessly. Awaiting Human Review for: {}", draft.getId());

        } catch (Exception e) {
            log.error("Pipeline failure for {}: {}", entity.getId(), e.getMessage());
            throw new RuntimeException("Pipeline failed", e);
        }
    }
}
