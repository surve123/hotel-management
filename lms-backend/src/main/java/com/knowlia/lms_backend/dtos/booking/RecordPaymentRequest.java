package com.knowlia.lms_backend.dtos.booking;

import com.knowlia.lms_backend.entities.PaymentMode;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordPaymentRequest {

    @NotNull(message = "Payment amount is required")
    private BigDecimal amount;

    @NotNull(message = "Payment mode is required")
    private PaymentMode paymentMode;

    private String transactionReference;
    private String remarks;
}
