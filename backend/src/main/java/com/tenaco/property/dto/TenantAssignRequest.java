package com.tenaco.property.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class TenantAssignRequest {
    @NotNull
    private UUID userId;

    @NotNull
    private UUID propertyId;

    public TenantAssignRequest() {}

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getPropertyId() { return propertyId; }
    public void setPropertyId(UUID propertyId) { this.propertyId = propertyId; }
}
