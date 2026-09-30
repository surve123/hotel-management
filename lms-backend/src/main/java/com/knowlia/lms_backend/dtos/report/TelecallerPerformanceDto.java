package com.knowlia.lms_backend.dtos.report;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TelecallerPerformanceDto {
    private Long userId;
    private String fullName;
    private String username;
    private long totalAssigned;
    private long callsLogged;
    private long followupsCount;
    private long bookingsClosed;
    private double conversionRate;
    private BigDecimal revenueGenerated;
}
