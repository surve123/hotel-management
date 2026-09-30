package com.knowlia.lms_backend.dtos.report;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadSourceReportDto {
    private String source;
    private long totalLeads;
    private long convertedLeads;
    private double conversionRate;
    private BigDecimal totalRevenueGenerated;
}
