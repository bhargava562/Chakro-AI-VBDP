package com.chakro.server.vbdp.agent;

import com.chakro.server.vbdp.model.DiscoveryReport;
import com.chakro.server.vbdp.model.HackathonOpportunity;
import com.chakro.server.vbdp.model.SecurityAssessment;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class DiscoveryAgentTest {

    private HackathonSearchAgent searchAgent;
    private ScrapingAgent scrapingAgent;
    private SourceValidatorAgent sourceValidator;
    private InjectionDetectorAgent injectionDetector;
    private DiscoveryAgent discoveryAgent;

    @BeforeEach
    void setUp() {
        searchAgent = Mockito.mock(HackathonSearchAgent.class);
        scrapingAgent = Mockito.mock(ScrapingAgent.class);
        sourceValidator = Mockito.mock(SourceValidatorAgent.class);
        injectionDetector = Mockito.mock(InjectionDetectorAgent.class);

        discoveryAgent = new DiscoveryAgent(
                searchAgent,
                scrapingAgent,
                sourceValidator,
                injectionDetector);
    }

    @Test
    void discover_shouldRejectGovDomain() {
        when(searchAgent.searchHackathons(anyString())).thenReturn(Collections.singletonList("https://example.gov/hackathon"));
        when(sourceValidator.validateSource(anyString())).thenReturn(SecurityAssessment.violation("gov domain not allowed"));

        DiscoveryReport report = discoveryAgent.discover("test");

        assertThat(report.getOpportunities()).hasSize(1);
        HackathonOpportunity opportunity = report.getOpportunities().get(0);
        assertThat(opportunity.getSecurityAssessment().getStatus()).isEqualTo(SecurityAssessment.Status.SECURITY_VIOLATION);
    }
}
