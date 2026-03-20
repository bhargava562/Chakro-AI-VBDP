package com.chakro.server.agent.sub;

import com.chakro.server.agent.AnalysisAgent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Sub-agent responsible for assessing risks in tender documents.
 * Identifies ambiguous clauses, unrealistic timelines, and compliance concerns.
 */
@Component
public class RiskAssessmentSubAgent {

    private static final Logger log = LoggerFactory.getLogger(RiskAssessmentSubAgent.class);
    private final AnalysisAgent analysisAgent;

    public RiskAssessmentSubAgent(AnalysisAgent analysisAgent) {
        this.analysisAgent = analysisAgent;
    }

    /**
     * Assesses risks in the document text using the AnalysisAgent.
     *
     * @param documentText cleaned document text
     * @return risk assessment string with severity ratings
     */
    public String assessRisks(String documentText) {
        log.info("RiskAssessmentSubAgent: assessing risks from {} chars", documentText.length());

        String prompt = """
                Perform a thorough risk assessment of the following tender document.
                
                Identify and categorize all risks including:
                1. CONTRACTUAL RISKS: Ambiguous clauses, unfavorable terms, penalty clauses
                2. TIMELINE RISKS: Unrealistic deadlines, tight delivery schedules
                3. COMPLIANCE RISKS: Complex regulatory requirements, certifications needed
                4. FINANCIAL RISKS: Payment terms, bonds, guarantees, budget constraints
                5. TECHNICAL RISKS: Unfamiliar technologies, integration complexity
                6. RESOURCE RISKS: Team availability, skill gaps, subcontracting needs
                7. REPUTATIONAL RISKS: Client reputation issues, project visibility
                
                For each risk, provide:
                - Description of the risk
                - Severity: HIGH / MEDIUM / LOW
                - Mitigation strategy suggestion
                
                DOCUMENT TEXT:
                %s
                """.formatted(documentText);

        String result = analysisAgent.assessRisks(prompt);
        log.info("RiskAssessmentSubAgent: completed risk assessment");
        return result;
    }
}
