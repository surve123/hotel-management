package com.knowlia.lms_backend.dtos.dashboard;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardDto {

    private long totalLeads;
    private long newLeads;
    private long hotLeads;
    private long inFollowupLeads;
    private long totalBookings;
    private BigDecimal totalRevenue;
    private BigDecimal advanceCollected;
    private BigDecimal pendingBalance;
    private double conversionRate;
}
