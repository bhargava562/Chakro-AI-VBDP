package com.chakro.server.vbdp.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties for the Groq API integration.
 *
 * <p>This class is used to map non-sensitive configuration values from {@code application.yml}.
 * Sensitive values like {@code GROQ_API_KEY} must be supplied via environment variables or a local
 * {@code .env} file loaded by the build/runtime environment.
 */
@ConfigurationProperties(prefix = "groq")
public class GroqProperties {

    /** Groq inference API settings (base URL, model and timeouts). */
    private final Api api = new Api();

    /** Chat memory settings for sliding window prompt history. */
    private final ChatMemory chatMemory = new ChatMemory();

    public Api getApi() {
        return api;
    }

    public ChatMemory getChatMemory() {
        return chatMemory;
    }

    public static class Api {
        /** Base URL for the Groq inference endpoint. */
        private String baseUrl;

        /** The model to use for Groq calls (e.g. llama-3.3-70b-versatile). */
        private String model;

        /** Request timeout for Groq API calls. */
        private Duration timeout;

        /** Maximum number of tokens to request from the model. */
        private int maxTokens;

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public Duration getTimeout() {
            return timeout;
        }

        public void setTimeout(Duration timeout) {
            this.timeout = timeout;
        }

        public int getMaxTokens() {
            return maxTokens;
        }

        public void setMaxTokens(int maxTokens) {
            this.maxTokens = maxTokens;
        }
    }

    public static class ChatMemory {
        /** Maximum number of previous messages to keep in memory when building prompts. */
        private int maxMessages = 20;

        public int getMaxMessages() {
            return maxMessages;
        }

        public void setMaxMessages(int maxMessages) {
            this.maxMessages = maxMessages;
        }
    }
}
