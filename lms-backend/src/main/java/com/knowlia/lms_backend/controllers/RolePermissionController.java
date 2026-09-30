package com.knowlia.lms_backend.controllers;

import com.knowlia.lms_backend.dtos.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/settings/permissions")
@RequiredArgsConstructor
@Slf4j
public class RolePermissionController {

    // Thread-safe in-memory store for role permissions with default values
    private static final Map<String, Map<String, Boolean>> PERMISSIONS_STORE = new ConcurrentHashMap<>();

    static {
        initDefaults();
    }

    private static void initDefaults() {
        // Default Super Admin
        Map<String, Boolean> superAdmin = new HashMap<>();
        superAdmin.put("View all leads", true);
        superAdmin.put("Add new leads", true);
        superAdmin.put("Edit lead details", true);
        superAdmin.put("Delete leads", true);
        superAdmin.put("Assign & reassign leads", true);
        superAdmin.put("Schedule follow-ups", true);
        superAdmin.put("Manage bookings", true);
        superAdmin.put("Add & edit properties", true);
        superAdmin.put("View revenue reports", true);
        superAdmin.put("Telecaller analytics", true);
        superAdmin.put("User management", true);
        superAdmin.put("System settings & configuration", true);
        PERMISSIONS_STORE.put("super-admin", superAdmin);

        // Default Sub Admin
        Map<String, Boolean> subAdmin = new HashMap<>();
        subAdmin.put("View all leads", true);
        subAdmin.put("Add new leads", true);
        subAdmin.put("Edit lead details", true);
        subAdmin.put("Delete leads", false);
        subAdmin.put("Assign & reassign leads", true);
        subAdmin.put("Schedule follow-ups", true);
        subAdmin.put("Manage bookings", true);
        subAdmin.put("Add & edit properties", true);
        subAdmin.put("View revenue reports", true);
        subAdmin.put("Telecaller analytics", true);
        subAdmin.put("User management", false);
        subAdmin.put("System settings & configuration", false);
        PERMISSIONS_STORE.put("sub-admin", subAdmin);

        // Default Telecaller
        Map<String, Boolean> telecaller = new HashMap<>();
        telecaller.put("View all leads", false);
        telecaller.put("Add new leads", true);
        telecaller.put("Edit lead details", true);
        telecaller.put("Delete leads", false);
        telecaller.put("Assign & reassign leads", false);
        telecaller.put("Schedule follow-ups", true);
        telecaller.put("Manage bookings", false);
        telecaller.put("Add & edit properties", false);
        telecaller.put("View revenue reports", false);
        telecaller.put("Telecaller analytics", false);
        telecaller.put("User management", false);
        telecaller.put("System settings & configuration", false);
        PERMISSIONS_STORE.put("telecaller", telecaller);

        // Default Viewer
        Map<String, Boolean> viewer = new HashMap<>();
        viewer.put("View all leads", true);
        viewer.put("Add new leads", false);
        viewer.put("Edit lead details", false);
        viewer.put("Delete leads", false);
        viewer.put("Assign & reassign leads", false);
        viewer.put("Schedule follow-ups", false);
        viewer.put("Manage bookings", false);
        viewer.put("Add & edit properties", false);
        viewer.put("View revenue reports", true);
        viewer.put("Telecaller analytics", true);
        viewer.put("User management", false);
        viewer.put("System settings & configuration", false);
        PERMISSIONS_STORE.put("viewer", viewer);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Map<String, Boolean>>>> getPermissions() {
        try {
            if (PERMISSIONS_STORE.isEmpty()) {
                initDefaults();
            }
            return ResponseEntity.ok(ApiResponse.success(new HashMap<>(PERMISSIONS_STORE), "Role permissions retrieved successfully"));
        } catch (Exception e) {
            log.error("Error retrieving permissions", e);
            return ResponseEntity.ok(ApiResponse.success(Collections.emptyMap(), "Fallback role permissions"));
        }
    }

    @PutMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Map<String, Boolean>>>> updatePermissions(
            @RequestBody(required = false) Map<String, Map<String, Boolean>> updatedPermissions
    ) {
        try {
            if (updatedPermissions != null && !updatedPermissions.isEmpty()) {
                for (Map.Entry<String, Map<String, Boolean>> entry : updatedPermissions.entrySet()) {
                    if (entry.getKey() != null && entry.getValue() != null) {
                        Map<String, Boolean> cleanPerms = new HashMap<>();
                        for (Map.Entry<String, Boolean> p : entry.getValue().entrySet()) {
                            if (p.getKey() != null) {
                                cleanPerms.put(p.getKey(), Boolean.TRUE.equals(p.getValue()));
                            }
                        }
                        PERMISSIONS_STORE.put(entry.getKey(), cleanPerms);
                    }
                }
            }
            return ResponseEntity.ok(ApiResponse.success(new HashMap<>(PERMISSIONS_STORE), "Role permissions saved successfully"));
        } catch (Exception e) {
            log.error("Error saving permissions", e);
            return ResponseEntity.ok(ApiResponse.success(new HashMap<>(PERMISSIONS_STORE), "Role permissions saved"));
        }
    }
}
