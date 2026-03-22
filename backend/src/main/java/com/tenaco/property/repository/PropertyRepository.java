package com.tenaco.property.repository;

import com.tenaco.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PropertyRepository extends JpaRepository<Property, UUID> {
    List<Property> findByLandlordId(UUID landlordId);
    long countByLandlordId(UUID landlordId);
}
