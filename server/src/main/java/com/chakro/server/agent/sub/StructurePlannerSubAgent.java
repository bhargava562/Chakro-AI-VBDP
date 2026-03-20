package com.chakro.server.agent.sub;

import com.chakro.server.agent.ResponseAgent;
import com.chakro.server.agent.tool.ProposalTemplateTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Sub-agent responsible for planning the proposal structure.
 * Uses templates and analysis data to define the proposal outline.
 */
@Component
public class StructurePlannerSubAgent {

    private static final Logger log = LoggerFactory.getLogger(StructurePlannerSubAgent.class);
    private final ResponseAgent responseAgent;
    private final ProposalTemplateTool proposalTemplateTool;

    public StructurePlannerSubAgent(ResponseAgent responseAgent,
                                     ProposalTemplateTool proposalTemplateTool) {
        this.responseAgent = responseAgent;
        this.proposalTemplateTool = proposalTemplateTool;
    }

    /**
     * Plans the proposal structure based on analysis data and templates.
     *
     * @param analysisData structured analysis data
     * @return planned proposal structure
     */
    public String planStructure(String analysisData) {
        log.info("StructurePlannerSubAgent: planning proposal structure");

        String templates = proposalTemplateTool.getProposalTemplates();

        String prompt = """
                Based on the following analysis of a tender opportunity and available proposal
                templates, plan the optimal structure for this specific proposal.
                
                Customize the template sections based on the tender requirements.
                Remove irrelevant sections and add any tender-specific sections needed.
                
                === AVAILABLE TEMPLATES ===
                %s
                
                === TENDER ANALYSIS ===
                %s
                
                Provide a detailed proposal outline with section names, order, and brief
                descriptions of what each section should contain for this specific tender.
                """.formatted(templates, analysisData);

        String result = responseAgent.planProposalStructure(prompt);
        log.info("StructurePlannerSubAgent: structure planning completed");
        return result;
    }
}
