package com.chakro.server.agent.sub;

import com.chakro.server.agent.ResponseAgent;
import com.chakro.server.agent.tool.KnowledgeBaseTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Sub-agent responsible for generating proposal content.
 * Uses the ResponseAgent, knowledge base, and proposal structure
 * to produce professional, compliant proposal text.
 * Supports both initial generation and revision based on feedback.
 */
@Component
public class ContentGenerationSubAgent {

    private static final Logger log = LoggerFactory.getLogger(ContentGenerationSubAgent.class);
    private final ResponseAgent responseAgent;
    private final KnowledgeBaseTool knowledgeBaseTool;

    public ContentGenerationSubAgent(ResponseAgent responseAgent,
                                      KnowledgeBaseTool knowledgeBaseTool) {
        this.responseAgent = responseAgent;
        this.knowledgeBaseTool = knowledgeBaseTool;
    }

    /**
     * Generates full proposal content based on analysis, structure, and company knowledge.
     *
     * @param analysisData structured analysis data
     * @param proposalStructure planned proposal structure
     * @return generated proposal content
     */
    public String generateContent(String analysisData, String proposalStructure) {
        log.info("ContentGenerationSubAgent: generating proposal content");

        // Query knowledge base for company capabilities
        String companyProfile = knowledgeBaseTool.queryKnowledgeBase(
                "company profile capabilities certifications past projects");

        String prompt = """
                Generate a complete, professional proposal document based on the following inputs.
                
                === TENDER ANALYSIS ===
                %s
                
                === PROPOSAL STRUCTURE ===
                %s
                
                === COMPANY PROFILE & CAPABILITIES ===
                %s
                
                INSTRUCTIONS:
                1. Write professional, detailed content for EACH section of the proposal structure
                2. Ensure compliance with ALL tender requirements identified in the analysis
                3. Showcase company strengths that directly address tender needs
                4. Include specific metrics, timelines, and deliverables
                5. Maintain a confident but non-committal tone (this is a DRAFT)
                6. Add compliance matrix mapping requirements to capabilities
                7. Do NOT include pricing/financial details — mark as [TO BE DETERMINED]
                8. Do NOT make any binding commitments or guarantees
                
                Generate the full proposal content now.
                """.formatted(analysisData, proposalStructure, companyProfile);

        String result = responseAgent.generateProposal(prompt);
        log.info("ContentGenerationSubAgent: content generation completed");
        return result;
    }

    /**
     * Refines existing proposal content based on human reviewer feedback.
     *
     * @param previousContent the existing proposal content
     * @param feedback reviewer's feedback and revision requests
     * @return refined proposal content
     */
    public String refineContent(String previousContent, String feedback) {
        log.info("ContentGenerationSubAgent: refining content with feedback");

        String result = responseAgent.refineProposal(previousContent, feedback);
        log.info("ContentGenerationSubAgent: content refinement completed");
        return result;
    }
}
