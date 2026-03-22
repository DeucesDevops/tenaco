package com.tenaco.property.repository;

import com.tenaco.property.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    List<Tenant> findByPropertyId(UUID propertyId);
    List<Tenant> findByPropertyLandlordId(UUID landlordId);
    Optional<Tenant> findByUserId(UUID userId);
    long countByPropertyLandlordId(UUID landlordId);
    boolean existsByUserIdAndPropertyId(UUID userId, UUID propertyId);
}
