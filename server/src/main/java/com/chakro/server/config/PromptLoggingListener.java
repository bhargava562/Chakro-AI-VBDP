package com.chakro.server.config;

import dev.langchain4j.model.chat.listener.ChatModelListener;
import dev.langchain4j.model.chat.listener.ChatModelRequestContext;
import dev.langchain4j.model.chat.listener.ChatModelResponseContext;
import dev.langchain4j.model.chat.listener.ChatModelErrorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Custom LangChain4j ChatModelListener to log the exact Request Prompt 
 * and exact Raw Response. Critical for debugging hallucination, alignment, 
 * and guardrail issues during testing and development.
 */
@Component
public class PromptLoggingListener implements ChatModelListener {

    private static final Logger log = LoggerFactory.getLogger(PromptLoggingListener.class);

    @Override
    public void onRequest(ChatModelRequestContext requestContext) {
        if (log.isInfoEnabled()) {
            log.info("================================ LLM REQUEST ================================");
            requestContext.chatRequest().messages().forEach(message -> {
                log.info("[{}] {}", message.type(), message.toString());
            });
            log.info("=============================================================================");
        }
    }

    @Override
    public void onResponse(ChatModelResponseContext responseContext) {
        if (log.isInfoEnabled()) {
            log.info("=============================== LLM RESPONSE ================================");
            log.info("Raw Response: {}", responseContext.chatResponse().aiMessage().text());
            log.info("Token Usage: Input={}, Output={}, Total={}",
                    responseContext.chatResponse().tokenUsage().inputTokenCount(),
                    responseContext.chatResponse().tokenUsage().outputTokenCount(),
                    responseContext.chatResponse().tokenUsage().totalTokenCount());
            log.info("=============================================================================");
        }
    }

    @Override
    public void onError(ChatModelErrorContext errorContext) {
        log.error("================================ LLM ERROR ==================================", errorContext.error());
        log.error("Failed Request Messages:");
        errorContext.chatRequest().messages().forEach(message -> {
            log.error("[{}] {}", message.type(), message.toString());
        });
        log.error("=============================================================================");
    }
}
