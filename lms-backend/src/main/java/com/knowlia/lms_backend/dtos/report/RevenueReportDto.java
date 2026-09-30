package com.knowlia.lms_backend.dtos.report;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueReportDto {
    private BigDecimal grossRevenue;
    private BigDecimal advanceCollected;
    private BigDecimal pendingBalance;
    private long totalBookings;
    private List<MonthlyBreakdownDto> monthlyBreakdown;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyBreakdownDto {
        private String month;
        private BigDecimal revenue;
        private long bookings;
    }
}
