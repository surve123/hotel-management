package com.knowlia.lms_backend.services;

import com.knowlia.lms_backend.dtos.booking.*;
import com.knowlia.lms_backend.dtos.common.PageResponse;
import com.knowlia.lms_backend.entities.BookingStatus;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Map;

public interface BookingService {

    PageResponse<BookingResponseDto> getBookings(
            String search,
            Long propertyId,
            BookingStatus status,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    BookingResponseDto createBooking(CreateBookingRequest request, String currentUsername);

    BookingResponseDto getBookingById(Long id);

    BookingResponseDto getBookingByNumber(String bookingNumber);

    BookingResponseDto recordPayment(Long bookingId, RecordPaymentRequest request, String currentUsername);

    BookingResponseDto updateBookingStatus(Long bookingId, BookingStatus status, String currentUsername);

    Map<String, Object> getCustomer360Profile(String query);

    RoomAvailabilityDto getRoomAvailability(Long propertyId, LocalDate checkInDate, LocalDate checkOutDate);
}
