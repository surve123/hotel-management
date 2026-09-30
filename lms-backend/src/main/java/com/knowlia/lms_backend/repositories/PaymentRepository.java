package com.knowlia.lms_backend.repositories;

import com.knowlia.lms_backend.entities.Booking;
import com.knowlia.lms_backend.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBookingOrderByPaymentDateDesc(Booking booking);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentDate >= :start AND p.paymentDate <= :end")
    BigDecimal getTotalCollectedBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT p FROM Payment p WHERE p.paymentDate >= :start AND p.paymentDate <= :end ORDER BY p.paymentDate DESC")
    List<Payment> findPaymentsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
