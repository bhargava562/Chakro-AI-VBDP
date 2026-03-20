package com.chakro.server.agent;

import com.chakro.server.agent.tool.DocumentParsingTool;
import com.chakro.server.agent.tool.DocumentGenerationTool;
import com.chakro.server.agent.tool.KnowledgeBaseTool;
import com.chakro.server.agent.tool.ProposalTemplateTool;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.service.AiServices;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Wires LangChain4j AiServices for Analysis and Response agents,
 * connecting the ChatLanguageModel, chat memory, and tool beans.
 */
@Configuration
public class AgentConfig {

    @Bean
    public AnalysisAgent analysisAgent(ChatLanguageModel chatLanguageModel,
                                        DocumentParsingTool documentParsingTool,
                                        KnowledgeBaseTool knowledgeBaseTool) {
        return AiServices.builder(AnalysisAgent.class)
                .chatLanguageModel(chatLanguageModel)
                .chatMemory(MessageWindowChatMemory.withMaxMessages(20))
                .tools(documentParsingTool, knowledgeBaseTool)
                .build();
    }

    @Bean
    public ResponseAgent responseAgent(ChatLanguageModel chatLanguageModel,
                                        KnowledgeBaseTool knowledgeBaseTool,
                                        DocumentGenerationTool documentGenerationTool,
                                        ProposalTemplateTool proposalTemplateTool) {
        return AiServices.builder(ResponseAgent.class)
                .chatLanguageModel(chatLanguageModel)
                .chatMemory(MessageWindowChatMemory.withMaxMessages(20))
                .tools(knowledgeBaseTool, documentGenerationTool, proposalTemplateTool)
                .build();
    }
}
