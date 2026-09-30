package com.knowlia.lms_backend.dtos.lead;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddNoteRequest {

    @NotBlank(message = "Note content cannot be empty")
    private String note;
}
