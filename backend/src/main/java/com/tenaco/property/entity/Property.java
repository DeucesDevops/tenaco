package com.tenaco.property.entity;

import com.tenaco.user.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private int units;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Property() {}

    public Property(UUID id, User landlord, String name, String address, String type, int units, LocalDateTime createdAt) {
        this.id = id;
        this.landlord = landlord;
        this.name = name;
        this.address = address;
        this.type = type;
        this.units = units;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getLandlord() { return landlord; }
    public void setLandlord(User landlord) { this.landlord = landlord; }
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

    public static PropertyBuilder builder() { return new PropertyBuilder(); }

    public static class PropertyBuilder {
        private UUID id;
        private User landlord;
        private String name;
        private String address;
        private String type;
        private int units;
        private LocalDateTime createdAt;

        public PropertyBuilder id(UUID id) { this.id = id; return this; }
        public PropertyBuilder landlord(User landlord) { this.landlord = landlord; return this; }
        public PropertyBuilder name(String name) { this.name = name; return this; }
        public PropertyBuilder address(String address) { this.address = address; return this; }
        public PropertyBuilder type(String type) { this.type = type; return this; }
        public PropertyBuilder units(int units) { this.units = units; return this; }
        public PropertyBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Property build() {
            return new Property(id, landlord, name, address, type, units, createdAt);
        }
    }
}
