package com.knowlia.lms_backend.controllers;

import com.knowlia.lms_backend.dtos.common.ApiResponse;
import com.knowlia.lms_backend.dtos.property.CreatePropertyRequest;
import com.knowlia.lms_backend.dtos.property.PropertyDto;
import com.knowlia.lms_backend.dtos.property.UpdatePropertyRequest;
import com.knowlia.lms_backend.services.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PropertyDto>>> getAllProperties(
            @RequestParam(defaultValue = "false") boolean onlyActive
    ) {
        List<PropertyDto> properties = propertyService.getAllProperties(onlyActive);
        return ResponseEntity.ok(ApiResponse.success(properties, "Properties retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyDto>> getPropertyById(@PathVariable Long id) {
        PropertyDto property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(ApiResponse.success(property, "Property retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<PropertyDto>> createProperty(@Valid @RequestBody CreatePropertyRequest request) {
        PropertyDto created = propertyService.createProperty(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Property created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<PropertyDto>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePropertyRequest request
    ) {
        PropertyDto updated = propertyService.updateProperty(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Property updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Property archived successfully"));
    }
}
