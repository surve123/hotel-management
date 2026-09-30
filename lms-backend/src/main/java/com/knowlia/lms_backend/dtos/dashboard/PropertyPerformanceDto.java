package com.knowlia.lms_backend.dtos.dashboard;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyPerformanceDto {
    private Long propertyId;
    private String propertyName;
    private long totalBookings;
    private BigDecimal totalRevenue;
    private long totalInquiries;
    private double conversionRate;
}
