package com.knowlia.lms_backend.dtos.followup;

import com.knowlia.lms_backend.entities.LeadPriority;
import com.knowlia.lms_backend.entities.LeadStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowupItemDto {
    private Long leadId;
    private String customerName;
    private String mobileNumber;
    private String propertyName;
    private LeadStatus leadStatus;
    private LeadPriority priority;
    private LocalDateTime scheduledTime;
    private String remarks;
    private Long assignedToId;
    private String assignedToName;
}
