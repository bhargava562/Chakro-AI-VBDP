package com.chakro.server.agent.tool;

import dev.langchain4j.agent.tool.Tool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * LangChain4j tool for retrieving standard proposal section templates.
 */
@Component
public class ProposalTemplateTool {

    private static final Logger log = LoggerFactory.getLogger(ProposalTemplateTool.class);

    @Tool("Retrieves standard proposal section templates including Executive Summary, "
            + "Technical Approach, Compliance Matrix, and other sections. "
            + "Use these templates to structure the proposal document.")
    public String getProposalTemplates() {
        log.info("Retrieving proposal templates");

        return """
                === PROPOSAL TEMPLATE STRUCTURE ===
                
                ## 1. COVER PAGE
                - Company Name & Logo placeholder
                - Proposal Title (matching the tender/opportunity title)
                - Submission Date
                - Reference Number (if applicable)
                - Confidentiality Notice
                
                ## 2. EXECUTIVE SUMMARY
                - Brief company introduction (2-3 sentences)
                - Understanding of the client's requirement
                - Proposed solution overview
                - Key differentiators and value proposition
                - Expected outcomes and benefits
                
                ## 3. COMPANY PROFILE & QUALIFICATIONS
                - Company overview and history
                - Relevant certifications (ISO, CMMI, etc.)
                - Team structure and key personnel
                - Financial stability statement
                - MSME registration details
                
                ## 4. TECHNICAL APPROACH
                - Detailed solution architecture
                - Technology stack and justification
                - Implementation methodology (Agile/Waterfall)
                - Integration approach with existing systems
                - Innovation and emerging technology usage
                
                ## 5. PROJECT PLAN & TIMELINE
                - Phase-wise delivery plan
                - Key milestones and deliverables
                - Resource allocation plan
                - Risk mitigation schedule
                - Dependencies and assumptions
                
                ## 6. COMPLIANCE MATRIX
                - Point-by-point compliance with tender requirements
                - Mandatory requirement fulfillment status
                - Optional/desirable requirement coverage
                - Deviation statements (if any)
                - Clarification notes
                
                ## 7. PAST EXPERIENCE & CASE STUDIES
                - 3-5 relevant project references
                - Client testimonials (if available)
                - Performance metrics from past projects
                - Lessons learned and best practices applied
                
                ## 8. QUALITY ASSURANCE
                - QA methodology and processes
                - Testing strategy (Unit, Integration, UAT)
                - Code review and security audit practices
                - SLA commitments
                - Warranty and support terms
                
                ## 9. COMMERCIALS (PLACEHOLDER)
                - [To be filled by the business team]
                - Pricing model overview
                - Payment schedule
                - Terms and conditions reference
                
                ## 10. APPENDICES
                - Team CVs / Resumes
                - Certification copies
                - Technical architecture diagrams
                - Sample deliverables
                """;
    }
}
