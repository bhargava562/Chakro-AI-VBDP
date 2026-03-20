package com.chakro.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Validated request DTO for submitting a new tender opportunity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpportunityRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 500, message = "Title must not exceed 500 characters")
    private String title;

    private String description;

    @Size(max = 2048, message = "Source URL must not exceed 2048 characters")
    private String sourceUrl;

    private String documentContent;
}
