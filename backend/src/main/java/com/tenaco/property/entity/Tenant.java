package com.tenaco.property.entity;

import com.tenaco.user.entity.User;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "tenants")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    public Tenant() {}

    public Tenant(UUID id, User user, Property property) {
        this.id = id;
        this.user = user;
        this.property = property;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public static TenantBuilder builder() { return new TenantBuilder(); }

    public static class TenantBuilder {
        private UUID id;
        private User user;
        private Property property;

        public TenantBuilder id(UUID id) { this.id = id; return this; }
        public TenantBuilder user(User user) { this.user = user; return this; }
        public TenantBuilder property(Property property) { this.property = property; return this; }

        public Tenant build() {
            return new Tenant(id, user, property);
        }
    }
}
