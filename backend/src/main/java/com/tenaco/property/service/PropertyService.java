package com.tenaco.property.service;

import com.tenaco.auth.security.UserPrincipal;
import com.tenaco.property.dto.PropertyDto;
import com.tenaco.property.dto.PropertyRequest;
import com.tenaco.property.entity.Property;
import com.tenaco.property.repository.PropertyRepository;
import com.tenaco.user.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<PropertyDto> getProperties() {
        User user = UserPrincipal.getCurrentUser();
        List<Property> properties;

        if (user.getRole() == User.Role.LANDLORD) {
            properties = propertyRepository.findByLandlordId(user.getId());
        } else {
            properties = propertyRepository.findAll();
        }

        return properties.stream().map(PropertyDto::from).collect(Collectors.toList());
    }

    public PropertyDto getProperty(UUID id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return PropertyDto.from(property);
    }

    public PropertyDto createProperty(PropertyRequest request) {
        User user = UserPrincipal.getCurrentUser();

        if (user.getRole() != User.Role.LANDLORD) {
            throw new RuntimeException("Only landlords can create properties");
        }

        Property property = Property.builder()
                .landlord(user)
                .name(request.getName())
                .address(request.getAddress())
                .type(request.getType())
                .units(request.getUnits())
                .build();

        property = propertyRepository.save(property);
        return PropertyDto.from(property);
    }
}
