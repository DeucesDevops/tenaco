package com.tenaco.property.service;

import com.tenaco.auth.security.UserPrincipal;
import com.tenaco.property.dto.TenantAssignRequest;
import com.tenaco.property.entity.Property;
import com.tenaco.property.entity.Tenant;
import com.tenaco.property.repository.PropertyRepository;
import com.tenaco.property.repository.TenantRepository;
import com.tenaco.user.entity.User;
import com.tenaco.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public TenantService(TenantRepository tenantRepository, UserRepository userRepository, PropertyRepository propertyRepository) {
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
    }

    public List<Tenant> getTenants() {
        User user = UserPrincipal.getCurrentUser();
        return tenantRepository.findByPropertyLandlordId(user.getId());
    }

    @Transactional
    public Tenant assignTenant(TenantAssignRequest request) {
        User landlord = UserPrincipal.getCurrentUser();

        if (landlord.getRole() != User.Role.LANDLORD) {
            throw new RuntimeException("Only landlords can assign tenants");
        }

        User tenantUser = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (!property.getLandlord().getId().equals(landlord.getId())) {
            throw new RuntimeException("You don't own this property");
        }

        if (tenantRepository.existsByUserIdAndPropertyId(request.getUserId(), request.getPropertyId())) {
            throw new RuntimeException("Tenant already assigned to this property");
        }

        Tenant tenant = Tenant.builder()
                .user(tenantUser)
                .property(property)
                .build();

        return tenantRepository.save(tenant);
    }
}
