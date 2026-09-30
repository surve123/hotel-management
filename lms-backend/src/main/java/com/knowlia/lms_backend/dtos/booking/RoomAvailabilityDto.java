package com.knowlia.lms_backend.dtos.booking;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomAvailabilityDto {
    private Long propertyId;
    private String propertyName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private List<RoomStatusDto> rooms;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoomStatusDto {
        private String roomNumber;
        private String roomType;

        @JsonProperty("isAvailable")
        private boolean isAvailable;

        private String bookedByCustomer;
        private String bookingNumber;
    }
}
