package com.chakro.server.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * JPA entity representing a tender/business opportunity in the VBDP pipeline.
 * Maps to the "opportunities" table created by V2__vbdp_schema.sql.
 */
@Entity
@Table(name = "opportunities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "source_url", length = 2048)
    private String sourceUrl;

    @Column(name = "source_document_text", columnDefinition = "TEXT")
    private String sourceDocumentText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OpportunityStatus status;

    @Column(name = "raw_analysis_json", columnDefinition = "TEXT")
    private String rawAnalysisJson;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = OpportunityStatus.INGESTED;
        }
    }
}
