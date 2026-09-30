package com.knowlia.lms_backend.dtos.booking;

import com.knowlia.lms_backend.entities.PaymentMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookingRequest {

    private Long leadId;

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    private String email;

    @NotNull(message = "Check-in date is required")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    private LocalDate checkOutDate;

    private Integer numberOfGuests;

    @NotNull(message = "Total amount is required")
    private BigDecimal totalAmount;

    private String roomNumbers;
    private String idProofType;
    private String idProofNumber;
    private String idDocumentUrl;
    private BigDecimal securityDeposit;
    private String emergencyContact;

    private BigDecimal advancePaid;
    private PaymentMode paymentMode;
    private String transactionReference;
    private String specialRequests;
}
