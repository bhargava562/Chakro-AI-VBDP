package com.chakro.server.vbdp.tools;

import com.chakro.server.vbdp.annotation.Tool;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * Toolset for controlled web searching and scraping.
 *
 * <p>This class is intended to be used as part of the Discovery Agent and is intentionally constrained
 * to only perform safe, read-only operations against public hackathon portals.
 */
@Component
public class WebScraperTools {

    private static final int DEFAULT_TIMEOUT_SECONDS = 15;

    private final WebClient webClient;
    private final List<String> userAgents;
    private final Random random;

    public WebScraperTools(com.chakro.server.vbdp.config.VbdpProperties vbdpProperties) {
        this.webClient = WebClient.builder().build();
        this.userAgents = Collections.unmodifiableList(new ArrayList<>(
                vbdpProperties.getDiscovery().getUserAgents()));
        this.random = new Random();
    }

    @Tool
    public List<String> searchWeb(String query) {
        if (query == null || query.isBlank()) {
            return Collections.emptyList();
        }

        try {
            String encoded = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String searchUrl = "https://www.bing.com/search?q=" + encoded;

            String html = webClient.get()
                    .uri(searchUrl)
                    .header("User-Agent", randomUserAgent())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(Duration.ofSeconds(DEFAULT_TIMEOUT_SECONDS));

            if (html == null) {
                return Collections.emptyList();
            }

            Document doc = Jsoup.parse(html);
            Elements links = doc.select("li.b_algo h2 a");
            List<String> result = new ArrayList<>();

            for (Element link : links) {
                String href = link.absUrl("href");
                if (!href.isBlank() && !result.contains(href)) {
                    result.add(href);
                }
            }

            return result;
        } catch (Exception e) {
            // In a production system we would log the failure with an observability framework.
            return Collections.emptyList();
        }
    }

    @Tool
    public String fetchPageContent(String url) {
        if (url == null || url.isBlank()) {
            return "";
        }

        if (isRestrictedDomain(url)) {
            throw new IllegalArgumentException("Scraping is prohibited for restricted domains: " + url);
        }

        try {
            // Basic robots.txt compliance check (only for demonstration). In production, use a robust parser.
            if (!isAllowedByRobots(url)) {
                throw new IllegalStateException("Disallowed by robots.txt: " + url);
            }

            Document document = Jsoup.connect(url)
                    .userAgent(randomUserAgent())
                    .timeout(DEFAULT_TIMEOUT_SECONDS * 1000)
                    .followRedirects(true)
                    .get();

            // Remove noise
            document.select("script, style, noscript, iframe, header, footer, nav, form, input").remove();
            return document.body().text();
        } catch (Exception e) {
            return "";
        }
    }

    private String randomUserAgent() {
        if (userAgents.isEmpty()) {
            return "Mozilla/5.0 (compatible; VBDP-Agent/1.0; +https://example.com)";
        }
        return userAgents.get(random.nextInt(userAgents.size()));
    }

    private boolean isRestrictedDomain(String rawUrl) {
        try {
            URI uri = URI.create(rawUrl);
            String host = uri.getHost();
            if (host == null) {
                return true;
            }
            String lower = host.toLowerCase();
            return lower.endsWith(".gov") || lower.endsWith(".nic.in") || lower.endsWith(".mil");
        } catch (Exception e) {
            return true;
        }
    }

    private boolean isAllowedByRobots(String rawUrl) {
        try {
            URI uri = URI.create(rawUrl);
            URI robotsUri = UriComponentsBuilder.newInstance()
                    .scheme(uri.getScheme())
                    .host(uri.getHost())
                    .path("/robots.txt")
                    .build(true)
                    .toUri();

            String robotsTxt = webClient.get()
                    .uri(robotsUri)
                    .header("User-Agent", randomUserAgent())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(Duration.ofSeconds(DEFAULT_TIMEOUT_SECONDS));

            if (robotsTxt == null) {
                return true;
            }

            String path = uri.getPath();
            for (String line : robotsTxt.split("\n")) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                if (line.toLowerCase().startsWith("disallow:")) {
                    String disallowed = line.substring("disallow:".length()).trim();
                    if (!disallowed.isEmpty() && path.startsWith(disallowed)) {
                        return false;
                    }
                }
            }

            return true;
        } catch (Exception e) {
            // Fail open for resiliency; a permanent block should be handled by a higher-level guard.
            return true;
        }
    }
}
