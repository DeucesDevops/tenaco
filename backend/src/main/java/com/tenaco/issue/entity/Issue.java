package com.tenaco.issue.entity;

import com.tenaco.issue.enums.IssuePriority;
import com.tenaco.issue.enums.IssueStatus;
import com.tenaco.property.entity.Property;
import com.tenaco.user.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "issues")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private User tenant;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueStatus status = IssueStatus.OPEN;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssuePriority priority = IssuePriority.MEDIUM;

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IssueImage> images = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Issue() {}

    public Issue(UUID id, Property property, User tenant, String title, String description,
                 IssueStatus status, IssuePriority priority, List<IssueImage> images, LocalDateTime createdAt) {
        this.id = id;
        this.property = property;
        this.tenant = tenant;
        this.title = title;
        this.description = description;
        this.status = status != null ? status : IssueStatus.OPEN;
        this.priority = priority != null ? priority : IssuePriority.MEDIUM;
        this.images = images != null ? images : new ArrayList<>();
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }
    public User getTenant() { return tenant; }
    public void setTenant(User tenant) { this.tenant = tenant; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public IssueStatus getStatus() { return status; }
    public void setStatus(IssueStatus status) { this.status = status; }
    public IssuePriority getPriority() { return priority; }
    public void setPriority(IssuePriority priority) { this.priority = priority; }
    public List<IssueImage> getImages() { return images; }
    public void setImages(List<IssueImage> images) { this.images = images; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static IssueBuilder builder() { return new IssueBuilder(); }

    public static class IssueBuilder {
        private UUID id;
        private Property property;
        private User tenant;
        private String title;
        private String description;
        private IssueStatus status = IssueStatus.OPEN;
        private IssuePriority priority = IssuePriority.MEDIUM;
        private List<IssueImage> images = new ArrayList<>();
        private LocalDateTime createdAt;

        public IssueBuilder id(UUID id) { this.id = id; return this; }
        public IssueBuilder property(Property property) { this.property = property; return this; }
        public IssueBuilder tenant(User tenant) { this.tenant = tenant; return this; }
        public IssueBuilder title(String title) { this.title = title; return this; }
        public IssueBuilder description(String description) { this.description = description; return this; }
        public IssueBuilder status(IssueStatus status) { this.status = status; return this; }
        public IssueBuilder priority(IssuePriority priority) { this.priority = priority; return this; }
        public IssueBuilder images(List<IssueImage> images) { this.images = images; return this; }
        public IssueBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Issue build() {
            return new Issue(id, property, tenant, title, description, status, priority, images, createdAt);
        }
    }
}
