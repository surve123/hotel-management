package com.knowlia.lms_backend.dtos.dashboard;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrendDataPointDto {
    private String date;
    private long leadsCount;
    private long bookingsCount;
    private BigDecimal revenue;
}
