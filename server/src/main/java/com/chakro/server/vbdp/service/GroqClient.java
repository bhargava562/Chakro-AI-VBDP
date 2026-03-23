package com.chakro.server.vbdp.service;

import com.chakro.server.vbdp.config.GroqProperties;
import com.chakro.server.vbdp.memory.MessageWindowChatMemory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Objects;

/**
 * Minimal HTTP client for calling the Groq text generation API.
 *
 * <p>This client is intentionally lightweight and does not depend on any third party
 * LLM framework so it can be used in constrained dependency environments.
 */
@Component
public class GroqClient {

    private final WebClient webClient;
    private final GroqProperties groqProperties;
    private final ObjectMapper objectMapper;

    public GroqClient(GroqProperties groqProperties,
                      @org.springframework.beans.factory.annotation.Value("${GROQ_API_KEY:}") String apiKey) {
        Objects.requireNonNull(apiKey, "GROQ_API_KEY must be set in the environment");
        this.groqProperties = groqProperties;
        this.objectMapper = new ObjectMapper();
        this.webClient = WebClient.builder()
                .baseUrl(groqProperties.getApi().getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
    }

    /**
     * Sends the provided prompts to the Groq model and returns the raw generated text.
     */
    public String generate(String systemPrompt, String userPrompt, MessageWindowChatMemory memory) {
        String combined = buildPrompt(systemPrompt, userPrompt, memory);

        try {
            String body = objectMapper.createObjectNode()
                    .put("input", combined)
                    .put("model", groqProperties.getApi().getModel())
                    .put("max_output_tokens", groqProperties.getApi().getMaxTokens())
                    .put("temperature", 0.0)
                    .toString();

            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder.path("/models/{model}/generate")
                            .build(groqProperties.getApi().getModel()))
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(groqProperties.getApi().getTimeout())
                    .block();

            if (response == null) {
                return "";
            }

            // Try to parse standard Groq response formats.
            JsonNode root = objectMapper.readTree(response);
            if (root.has("output") && root.get("output").isTextual()) {
                return root.get("output").asText();
            }
            if (root.has("results") && root.get("results").isArray()) {
                StringBuilder sb = new StringBuilder();
                root.get("results").forEach(node -> {
                    if (node.has("output") && node.get("output").isTextual()) {
                        sb.append(node.get("output").asText()).append("\n");
                    }
                });
                return sb.toString().trim();
            }

            return response;
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(GroqClient.class).error("Groq generation failed for prompt: {}. Error: {}", 
                userPrompt.length() > 50 ? userPrompt.substring(0, 50) + "..." : userPrompt, 
                e.getMessage(), e);
            return "ERROR: " + e.getMessage();
        }
    }

    private String buildPrompt(String systemPrompt, String userPrompt, MessageWindowChatMemory memory) {
        StringBuilder sb = new StringBuilder();
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            sb.append("SYSTEM: ").append(systemPrompt).append("\n\n");
        }
        memory.getHistory().forEach(past -> sb.append("HISTORY: ").append(past).append("\n"));
        sb.append("USER: ").append(userPrompt).append("\n");
        return sb.toString();
    }
}
