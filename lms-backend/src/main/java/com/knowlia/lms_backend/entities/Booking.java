package com.knowlia.lms_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false, of = "id")
public class Booking extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_number", nullable = false, unique = true, length = 50)
    private String bookingNumber; // e.g. BK-202609-0001

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lead_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Lead lead;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "property_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Property property;

    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @Column(name = "mobile_number", nullable = false, length = 20)
    private String mobileNumber;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @Column(name = "number_of_guests")
    private Integer numberOfGuests;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "advance_paid", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal advancePaid = BigDecimal.ZERO;

    @Column(name = "balance_due", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal balanceDue = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 50)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false, length = 50)
    @Builder.Default
    private BookingStatus bookingStatus = BookingStatus.CONFIRMED;

    @Column(name = "room_numbers", length = 150)
    private String roomNumbers; // e.g. "Room 101, Room 102"

    @Column(name = "id_proof_type", length = 50)
    private String idProofType; // e.g. "Aadhaar Card", "Passport", "Driving License"

    @Column(name = "id_proof_number", length = 100)
    private String idProofNumber; // e.g. "1234-5678-9012"

    @Column(name = "id_document_url", length = 500)
    private String idDocumentUrl;

    @Column(name = "security_deposit", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal securityDeposit = BigDecimal.ZERO;

    @Column(name = "emergency_contact", length = 50)
    private String emergencyContact;

    @Column(name = "special_requests", length = 1000)
    private String specialRequests;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_user_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User createdByUser;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Payment> payments = new ArrayList<>();
}
