package com.knowlia.lms_backend.controllers;

import com.knowlia.lms_backend.dtos.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> checkHealth() {
        Map<String, String> healthStatus = Map.of(
                "status", "UP",
                "service", "Aranavee LMS Backend",
                "version", "1.0.0"
        );
        return ResponseEntity.ok(ApiResponse.success(healthStatus, "Service is healthy and operational"));
    }
}
