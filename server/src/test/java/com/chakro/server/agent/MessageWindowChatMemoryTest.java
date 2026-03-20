package com.chakro.server.agent;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for token optimization and context window constraints.
 * Verifies that older messages are correctly evicted to prevent exceeding
 * Groq AI's token limits and to minimize API costs.
 */
public class MessageWindowChatMemoryTest {

    @Test
    @DisplayName("Token Optimization: Chat memory must strictly evict messages exceeding capacity")
    void testMessageEvictionForTokenOptimization() {
        // Given a strict capacity of 10 messages (for testing purposes)
        int capacity = 10;
        ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(capacity);

        // When we add 25 messages alternating between User and AI
        for (int i = 1; i <= 25; i++) {
            if (i % 2 != 0) {
                chatMemory.add(UserMessage.from("User prompt " + i));
            } else {
                chatMemory.add(AiMessage.from("AI response " + i));
            }
        }

        // Then exactly 10 messages should remain
        var remainingMessages = chatMemory.messages();
        assertThat(remainingMessages).hasSize(capacity);

        // And they should be the LAST 10 messages (messages 16 through 25)
        // Note: index 0 corresponds to message 16
        // Let's verify the content of the oldest remaining message
        assertThat(remainingMessages.get(0).toString()).contains("AI response 16");
        
        // And verify the content of the newest remaining message
        assertThat(remainingMessages.get(capacity - 1).toString()).contains("User prompt 25");
        
        // Double check no old messages leaked
        boolean hasOldMessage = remainingMessages.stream()
                .anyMatch(m -> m.toString().contains("prompt 15") || m.toString().contains("response 15"));
        assertThat(hasOldMessage).isFalse();
    }
}
