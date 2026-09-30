package com.knowlia.lms_backend.dtos.lead;

import com.knowlia.lms_backend.entities.CallOutcome;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogCallRequest {

    private Integer durationMinutes;

    @NotNull(message = "Call outcome is required")
    private CallOutcome outcome;

    private String remarks;

    private LocalDateTime nextFollowupDate;
}
