package com.chakro.server.vbdp.config;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Application properties for the Virtual Business Development Partner (VBDP).
 *
 * <p>Mapped from {@code vbdp.*} in {@code application.yml}.
 */
@ConfigurationProperties(prefix = "vbdp")
public class VbdpProperties {

    private final Discovery discovery = new Discovery();

    public Discovery getDiscovery() {
        return discovery;
    }

    public static class Discovery {

        /** Maximum number of concurrent threads used by the discovery agent. */
        private int maxThreads = 8;

        /** HTTP request configuration for discovery operations. */
        private final Request request = new Request();

        /** List of user agent strings to use when scraping the web. */
        private List<String> userAgents = new ArrayList<>();

        public int getMaxThreads() {
            return maxThreads;
        }

        public void setMaxThreads(int maxThreads) {
            this.maxThreads = maxThreads;
        }

        public Request getRequest() {
            return request;
        }

        public List<String> getUserAgents() {
            return userAgents;
        }

        public void setUserAgents(List<String> userAgents) {
            this.userAgents = userAgents;
        }

        public static class Request {

            /** Timeout for web requests made during discovery (e.g., search and scraping). */
            private Duration timeout = Duration.ofSeconds(15);

            public Duration getTimeout() {
                return timeout;
            }

            public void setTimeout(Duration timeout) {
                this.timeout = timeout;
            }
        }
    }
}
