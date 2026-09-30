package com.knowlia.lms_backend.services;

import com.knowlia.lms_backend.dtos.dashboard.*;

import java.util.List;

public interface DashboardService {

    AdminDashboardDto getAdminMetrics();

    List<TrendDataPointDto> getAdminTrends(int days);

    List<SourceDistributionDto> getSourceDistribution();

    List<PropertyPerformanceDto> getPropertyPerformance();

    TelecallerDashboardDto getTelecallerDashboard(String currentUsername);
}
