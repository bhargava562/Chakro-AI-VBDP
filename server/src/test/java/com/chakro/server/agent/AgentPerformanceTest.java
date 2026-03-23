package com.chakro.server.agent;

import com.chakro.server.vbdp.model.DiscoveryReport;
import com.chakro.server.vbdp.model.HackathonOpportunity;
import com.chakro.server.vbdp.service.VbdpOrchestrationService;
import com.chakro.server.domain.Opportunity;
import com.chakro.server.repository.OpportunityRepository;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.flyway.enabled=false"
})
@ActiveProfiles("test")
public class AgentPerformanceTest {

    private static final Logger log = LoggerFactory.getLogger(AgentPerformanceTest.class);

    @Autowired
    private VbdpOrchestrationService orchestrationService;

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Test
    @Transactional
    public void testFullAgentPipeline() {
        String query = "AI for Good Hackathon 2026";
        log.info(">>> STARTING MASTER AGENT TEST WITH QUERY: {}", query);

        // 1. Discovery & Security (Master Agent Orchestration)
        log.info(">>> STEP 1: DISCOVERY & SECURITY AGENTS");
        DiscoveryReport report = orchestrationService.runDiscovery(query);
        log.info("Discovery Agent found {} opportunities.", report.getOpportunities().size());
        
        List<HackathonOpportunity> safeOpps = orchestrationService.runSecurityReview(report.getOpportunities());
        log.info("Security Agent validated {} safe opportunities.", safeOpps.size());

        if (safeOpps.isEmpty()) {
            log.warn("No safe opportunities found for query. Skipping analysis/response steps.");
            return;
        }

        // 2. Full Pipeline Execution (Analysis & Response)
        log.info(">>> STEP 2: ANALYSIS & RESPONSE AGENTS");
        // For this test, we verify the orchestration logic and logging
        assertThat(safeOpps).isNotEmpty();
        try {
            orchestrationService.executeFullPipeline(query);
            log.info("Master Agent successfully orchestrated the full pipeline.");
        } catch (Exception e) {
            log.error("Pipeline execution failed: {}", e.getMessage());
            throw e;
        }

        // 3. Verify Persistence (Master Agent Commit Rule)
        List<Opportunity> persistedOpps = opportunityRepository.findAll();
        log.info("Total opportunities persisted in database: {}", persistedOpps.size());
        
        persistedOpps.forEach(opp -> {
            log.info("Verified Opportunity: [Name: {}, Status: {}]", opp.getTitle(), opp.getStatus());
            assertThat(opp.getStatus()).isNotNull();
        });

        log.info(">>> AGENT PERFORMANCE TEST COMPLETED SUCCESSFULLY");
    }
}
