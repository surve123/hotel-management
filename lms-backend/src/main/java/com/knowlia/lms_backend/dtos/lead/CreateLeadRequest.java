package com.knowlia.lms_backend.dtos.lead;

import com.knowlia.lms_backend.entities.LeadPriority;
import com.knowlia.lms_backend.entities.LeadSource;
import com.knowlia.lms_backend.entities.LeadStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateLeadRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    private String email;
    private String city;
    private Integer numberOfGuests;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    @NotNull(message = "Lead source is required")
    private LeadSource source;

    private LeadStatus status;
    private LeadPriority priority;
    private BigDecimal budget;
    private String remarks;
    private LocalDateTime nextFollowupDate;
    private Long propertyId;
    private Long assignedToUserId;
}
