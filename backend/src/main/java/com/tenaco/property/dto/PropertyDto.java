package com.tenaco.property.dto;

import com.tenaco.property.entity.Property;
import java.time.LocalDateTime;
import java.util.UUID;

public class PropertyDto {
    private UUID id;
    private UUID landlordId;
    private String name;
    private String address;
    private String type;
    private int units;
    private LocalDateTime createdAt;

    public PropertyDto() {}

    public PropertyDto(UUID id, UUID landlordId, String name, String address, String type, int units, LocalDateTime createdAt) {
        this.id = id;
        this.landlordId = landlordId;
        this.name = name;
        this.address = address;
        this.type = type;
        this.units = units;
        this.createdAt = createdAt;
    }

    public static PropertyDto from(Property property) {
        return new PropertyDto(
            property.getId(),
            property.getLandlord().getId(),
            property.getName(),
            property.getAddress(),
            property.getType(),
            property.getUnits(),
            property.getCreatedAt()
        );
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getLandlordId() { return landlordId; }
    public void setLandlordId(UUID landlordId) { this.landlordId = landlordId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getUnits() { return units; }
    public void setUnits(int units) { this.units = units; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
