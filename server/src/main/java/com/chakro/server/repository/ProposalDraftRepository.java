package com.chakro.server.repository;

import com.chakro.server.domain.ProposalDraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProposalDraftRepository extends JpaRepository<ProposalDraft, UUID> {

    Optional<ProposalDraft> findTopByOpportunityIdOrderByVersionDesc(UUID opportunityId);

    Optional<ProposalDraft> findByDownloadToken(String downloadToken);
}
