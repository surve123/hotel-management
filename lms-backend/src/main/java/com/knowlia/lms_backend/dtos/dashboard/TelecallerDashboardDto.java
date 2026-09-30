package com.knowlia.lms_backend.dtos.dashboard;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TelecallerDashboardDto {

    private long myAssignedLeads;
    private long myHotLeads;
    private long callsDueToday;
    private long callsLoggedToday;
    private long myConvertedBookings;
    private double myConversionRate;
}
