package com.knowlia.lms_backend.dtos.dashboard;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SourceDistributionDto {
    private String source;
    private long count;
    private double percentage;
}
