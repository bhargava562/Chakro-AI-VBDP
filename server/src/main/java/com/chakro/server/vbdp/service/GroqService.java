package com.chakro.server.vbdp.service;

import com.chakro.server.vbdp.memory.MessageWindowChatMemory;
import org.springframework.stereotype.Service;

import java.util.Objects;

/**
 * Wrapper around the Groq HTTP client to expose a simple prompt-response API.
 */
@Service
public class GroqService {

    private final GroqClient groqClient;
    private final MessageWindowChatMemory memory;

    public GroqService(GroqClient groqClient, MessageWindowChatMemory memory) {
        this.groqClient = Objects.requireNonNull(groqClient);
        this.memory = Objects.requireNonNull(memory);
    }

    /**
     * Executes a system + user prompt exchange and returns the model's response text.
     */
    public String ask(String systemPrompt, String userPrompt) {
        memory.addMessage(userPrompt);
        return groqClient.generate(systemPrompt, userPrompt, memory);
    }
}
