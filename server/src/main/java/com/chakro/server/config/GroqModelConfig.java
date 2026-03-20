package com.chakro.server.config;

import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configures the LangChain4j ChatLanguageModel to use Groq via its
 * OpenAI-compatible API endpoint.
 */
@Configuration
public class GroqModelConfig {

    private static final Logger log = LoggerFactory.getLogger(GroqModelConfig.class);
    private static final String GROQ_BASE_URL = "https://api.groq.com/openai/v1";

    @Bean
    public ChatLanguageModel chatLanguageModel(
            @Qualifier("groqApiKey") String groqApiKey,
            @Qualifier("groqModelName") String groqModelName,
            PromptLoggingListener promptLoggingListener) {

        log.info("Initializing Groq ChatLanguageModel with model: {}", groqModelName);

        return OpenAiChatModel.builder()
                .baseUrl(GROQ_BASE_URL)
                .apiKey(groqApiKey)
                .modelName(groqModelName)
                .temperature(0.3)
                .maxTokens(4096)
                .timeout(Duration.ofSeconds(120))
                .logRequests(false)  // Never log requests containing potential secrets via default logger
                .logResponses(false)
                .listeners(java.util.List.of(promptLoggingListener))
                .build();
    }

    @Bean
    public ChatMemory chatMemory() {
        return MessageWindowChatMemory.withMaxMessages(20);
    }
}
