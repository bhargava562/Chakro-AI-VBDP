package com.chakro.server.vbdp.config;

import com.chakro.server.vbdp.memory.MessageWindowChatMemory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Application configuration for the Virtual Business Development Partner (VBDP) backend.
 */
@Configuration
@EnableConfigurationProperties({GroqProperties.class, VbdpProperties.class})
public class VbdpConfig {

    @Bean
    public MessageWindowChatMemory vbdpChatMemory(GroqProperties groqProperties) {
        return new MessageWindowChatMemory(groqProperties.getChatMemory().getMaxMessages());
    }
}
