package com.knowlia.lms_backend.services.impl;

import com.knowlia.lms_backend.dtos.dashboard.*;
import com.knowlia.lms_backend.entities.*;
import com.knowlia.lms_backend.repositories.*;
import com.knowlia.lms_backend.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final LeadRepository leadRepository;
    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final CallLogRepository callLogRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardDto getAdminMetrics() {
        long totalLeads = leadRepository.count();
        long newLeads = leadRepository.countByStatus(LeadStatus.NEW);
        long hotLeads = leadRepository.countByStatus(LeadStatus.HOT);
        long inFollowupLeads = leadRepository.countByStatus(LeadStatus.FOLLOW_UP);
        long totalBookings = bookingRepository.countByBookingStatus(BookingStatus.CONFIRMED)
                + bookingRepository.countByBookingStatus(BookingStatus.CHECKED_IN)
                + bookingRepository.countByBookingStatus(BookingStatus.CHECKED_OUT);

        BigDecimal totalRevenue = bookingRepository.getTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        BigDecimal advanceCollected = bookingRepository.getTotalCollected();
        if (advanceCollected == null) advanceCollected = BigDecimal.ZERO;

        BigDecimal pendingBalance = bookingRepository.getTotalPendingBalance();
        if (pendingBalance == null) pendingBalance = BigDecimal.ZERO;

        double conversionRate = totalLeads > 0 ? ((double) totalBookings / totalLeads) * 100 : 0.0;
        conversionRate = BigDecimal.valueOf(conversionRate).setScale(1, RoundingMode.HALF_UP).doubleValue();

        return AdminDashboardDto.builder()
                .totalLeads(totalLeads)
                .newLeads(newLeads)
                .hotLeads(hotLeads)
                .inFollowupLeads(inFollowupLeads)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .advanceCollected(advanceCollected)
                .pendingBalance(pendingBalance)
                .conversionRate(conversionRate)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrendDataPointDto> getAdminTrends(int days) {
        int rangeDays = days > 0 ? days : 30;
        LocalDate startDate = LocalDate.now().minusDays(rangeDays - 1);
        List<TrendDataPointDto> points = new ArrayList<>();

        for (int i = 0; i < rangeDays; i++) {
            LocalDate date = startDate.plusDays(i);
            String formattedDate = date.format(DateTimeFormatter.ofPattern("dd MMM"));

            // Get count of bookings for that date
            List<Booking> bookings = bookingRepository.findBookingsBetween(date, date);
            BigDecimal dayRevenue = bookings.stream()
                    .filter(b -> b.getBookingStatus() != BookingStatus.CANCELLED)
                    .map(Booking::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            points.add(TrendDataPointDto.builder()
                    .date(formattedDate)
                    .leadsCount(0) // Can be populated via query
                    .bookingsCount(bookings.size())
                    .revenue(dayRevenue)
                    .build());
        }

        return points;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SourceDistributionDto> getSourceDistribution() {
        List<Object[]> results = leadRepository.countLeadsBySource();
        long total = leadRepository.count();
        List<SourceDistributionDto> list = new ArrayList<>();

        for (Object[] row : results) {
            LeadSource source = (LeadSource) row[0];
            Long count = (Long) row[1];
            double pct = total > 0 ? ((double) count / total) * 100 : 0.0;
            pct = BigDecimal.valueOf(pct).setScale(1, RoundingMode.HALF_UP).doubleValue();

            list.add(SourceDistributionDto.builder()
                    .source(source != null ? source.name() : "OTHER")
                    .count(count)
                    .percentage(pct)
                    .build());
        }

        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyPerformanceDto> getPropertyPerformance() {
        List<Property> properties = propertyRepository.findByActiveTrue();
        List<PropertyPerformanceDto> list = new ArrayList<>();

        for (Property p : properties) {
            List<Booking> bookings = bookingRepository.findByProperty(p);
            long totalBookings = bookings.stream()
                    .filter(b -> b.getBookingStatus() != BookingStatus.CANCELLED)
                    .count();
            BigDecimal rev = bookings.stream()
                    .filter(b -> b.getBookingStatus() != BookingStatus.CANCELLED && b.getTotalAmount() != null)
                    .map(Booking::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            long totalInquiries = leadRepository.findAll().stream()
                    .filter(l -> l.getProperty() != null && l.getProperty().getId().equals(p.getId()))
                    .count();

            double conversion = totalInquiries > 0 
                    ? ((double) totalBookings / totalInquiries) * 100 
                    : (totalBookings > 0 ? 100.0 : 0.0);
            conversion = BigDecimal.valueOf(conversion).setScale(1, RoundingMode.HALF_UP).doubleValue();

            list.add(PropertyPerformanceDto.builder()
                    .propertyId(p.getId())
                    .propertyName(p.getName())
                    .totalBookings(totalBookings)
                    .totalRevenue(rev)
                    .totalInquiries(totalInquiries)
                    .conversionRate(conversion)
                    .build());
        }

        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public TelecallerDashboardDto getTelecallerDashboard(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername).orElse(null);
        if (user == null) {
            return TelecallerDashboardDto.builder().build();
        }

        long assignedLeads = leadRepository.countByAssignedToAndActiveTrue(user);
        long hotLeads = leadRepository.countByAssignedToAndStatus(user, LeadStatus.HOT);

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);

        List<Lead> dueToday = leadRepository.findFollowupsBetweenForUser(user, startOfToday, endOfToday);
        long callsLoggedToday = callLogRepository.countCallsBetweenForCaller(user, startOfToday, endOfToday);
        long bookingsClosed = leadRepository.countByAssignedToAndStatus(user, LeadStatus.BOOKED);

        double conversion = assignedLeads > 0 ? ((double) bookingsClosed / assignedLeads) * 100 : 0.0;
        conversion = BigDecimal.valueOf(conversion).setScale(1, RoundingMode.HALF_UP).doubleValue();

        return TelecallerDashboardDto.builder()
                .myAssignedLeads(assignedLeads)
                .myHotLeads(hotLeads)
                .callsDueToday(dueToday.size())
                .callsLoggedToday(callsLoggedToday)
                .myConvertedBookings(bookingsClosed)
                .myConversionRate(conversion)
                .build();
    }
}
