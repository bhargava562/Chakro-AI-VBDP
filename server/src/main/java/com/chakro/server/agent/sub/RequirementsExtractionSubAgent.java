package com.chakro.server.agent.sub;

import com.chakro.server.agent.AnalysisAgent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Sub-agent responsible for extracting key requirements from tender documents.
 * Delegates to the AnalysisAgent AI service for LLM-powered extraction.
 */
@Component
public class RequirementsExtractionSubAgent {

    private static final Logger log = LoggerFactory.getLogger(RequirementsExtractionSubAgent.class);
    private final AnalysisAgent analysisAgent;

    public RequirementsExtractionSubAgent(AnalysisAgent analysisAgent) {
        this.analysisAgent = analysisAgent;
    }

    /**
     * Extracts structured requirements from document text.
     *
     * @param documentText cleaned document text
     * @return structured requirements string from the LLM
     */
    public String extractRequirements(String documentText) {
        log.info("RequirementsExtractionSubAgent: extracting requirements from {} chars",
                documentText.length());

        String prompt = """
                Analyze the following tender document and extract all key requirements.
                
                Focus on:
                1. Eligibility criteria (company size, certifications, experience)
                2. Technical specifications and requirements
                3. Scope of work and deliverables
                4. Submission deadlines and timelines
                5. Budget/financial requirements
                6. Compliance and regulatory requirements
                7. Mandatory vs optional requirements
                
                DOCUMENT TEXT:
                %s
                """.formatted(documentText);

        String result = analysisAgent.extractRequirements(prompt);
        
        if (result.contains("SECURITY_VIOLATION")) {
            throw new com.chakro.server.exception.AnalysisException("SECURITY_VIOLATION: Prompt injection or malicious content detected.");
        }
        if (result.contains("IRRELEVANT_CONTENT") || result.toLowerCase().contains("cannot analyze personal data")) {
            throw new com.chakro.server.exception.AnalysisException("Irrelevant content detected: Document does not appear to be a professional tender.");
        }
        
        log.info("RequirementsExtractionSubAgent: completed extraction");
        return result;
    }
}
