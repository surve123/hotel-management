package com.knowlia.lms_backend.dtos.lead;

import com.knowlia.lms_backend.entities.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadResponseDto {

    private Long id;
    private String customerName;
    private String mobileNumber;
    private String email;
    private String city;
    private Integer numberOfGuests;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LeadSource source;
    private LeadStatus status;
    private LeadPriority priority;
    private BigDecimal budget;
    private String remarks;
    private LocalDateTime nextFollowupDate;
    private Long propertyId;
    private String propertyName;
    private Long assignedToId;
    private String assignedToName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CallLogDto> callLogs;
    private List<LeadActivityDto> activities;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CallLogDto {
        private Long id;
        private Long callerId;
        private String callerName;
        private LocalDateTime callDate;
        private Integer durationMinutes;
        private CallOutcome outcome;
        private String remarks;
        private LocalDateTime nextFollowupDate;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LeadActivityDto {
        private Long id;
        private Long userId;
        private String userName;
        private ActivityType activityType;
        private String description;
        private LocalDateTime activityTime;
    }
}
