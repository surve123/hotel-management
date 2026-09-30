package com.knowlia.lms_backend.dtos.followup;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RescheduleFollowupRequest {

    @NotNull(message = "Next follow-up date and time is required")
    private LocalDateTime nextFollowupDate;

    private String remarks;
}
