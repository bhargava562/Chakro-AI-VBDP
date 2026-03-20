package com.chakro.server.vbdp.annotation;

import org.springframework.stereotype.Component;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marker annotation for AI agent components.
 *
 * <p>This annotation is a thin wrapper around {@link Component} and exists to make
 * the agent intent explicit in the codebase.
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Component
public @interface AiService {
}
