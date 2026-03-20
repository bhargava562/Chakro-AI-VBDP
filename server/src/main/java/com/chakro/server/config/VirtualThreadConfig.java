package com.chakro.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Configures Java 21 Virtual Thread executor for high-throughput,
 * non-blocking orchestration of agent and sub-agent calls.
 */
@Configuration
public class VirtualThreadConfig {

    @Bean
    public ExecutorService virtualThreadExecutor() {
        return Executors.newVirtualThreadPerTaskExecutor();
    }
}
