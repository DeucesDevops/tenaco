package com.tenaco.issue.repository;

import com.tenaco.issue.entity.Issue;
import com.tenaco.issue.enums.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface IssueRepository extends JpaRepository<Issue, UUID> {
    List<Issue> findByPropertyId(UUID propertyId);
    List<Issue> findByTenantId(UUID tenantId);
    List<Issue> findByPropertyLandlordIdOrderByCreatedAtDesc(UUID landlordId);
    long countByPropertyLandlordIdAndStatus(UUID landlordId, IssueStatus status);
    long countByTenantIdAndStatus(UUID tenantId, IssueStatus status);
    List<Issue> findByTenantIdOrderByCreatedAtDesc(UUID tenantId);
}
