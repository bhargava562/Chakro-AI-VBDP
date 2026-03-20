package com.chakro.server.vbdp.memory;

import java.util.ArrayDeque;
import java.util.Collection;
import java.util.Collections;
import java.util.Deque;
import java.util.Objects;

/**
 * Simple in-memory sliding window history for model prompts.
 */
public class MessageWindowChatMemory {

    private final int maxMessages;
    private final Deque<String> messages = new ArrayDeque<>();

    public MessageWindowChatMemory(int maxMessages) {
        if (maxMessages < 1) {
            throw new IllegalArgumentException("maxMessages must be >= 1");
        }
        this.maxMessages = maxMessages;
    }

    public synchronized void addMessage(String entry) {
        Objects.requireNonNull(entry);
        if (messages.size() >= maxMessages) {
            messages.removeFirst();
        }
        messages.addLast(entry);
    }

    public synchronized Collection<String> getHistory() {
        return Collections.unmodifiableList(new java.util.ArrayList<>(messages));
    }

    public synchronized void clear() {
        messages.clear();
    }
}
