package com.knowlia.lms_backend.dtos.followup;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowupDashboardDto {
    private long dueToday;
    private long overdue;
    private long upcoming;
    private long completedToday;
    private long highPriority;
}

