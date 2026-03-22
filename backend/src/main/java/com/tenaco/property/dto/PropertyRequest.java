package com.tenaco.property.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class PropertyRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String address;

    @NotBlank
    private String type;

    @Min(1)
    private int units;

    public PropertyRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getUnits() { return units; }
    public void setUnits(int units) { this.units = units; }
}
