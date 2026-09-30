package com.knowlia.lms_backend.controllers;

import com.knowlia.lms_backend.dtos.booking.*;
import com.knowlia.lms_backend.dtos.common.ApiResponse;
import com.knowlia.lms_backend.dtos.common.PageResponse;
import com.knowlia.lms_backend.entities.BookingStatus;
import com.knowlia.lms_backend.services.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BookingResponseDto>>> getBookings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponse<BookingResponseDto> bookings = bookingService.getBookings(
                search, propertyId, status, startDate, endDate, pageable
        );

        return ResponseEntity.ok(ApiResponse.success(bookings, "Bookings retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponseDto>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            Authentication authentication
    ) {
        BookingResponseDto booking = bookingService.createBooking(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(booking, "Booking created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getBookingById(@PathVariable Long id) {
        BookingResponseDto booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success(booking, "Booking retrieved successfully"));
    }

    @GetMapping("/number/{bookingNumber}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getBookingByNumber(@PathVariable String bookingNumber) {
        BookingResponseDto booking = bookingService.getBookingByNumber(bookingNumber);
        return ResponseEntity.ok(ApiResponse.success(booking, "Booking retrieved successfully"));
    }

    @PatchMapping("/{id}/payment")
    public ResponseEntity<ApiResponse<BookingResponseDto>> recordPayment(
            @PathVariable Long id,
            @Valid @RequestBody RecordPaymentRequest request,
            Authentication authentication
    ) {
        BookingResponseDto updated = bookingService.recordPayment(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(updated, "Payment recorded successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponseDto>> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBookingStatusRequest request,
            Authentication authentication
    ) {
        BookingResponseDto updated = bookingService.updateBookingStatus(id, request.getStatus(), authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(updated, "Booking status updated successfully"));
    }

    @GetMapping("/customers/360")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCustomer360Profile(@RequestParam String query) {
        Map<String, Object> profile = bookingService.getCustomer360Profile(query);
        return ResponseEntity.ok(ApiResponse.success(profile, "Customer 360 profile retrieved successfully"));
    }

    @GetMapping("/room-availability")
    public ResponseEntity<ApiResponse<RoomAvailabilityDto>> getRoomAvailability(
            @RequestParam Long propertyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate
    ) {
        RoomAvailabilityDto availability = bookingService.getRoomAvailability(propertyId, checkInDate, checkOutDate);
        return ResponseEntity.ok(ApiResponse.success(availability, "Room availability retrieved successfully"));
    }
}
