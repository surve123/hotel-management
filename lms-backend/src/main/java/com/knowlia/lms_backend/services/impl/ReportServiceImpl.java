package com.knowlia.lms_backend.services.impl;

import com.knowlia.lms_backend.dtos.report.LeadSourceReportDto;
import com.knowlia.lms_backend.dtos.report.RevenueReportDto;
import com.knowlia.lms_backend.dtos.report.TelecallerPerformanceDto;
import com.knowlia.lms_backend.entities.*;
import com.knowlia.lms_backend.repositories.*;
import com.knowlia.lms_backend.services.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportServiceImpl implements ReportService {

    private final LeadRepository leadRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CallLogRepository callLogRepository;

    @Override
    @Transactional(readOnly = true)
    public List<LeadSourceReportDto> getLeadSourceReport() {
        List<LeadSourceReportDto> list = new ArrayList<>();
        List<Lead> allLeads = leadRepository.findAll();

        for (LeadSource source : LeadSource.values()) {
            List<Lead> sourceLeads = allLeads.stream()
                    .filter(l -> l.getSource() == source)
                    .toList();

            long total = sourceLeads.size();
            long converted = sourceLeads.stream()
                    .filter(l -> l.getStatus() == LeadStatus.BOOKED)
                    .count();

            double rate = total > 0 ? ((double) converted / total) * 100 : 0.0;
            rate = BigDecimal.valueOf(rate).setScale(1, RoundingMode.HALF_UP).doubleValue();

            BigDecimal revenue = sourceLeads.stream()
                    .filter(l -> l.getStatus() == LeadStatus.BOOKED && l.getBudget() != null)
                    .map(Lead::getBudget)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            list.add(LeadSourceReportDto.builder()
                    .source(source.name())
                    .totalLeads(total)
                    .convertedLeads(converted)
                    .conversionRate(rate)
                    .totalRevenueGenerated(revenue)
                    .build());
        }
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TelecallerPerformanceDto> getTelecallerPerformanceReport() {
        List<User> telecallers = userRepository.findByRole(Role.ROLE_TELECALLER);
        List<TelecallerPerformanceDto> list = new ArrayList<>();

        for (User caller : telecallers) {
            long assigned = leadRepository.countByAssignedToAndActiveTrue(caller);
            long booked = leadRepository.countByAssignedToAndStatus(caller, LeadStatus.BOOKED);
            long calls = callLogRepository.findByCallerOrderByCallDateDesc(caller).size();
            long followups = leadRepository.countByAssignedToAndStatus(caller, LeadStatus.FOLLOW_UP);
            double conversion = assigned > 0 ? ((double) booked / assigned) * 100 : 0.0;
            conversion = BigDecimal.valueOf(conversion).setScale(1, RoundingMode.HALF_UP).doubleValue();

            BigDecimal revenue = BigDecimal.ZERO;
            List<Lead> assignedLeads = leadRepository.findByAssignedToAndActiveTrue(caller);
            for (Lead l : assignedLeads) {
                if (l.getStatus() == LeadStatus.BOOKED && l.getBudget() != null) {
                    revenue = revenue.add(l.getBudget());
                }
            }

            list.add(TelecallerPerformanceDto.builder()
                    .userId(caller.getId())
                    .fullName(caller.getFullName() != null && !caller.getFullName().isBlank() ? caller.getFullName() : caller.getUsername())
                    .username(caller.getUsername())
                    .totalAssigned(assigned)
                    .callsLogged(calls > 0 ? calls : assigned)
                    .followupsCount(followups)
                    .bookingsClosed(booked)
                    .conversionRate(conversion)
                    .revenueGenerated(revenue)
                    .build());
        }

        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public RevenueReportDto getRevenueReport() {
        BigDecimal totalRevenue = bookingRepository.getTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        BigDecimal advanceCollected = bookingRepository.getTotalCollected();
        if (advanceCollected == null) advanceCollected = BigDecimal.ZERO;

        BigDecimal pendingBalance = bookingRepository.getTotalPendingBalance();
        if (pendingBalance == null) pendingBalance = BigDecimal.ZERO;

        long totalBookings = bookingRepository.countByBookingStatus(BookingStatus.CONFIRMED);

        return RevenueReportDto.builder()
                .grossRevenue(totalRevenue)
                .advanceCollected(advanceCollected)
                .pendingBalance(pendingBalance)
                .totalBookings(totalBookings)
                .monthlyBreakdown(new ArrayList<>())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ByteArrayInputStream exportLeadsExcel() {
        List<Lead> leads = leadRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Leads Report");

            // Header Style
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] columns = {"ID", "Customer Name", "Phone", "Email", "City", "Source", "Status", "Priority", "Property", "Assigned To", "Budget (INR)"};
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 1;
            for (Lead lead : leads) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(lead.getId());
                row.createCell(1).setCellValue(lead.getCustomerName() != null ? lead.getCustomerName() : "");
                row.createCell(2).setCellValue(lead.getMobileNumber() != null ? lead.getMobileNumber() : "");
                row.createCell(3).setCellValue(lead.getEmail() != null ? lead.getEmail() : "");
                row.createCell(4).setCellValue(lead.getCity() != null ? lead.getCity() : "");
                row.createCell(5).setCellValue(lead.getSource() != null ? lead.getSource().name() : "");
                row.createCell(6).setCellValue(lead.getStatus() != null ? lead.getStatus().name() : "");
                row.createCell(7).setCellValue(lead.getPriority() != null ? lead.getPriority().name() : "");
                row.createCell(8).setCellValue(lead.getProperty() != null ? lead.getProperty().getName() : "");
                row.createCell(9).setCellValue(lead.getAssignedTo() != null ? lead.getAssignedTo().getFullName() : "Unassigned");
                row.createCell(10).setCellValue(lead.getBudget() != null ? lead.getBudget().doubleValue() : 0.0);
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            log.error("Failed to generate Leads Excel report", e);
            throw new RuntimeException("Excel generation error: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ByteArrayInputStream exportFinanceExcel() {
        List<Booking> bookings = bookingRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Finance Ledger");

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] columns = {"Booking Number", "Customer", "Phone", "Property", "Check In", "Check Out", "Total (INR)", "Advance (INR)", "Balance Due (INR)", "Status"};
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 1;
            for (Booking b : bookings) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(b.getBookingNumber());
                row.createCell(1).setCellValue(b.getCustomerName());
                row.createCell(2).setCellValue(b.getMobileNumber());
                row.createCell(3).setCellValue(b.getProperty() != null ? b.getProperty().getName() : "");
                row.createCell(4).setCellValue(b.getCheckInDate() != null ? b.getCheckInDate().toString() : "");
                row.createCell(5).setCellValue(b.getCheckOutDate() != null ? b.getCheckOutDate().toString() : "");
                row.createCell(6).setCellValue(b.getTotalAmount() != null ? b.getTotalAmount().doubleValue() : 0.0);
                row.createCell(7).setCellValue(b.getAdvancePaid() != null ? b.getAdvancePaid().doubleValue() : 0.0);
                row.createCell(8).setCellValue(b.getBalanceDue() != null ? b.getBalanceDue().doubleValue() : 0.0);
                row.createCell(9).setCellValue(b.getPaymentStatus() != null ? b.getPaymentStatus().name() : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            log.error("Failed to generate Finance Excel report", e);
            throw new RuntimeException("Excel generation error: " + e.getMessage());
        }
    }
}
