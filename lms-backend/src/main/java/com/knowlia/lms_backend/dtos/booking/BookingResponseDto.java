package com.knowlia.lms_backend.dtos.booking;

import com.knowlia.lms_backend.entities.BookingStatus;
import com.knowlia.lms_backend.entities.PaymentMode;
import com.knowlia.lms_backend.entities.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDto {

    private Long id;
    private String bookingNumber;
    private Long leadId;
    private Long propertyId;
    private String propertyName;
    private String customerName;
    private String mobileNumber;
    private String email;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfGuests;
    private BigDecimal totalAmount;
    private BigDecimal advancePaid;
    private BigDecimal balanceDue;
    private PaymentStatus paymentStatus;
    private BookingStatus bookingStatus;
    private String roomNumbers;
    private String idProofType;
    private String idProofNumber;
    private String idDocumentUrl;
    private BigDecimal securityDeposit;
    private String emergencyContact;
    private String specialRequests;
    private String createdByName;
    private LocalDateTime createdAt;
    private List<PaymentItemDto> payments;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentItemDto {
        private Long id;
        private BigDecimal amount;
        private PaymentMode paymentMode;
        private String transactionReference;
        private LocalDateTime paymentDate;
        private String remarks;
        private String collectedByName;
    }
}
