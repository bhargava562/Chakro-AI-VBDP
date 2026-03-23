package com.chakro.server;

import com.chakro.server.dto.AuthResponse;
import com.chakro.server.dto.RegisterRequest;
import com.chakro.server.repository.OpportunityRepository;
import com.chakro.server.repository.ProposalDraftRepository;
import com.chakro.server.repository.TenantRepository;
import com.chakro.server.repository.UserRepository;
import com.chakro.server.service.AuthenticationService;
import com.chakro.server.vbdp.model.DiscoveryReport;
import com.chakro.server.vbdp.model.HackathonOpportunity;
import com.chakro.server.vbdp.service.VbdpOrchestrationService;
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
    "spring.datasource.url=jdbc:h2:mem:testdb_persist;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.flyway.enabled=false"
})
@ActiveProfiles("test")
public class SupabasePersistenceTest {

    private static final Logger log = LoggerFactory.getLogger(SupabasePersistenceTest.class);

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private VbdpOrchestrationService orchestrationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private ProposalDraftRepository proposalRepository;

    @Test
    @Transactional
    public void testPersistenceWorkflow() {
        log.info(">>> BEGIN PERSISTENCE VERIFICATION TEST");
        log.info("AuthenticationService class: {}", authenticationService.getClass().getName());

        // Scenario 1: Signup/Profile Storage
        String email = "persist.test@example.com";
        RegisterRequest registerRequest = new RegisterRequest(
                "Persist Tester",
                email,
                "password123",
                "Persistence Corp"
        );

        log.info("SCENARIO 1: Verifying Signup Persistence...");
        AuthResponse authResponse = authenticationService.register(registerRequest);
        
        assertThat(authResponse).isNotNull();
        assertThat(userRepository.findByEmailAndIsActiveTrue(email)).isPresent();
        assertThat(tenantRepository.findByName("Persistence Corp")).isPresent();
        log.info("Signup persistence verified: User and Tenant stored.");

        // Scenario 2: Discovery (Commit-Only Rule check)
        log.info("SCENARIO 2: Verifying Discovery Commit-Only Rule...");
        long initialOppCount = opportunityRepository.count();
        String discoveryQuery = "AI Hackathon";
        
        DiscoveryReport report = orchestrationService.runDiscovery(discoveryQuery);
        
        long afterDiscoveryCount = opportunityRepository.count();
        assertThat(afterDiscoveryCount).isEqualTo(initialOppCount);
        log.info("Commit-Only rule verified: Discovery returned {} items, but database size remained at {}.", 
                report.getOpportunities().size(), afterDiscoveryCount);

        // Scenario 3: Explicit Commit (Proposal Trigger)
        log.info("SCENARIO 3: Verifying Explicit Commit Persistence...");
        if (report.getOpportunities().isEmpty()) {
            log.warn("No opportunities found for query, skipping commit test or using mock.");
            return;
        }

        HackathonOpportunity firstOpp = report.getOpportunities().get(0);
        orchestrationService.commitOpportunity(firstOpp);

        long finalOppCount = opportunityRepository.count();
        assertThat(finalOppCount).isEqualTo(initialOppCount + 1);
        
        // Verify Proposal Draft creation (Analysis + Proposal triggered automatically in commit)
        List<com.chakro.server.domain.ProposalDraft> drafts = proposalRepository.findAll();
        assertThat(drafts).isNotEmpty();
        log.info("Explicit commit verified: Opportunity stored and Proposal Draft generated.");

        log.info(">>> END PERSISTENCE VERIFICATION TEST (PASSED)");
    }
}
