package com.knowlia.lms_backend.dtos.followup;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowupCalendarEventDto {
    private String id;
    private String title;
    private LocalDateTime start;
    private LocalDateTime end;
    private String customerName;
    private String mobileNumber;
    private String status;
    private String priority;
    private String propertyName;
    private String assignedToName;
}
