package com.knowlia.lms_backend.dtos.booking;

import com.knowlia.lms_backend.entities.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateBookingStatusRequest {

    @NotNull(message = "Booking status is required")
    private BookingStatus status;
}
