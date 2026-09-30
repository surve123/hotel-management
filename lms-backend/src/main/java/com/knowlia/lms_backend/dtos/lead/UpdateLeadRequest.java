package com.knowlia.lms_backend.dtos.lead;

import com.knowlia.lms_backend.entities.LeadPriority;
import com.knowlia.lms_backend.entities.LeadSource;
import com.knowlia.lms_backend.entities.LeadStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateLeadRequest {

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
    private Long assignedToUserId;
}
