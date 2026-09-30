package com.knowlia.lms_backend.repositories;

import com.knowlia.lms_backend.entities.Booking;
import com.knowlia.lms_backend.entities.BookingStatus;
import com.knowlia.lms_backend.entities.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    Optional<Booking> findByBookingNumber(String bookingNumber);

    boolean existsByBookingNumber(String bookingNumber);

    List<Booking> findByProperty(Property property);

    long countByBookingStatus(BookingStatus status);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.bookingStatus != com.knowlia.lms_backend.entities.BookingStatus.CANCELLED")
    BigDecimal getTotalRevenue();

    @Query("SELECT SUM(b.advancePaid) FROM Booking b WHERE b.bookingStatus != com.knowlia.lms_backend.entities.BookingStatus.CANCELLED")
    BigDecimal getTotalCollected();

    @Query("SELECT SUM(b.balanceDue) FROM Booking b WHERE b.bookingStatus != com.knowlia.lms_backend.entities.BookingStatus.CANCELLED")
    BigDecimal getTotalPendingBalance();

    @Query("SELECT b FROM Booking b WHERE b.customerName LIKE %:query% OR b.mobileNumber LIKE %:query% OR b.email LIKE %:query%")
    List<Booking> searchByCustomer(@Param("query") String query);

    @Query("SELECT b.property.id, b.property.name, COUNT(b), SUM(b.totalAmount) FROM Booking b WHERE b.bookingStatus != com.knowlia.lms_backend.entities.BookingStatus.CANCELLED GROUP BY b.property.id, b.property.name")
    List<Object[]> getPropertyPerformanceStats();

    @Query("SELECT b FROM Booking b WHERE b.checkInDate >= :start AND b.checkInDate <= :end")
    List<Booking> findBookingsBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT b FROM Booking b WHERE b.property.id = :propertyId AND b.bookingStatus != com.knowlia.lms_backend.entities.BookingStatus.CANCELLED AND b.checkInDate < :checkOut AND b.checkOutDate > :checkIn")
    List<Booking> findOverlappingBookings(
            @Param("propertyId") Long propertyId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );
}
