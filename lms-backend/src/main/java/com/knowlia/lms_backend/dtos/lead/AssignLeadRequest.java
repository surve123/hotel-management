package com.knowlia.lms_backend.dtos.lead;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignLeadRequest {

    @NotNull(message = "User ID to assign to is required")
    private Long userId;
}
