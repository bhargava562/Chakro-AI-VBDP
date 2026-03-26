package com.chakro.server.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Loads environment variables from a .env file using dotenv-java.
 * Secrets like GROQ_API_KEY are loaded here and never placed in
 * application.yaml or application.properties.
 */
@Configuration
public class EnvConfig {

    private static final Logger log = LoggerFactory.getLogger(EnvConfig.class);

    @Bean
    public Dotenv dotenv() {
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .filename(".env")
                .ignoreIfMissing()
                .load();
        
        // Export variables to System properties so Spring can resolve them in application.yml via ${VAR_NAME}
        dotenv.entries().forEach(entry -> {
            if (System.getProperty(entry.getKey()) == null) {
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });

        log.info("Dotenv loaded and exported to System properties. GROQ_API_KEY present: {}", 
                dotenv.get("GROQ_API_KEY") != null);
        return dotenv;
    }

    @Bean
    public String groqApiKey(Dotenv dotenv) {
        String key = dotenv.get("GROQ_API_KEY");
        if (key == null || key.isBlank()) {
            log.warn("GROQ_API_KEY is not set. AI agents will not function. "
                    + "Create a .env file from .env.example and set the key.");
        }
        return key != null ? key : "";
    }

    @Bean
    public String groqModelName(Dotenv dotenv) {
        String model = dotenv.get("GROQ_MODEL_NAME");
        return (model != null && !model.isBlank()) ? model : "llama-3.3-70b-versatile";
    }
}
