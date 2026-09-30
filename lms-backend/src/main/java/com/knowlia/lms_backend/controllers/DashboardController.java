package com.knowlia.lms_backend.controllers;

import com.knowlia.lms_backend.dtos.common.ApiResponse;
import com.knowlia.lms_backend.dtos.dashboard.*;
import com.knowlia.lms_backend.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin/metrics")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getAdminMetrics() {
        AdminDashboardDto metrics = dashboardService.getAdminMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Admin metrics retrieved successfully"));
    }

    @GetMapping("/admin/trends")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<TrendDataPointDto>>> getAdminTrends(
            @RequestParam(defaultValue = "30") int days
    ) {
        List<TrendDataPointDto> trends = dashboardService.getAdminTrends(days);
        return ResponseEntity.ok(ApiResponse.success(trends, "Trends data retrieved successfully"));
    }

    @GetMapping("/admin/source-distribution")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<SourceDistributionDto>>> getSourceDistribution() {
        List<SourceDistributionDto> distribution = dashboardService.getSourceDistribution();
        return ResponseEntity.ok(ApiResponse.success(distribution, "Source distribution retrieved successfully"));
    }

    @GetMapping("/admin/property-performance")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<PropertyPerformanceDto>>> getPropertyPerformance() {
        List<PropertyPerformanceDto> performance = dashboardService.getPropertyPerformance();
        return ResponseEntity.ok(ApiResponse.success(performance, "Property performance retrieved successfully"));
    }

    @GetMapping("/telecaller")
    public ResponseEntity<ApiResponse<TelecallerDashboardDto>> getTelecallerDashboard(Authentication authentication) {
        TelecallerDashboardDto stats = dashboardService.getTelecallerDashboard(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(stats, "Telecaller dashboard retrieved successfully"));
    }
}
