package com.chakro.server;

import com.chakro.server.repository.OpportunityRepository;
import com.chakro.server.vbdp.service.VbdpOrchestrationService;
import com.chakro.server.domain.ProposalDraft;
import com.chakro.server.vbdp.model.DiscoveryReport;
import com.chakro.server.vbdp.model.HackathonOpportunity;
import com.chakro.server.vbdp.model.SecurityAssessment;
import com.chakro.server.vbdp.agent.DiscoveryAgent;
import com.chakro.server.vbdp.agent.SecurityAgent;
import com.chakro.server.service.AnalysisService;
import com.chakro.server.service.ProposalService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

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
class EndToEndWorkflowTest {

    @MockBean
    private DiscoveryAgent discoveryAgent;

    @MockBean
    private SecurityAgent securityAgent;

    @MockBean
    private AnalysisService analysisService;

    @MockBean
    private ProposalService proposalService;

    @Autowired
    private VbdpOrchestrationService orchestrationService;

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Test
    @DisplayName("Happy Path: Discovery -> Security -> Analysis -> Response (End-to-End)")
    void shouldSuccessfullyExecuteFullPipeline() {
        String query = "Enterprise AI Hackathon";
        String url = "https://safe-hackathon.local/2026";
        HackathonOpportunity opp = new HackathonOpportunity("Safe Hackathon", url, "Problem Statement", SecurityAssessment.pass(), Instant.now());
        
        when(discoveryAgent.discover(query)).thenReturn(new DiscoveryReport(query, List.of(opp), Instant.now(), Instant.now()));
        when(securityAgent.validateOpportunities(anyList())).thenReturn(List.of(opp));
        when(proposalService.generateProposal(any(UUID.class))).thenReturn(new ProposalDraft());

        orchestrationService.executeFullPipeline(query);

        // Verify counts and flows
        assertThat(opportunityRepository.count()).isGreaterThan(0);
        verify(analysisService, times(1)).runAnalysis(any(UUID.class));
        verify(proposalService, times(1)).generateProposal(any(UUID.class));
    }

    @Test
    @DisplayName("Guardrail Path: Security Agent detects malicious URL and halts pipeline")
    void shouldHaltPipelineOnSecurityViolation() {
        String query = "Malicious Hackathon";
        String url = "http://malicious-site.local/exploit";
        SecurityAssessment violation = SecurityAssessment.violation("XSS Detected");
        HackathonOpportunity badOpp = new HackathonOpportunity("Malicious", url, "<script>alert(1)</script>", violation, Instant.now());

        when(discoveryAgent.discover(query)).thenReturn(new DiscoveryReport(query, List.of(badOpp), Instant.now(), Instant.now()));
        when(securityAgent.validateOpportunities(anyList())).thenReturn(List.of(badOpp));

        assertThatThrownBy(() -> orchestrationService.executeFullPipeline(query))
                .isInstanceOf(RuntimeException.class) // The orchestrator wraps or rethrows
                .hasMessageContaining("SECURITY HALT");
        
        // Ensure analysis never ran
        verify(analysisService, never()).runAnalysis(any());
    }
}
