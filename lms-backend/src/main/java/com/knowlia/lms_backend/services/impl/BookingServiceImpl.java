package com.knowlia.lms_backend.services.impl;

import com.knowlia.lms_backend.dtos.booking.*;
import com.knowlia.lms_backend.dtos.common.PageResponse;
import com.knowlia.lms_backend.entities.*;
import com.knowlia.lms_backend.exceptions.BadRequestException;
import com.knowlia.lms_backend.exceptions.ResourceNotFoundException;
import com.knowlia.lms_backend.repositories.*;
import com.knowlia.lms_backend.services.BookingService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final LeadActivityRepository leadActivityRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BookingResponseDto> getBookings(
            String search,
            Long propertyId,
            BookingStatus status,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    ) {
        Specification<Booking> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate numP = cb.like(cb.lower(root.get("bookingNumber")), pattern);
                Predicate nameP = cb.like(cb.lower(root.get("customerName")), pattern);
                Predicate phoneP = cb.like(root.get("mobileNumber"), pattern);
                predicates.add(cb.or(numP, nameP, phoneP));
            }

            if (propertyId != null) {
                predicates.add(cb.equal(root.get("property").get("id"), propertyId));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("bookingStatus"), status));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("checkInDate"), startDate));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("checkOutDate"), endDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Booking> page = bookingRepository.findAll(spec, pageable);
        List<BookingResponseDto> content = page.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return PageResponse.<BookingResponseDto>builder()
                .content(content)
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isLast(page.isLast())
                .build();
    }

    @Override
    @Transactional
    public BookingResponseDto createBooking(CreateBookingRequest request, String currentUsername) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + request.getPropertyId()));
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);

        Lead lead = null;
        if (request.getLeadId() != null) {
            lead = leadRepository.findById(request.getLeadId()).orElse(null);
        }

        if (request.getCheckOutDate().isBefore(request.getCheckInDate()) || request.getCheckOutDate().isEqual(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        // Room collision check
        if (request.getRoomNumbers() != null && !request.getRoomNumbers().trim().isEmpty()) {
            List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                    request.getPropertyId(),
                    request.getCheckInDate(),
                    request.getCheckOutDate()
            );

            List<String> requestedRooms = Arrays.stream(request.getRoomNumbers().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());

            for (Booking b : overlapping) {
                if (b.getRoomNumbers() == null || b.getRoomNumbers().trim().isEmpty() || "Entire Villa".equalsIgnoreCase(b.getRoomNumbers().trim())) {
                    throw new BadRequestException(String.format(
                            "Property is already fully booked for these dates (Booking: %s by %s)",
                            b.getBookingNumber(), b.getCustomerName()
                    ));
                }
                List<String> bookedRooms = Arrays.stream(b.getRoomNumbers().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList());

                for (String reqRoom : requestedRooms) {
                    if (bookedRooms.stream().anyMatch(br -> br.equalsIgnoreCase(reqRoom))) {
                        throw new BadRequestException(String.format(
                                "Room conflict: %s is already booked for these dates (Booking: %s by %s)",
                                reqRoom, b.getBookingNumber(), b.getCustomerName()
                        ));
                    }
                }
            }
        }

        BigDecimal advance = request.getAdvancePaid() != null ? request.getAdvancePaid() : BigDecimal.ZERO;
        BigDecimal balance = request.getTotalAmount().subtract(advance);
        if (balance.compareTo(BigDecimal.ZERO) < 0) {
            balance = BigDecimal.ZERO;
        }

        PaymentStatus payStatus = PaymentStatus.PENDING;
        if (advance.compareTo(BigDecimal.ZERO) > 0) {
            payStatus = (advance.compareTo(request.getTotalAmount()) >= 0) ? PaymentStatus.PAID : PaymentStatus.PARTIAL;
        }

        String bookingNumber = generateBookingNumber();

        Booking booking = Booking.builder()
                .bookingNumber(bookingNumber)
                .lead(lead)
                .property(property)
                .customerName(request.getCustomerName())
                .mobileNumber(request.getMobileNumber())
                .email(request.getEmail())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfGuests(request.getNumberOfGuests())
                .totalAmount(request.getTotalAmount())
                .advancePaid(advance)
                .balanceDue(balance)
                .paymentStatus(payStatus)
                .bookingStatus(BookingStatus.CONFIRMED)
                .roomNumbers(request.getRoomNumbers())
                .idProofType(request.getIdProofType())
                .idProofNumber(request.getIdProofNumber())
                .idDocumentUrl(request.getIdDocumentUrl())
                .securityDeposit(request.getSecurityDeposit() != null ? request.getSecurityDeposit() : BigDecimal.ZERO)
                .emergencyContact(request.getEmergencyContact())
                .specialRequests(request.getSpecialRequests())
                .createdByUser(currentUser)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        if (advance.compareTo(BigDecimal.ZERO) > 0 && request.getPaymentMode() != null) {
            Payment payment = Payment.builder()
                    .booking(savedBooking)
                    .amount(advance)
                    .paymentMode(request.getPaymentMode())
                    .transactionReference(request.getTransactionReference())
                    .paymentDate(LocalDateTime.now())
                    .remarks("Initial advance payment")
                    .collectedBy(currentUser)
                    .build();
            paymentRepository.save(payment);
        }

        if (lead != null) {
            lead.setStatus(LeadStatus.BOOKED);
            leadRepository.save(lead);

            leadActivityRepository.save(LeadActivity.builder()
                    .lead(lead)
                    .performedBy(currentUser)
                    .activityType(ActivityType.BOOKING_CREATED)
                    .description("Converted to confirmed booking: " + bookingNumber)
                    .build());
        }

        return getBookingById(savedBooking.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public RoomAvailabilityDto getRoomAvailability(Long propertyId, LocalDate checkInDate, LocalDate checkOutDate) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        int roomCount = (property.getTotalRooms() != null && property.getTotalRooms() > 0) ? property.getTotalRooms() : 4;

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(propertyId, checkInDate, checkOutDate);

        // Predefined standard room types for luxury villas
        String[] roomTypes = {
                "Master King Suite", "Deluxe Pool View Suite", "Premium Balcony Bedroom",
                "Garden View Suite", "Executive King Room", "Family Penthouse Suite"
        };

        List<RoomAvailabilityDto.RoomStatusDto> rooms = new ArrayList<>();
        for (int i = 1; i <= roomCount; i++) {
            String roomNum = "Room " + (100 + i);
            String roomType = (i - 1 < roomTypes.length) ? roomTypes[i - 1] : "Standard Luxury Room";

            boolean isAvail = true;
            String bookedBy = null;
            String bNum = null;

            for (Booking b : overlapping) {
                String bRooms = b.getRoomNumbers();
                if (bRooms == null || bRooms.trim().isEmpty() || "Entire Villa".equalsIgnoreCase(bRooms.trim())) {
                    isAvail = false;
                    bookedBy = b.getCustomerName();
                    bNum = b.getBookingNumber();
                    break;
                } else {
                    List<String> rList = Arrays.stream(bRooms.split(","))
                            .map(String::trim)
                            .collect(Collectors.toList());
                    if (rList.stream().anyMatch(r -> r.equalsIgnoreCase(roomNum))) {
                        isAvail = false;
                        bookedBy = b.getCustomerName();
                        bNum = b.getBookingNumber();
                        break;
                    }
                }
            }

            rooms.add(RoomAvailabilityDto.RoomStatusDto.builder()
                    .roomNumber(roomNum)
                    .roomType(roomType)
                    .isAvailable(isAvail)
                    .bookedByCustomer(bookedBy)
                    .bookingNumber(bNum)
                    .build());
        }

        return RoomAvailabilityDto.builder()
                .propertyId(property.getId())
                .propertyName(property.getName())
                .checkInDate(checkInDate)
                .checkOutDate(checkOutDate)
                .rooms(rooms)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDto getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return mapToDto(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDto getBookingByNumber(String bookingNumber) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with number: " + bookingNumber));
        return mapToDto(booking);
    }

    @Override
    @Transactional
    public BookingResponseDto recordPayment(Long bookingId, RecordPaymentRequest request, String currentUsername) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(request.getAmount())
                .paymentMode(request.getPaymentMode())
                .transactionReference(request.getTransactionReference())
                .paymentDate(LocalDateTime.now())
                .remarks(request.getRemarks())
                .collectedBy(currentUser)
                .build();

        paymentRepository.save(payment);

        BigDecimal newAdvance = booking.getAdvancePaid().add(request.getAmount());
        BigDecimal newBalance = booking.getTotalAmount().subtract(newAdvance);
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            newBalance = BigDecimal.ZERO;
        }

        booking.setAdvancePaid(newAdvance);
        booking.setBalanceDue(newBalance);

        if (newAdvance.compareTo(booking.getTotalAmount()) >= 0) {
            booking.setPaymentStatus(PaymentStatus.PAID);
        } else if (newAdvance.compareTo(BigDecimal.ZERO) > 0) {
            booking.setPaymentStatus(PaymentStatus.PARTIAL);
        }

        bookingRepository.save(booking);

        return getBookingById(booking.getId());
    }

    @Override
    @Transactional
    public BookingResponseDto updateBookingStatus(Long bookingId, BookingStatus status, String currentUsername) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        booking.setBookingStatus(status);
        bookingRepository.save(booking);
        return getBookingById(booking.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getCustomer360Profile(String query) {
        List<Booking> bookings = bookingRepository.searchByCustomer(query);
        List<Lead> leads = leadRepository.findByMobileNumberOrEmail(query, query);

        BigDecimal lifetimeValue = bookings.stream()
                .filter(b -> b.getBookingStatus() != BookingStatus.CANCELLED)
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("query", query);
        response.put("totalStays", bookings.size());
        response.put("lifetimeValue", lifetimeValue);
        response.put("bookings", bookings.stream().map(this::mapToDto).collect(Collectors.toList()));
        response.put("inquiriesCount", leads.size());

        return response;
    }

    private synchronized String generateBookingNumber() {
        String prefix = "BK-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM")) + "-";
        long count = bookingRepository.count() + 1;
        return String.format("%s%04d", prefix, count);
    }

    private BookingResponseDto mapToDto(Booking booking) {
        List<Payment> payments = paymentRepository.findByBookingOrderByPaymentDateDesc(booking);

        return BookingResponseDto.builder()
                .id(booking.getId())
                .bookingNumber(booking.getBookingNumber())
                .leadId(booking.getLead() != null ? booking.getLead().getId() : null)
                .propertyId(booking.getProperty() != null ? booking.getProperty().getId() : null)
                .propertyName(booking.getProperty() != null ? booking.getProperty().getName() : null)
                .customerName(booking.getCustomerName())
                .mobileNumber(booking.getMobileNumber())
                .email(booking.getEmail())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .numberOfGuests(booking.getNumberOfGuests())
                .totalAmount(booking.getTotalAmount())
                .advancePaid(booking.getAdvancePaid())
                .balanceDue(booking.getBalanceDue())
                .paymentStatus(booking.getPaymentStatus())
                .bookingStatus(booking.getBookingStatus())
                .roomNumbers(booking.getRoomNumbers())
                .idProofType(booking.getIdProofType())
                .idProofNumber(booking.getIdProofNumber())
                .idDocumentUrl(booking.getIdDocumentUrl())
                .securityDeposit(booking.getSecurityDeposit())
                .emergencyContact(booking.getEmergencyContact())
                .specialRequests(booking.getSpecialRequests())
                .createdByName(booking.getCreatedByUser() != null ? booking.getCreatedByUser().getFullName() : null)
                .createdAt(booking.getCreatedAt())
                .payments(payments.stream().map(p -> BookingResponseDto.PaymentItemDto.builder()
                        .id(p.getId())
                        .amount(p.getAmount())
                        .paymentMode(p.getPaymentMode())
                        .transactionReference(p.getTransactionReference())
                        .paymentDate(p.getPaymentDate())
                        .remarks(p.getRemarks())
                        .collectedByName(p.getCollectedBy() != null ? p.getCollectedBy().getFullName() : null)
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
