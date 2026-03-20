package com.chakro.server.repository;

import com.chakro.server.domain.Opportunity;
import com.chakro.server.domain.OpportunityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, UUID> {

    List<Opportunity> findByStatus(OpportunityStatus status);

    List<Opportunity> findAllByOrderByCreatedAtDesc();
}
