package com.chakro.server.vbdp.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marker annotation for an agent system prompt.
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface SystemMessage {

    /**
     * The message text provided to the agent as the system prompt.
     */
    String value();
}
