package com.tenaco.issue.dto;

import com.tenaco.issue.entity.Issue;
import com.tenaco.issue.entity.IssueImage;
import com.tenaco.property.dto.PropertyDto;
import com.tenaco.user.dto.UserDto;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class IssueDto {
    private UUID id;
    private UUID propertyId;
    private UUID tenantId;
    private String title;
    private String description;
    private String status;
    private String priority;
    private List<String> images;
    private LocalDateTime createdAt;
    private PropertyDto property;
    private UserDto tenant;

    public IssueDto() {}

    public IssueDto(UUID id, UUID propertyId, UUID tenantId, String title, String description,
                    String status, String priority, List<String> images, LocalDateTime createdAt,
                    PropertyDto property, UserDto tenant) {
        this.id = id;
        this.propertyId = propertyId;
        this.tenantId = tenantId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.images = images;
        this.createdAt = createdAt;
        this.property = property;
        this.tenant = tenant;
    }

    public static IssueDto from(Issue issue) {
        return new IssueDto(
            issue.getId(),
            issue.getProperty().getId(),
            issue.getTenant().getId(),
            issue.getTitle(),
            issue.getDescription(),
            issue.getStatus().name().toLowerCase(),
            issue.getPriority().name().toLowerCase(),
            issue.getImages().stream().map(IssueImage::getImageUrl).collect(Collectors.toList()),
            issue.getCreatedAt(),
            PropertyDto.from(issue.getProperty()),
            UserDto.from(issue.getTenant())
        );
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getPropertyId() { return propertyId; }
    public void setPropertyId(UUID propertyId) { this.propertyId = propertyId; }
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public PropertyDto getProperty() { return property; }
    public void setProperty(PropertyDto property) { this.property = property; }
    public UserDto getTenant() { return tenant; }
    public void setTenant(UserDto tenant) { this.tenant = tenant; }
}
