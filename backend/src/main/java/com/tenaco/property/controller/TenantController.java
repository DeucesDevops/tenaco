package com.tenaco.property.controller;

import com.tenaco.property.dto.TenantAssignRequest;
import com.tenaco.property.service.TenantService;
import com.tenaco.user.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getTenants() {
        List<UserDto> tenants = tenantService.getTenants().stream()
                .map(t -> UserDto.from(t.getUser()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(tenants);
    }

    @PostMapping("/assign")
    public ResponseEntity<Map<String, String>> assignTenant(@Valid @RequestBody TenantAssignRequest request) {
        tenantService.assignTenant(request);
        return ResponseEntity.ok(Map.of("message", "Tenant assigned successfully"));
    }
}
