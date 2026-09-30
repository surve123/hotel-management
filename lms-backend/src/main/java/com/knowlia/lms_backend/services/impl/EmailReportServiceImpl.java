package com.knowlia.lms_backend.services.impl;

import com.knowlia.lms_backend.dtos.dashboard.AdminDashboardDto;
import com.knowlia.lms_backend.services.DashboardService;
import com.knowlia.lms_backend.services.EmailReportService;
import com.knowlia.lms_backend.services.ReportService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailReportServiceImpl implements EmailReportService {

    private final JavaMailSender mailSender;
    private final DashboardService dashboardService;
    private final ReportService reportService;

    @Value("${app.mail.admin-recipient:titurkarbhushan2001@gmail.com}")
    private String adminRecipient;

    @Value("${spring.mail.username:no-reply@aranavee.com}")
    private String fromEmail;

    @Override
    @Scheduled(cron = "0 0 0 * * *") // Daily midnight trigger
    public void sendDailyReport() {
        log.info("Executing Daily Midnight LMS Report email task...");
        try {
            AdminDashboardDto stats = dashboardService.getAdminMetrics();
            String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(adminRecipient);
            helper.setSubject("[Aranavee Hospitality] Daily LMS Report & Payments - " + dateStr);

            String html = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                    + "<h2 style='color: #8B7355;'>Aranavee Hospitality — Daily Operations Summary</h2>"
                    + "<p><strong>Date:</strong> " + dateStr + "</p>"
                    + "<table style='border-collapse: collapse; width: 100%; max-width: 600px;'>"
                    + "<tr style='background: #f4f4f4;'><td style='padding: 8px; border: 1px solid #ddd;'>Total Leads:</td><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold;'>" + stats.getTotalLeads() + "</td></tr>"
                    + "<tr><td style='padding: 8px; border: 1px solid #ddd;'>New Inquiries:</td><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold;'>" + stats.getNewLeads() + "</td></tr>"
                    + "<tr style='background: #f4f4f4;'><td style='padding: 8px; border: 1px solid #ddd;'>Hot Pipeline:</td><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold;'>" + stats.getHotLeads() + "</td></tr>"
                    + "<tr><td style='padding: 8px; border: 1px solid #ddd;'>Confirmed Bookings:</td><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold;'>" + stats.getTotalBookings() + "</td></tr>"
                    + "<tr style='background: #f4f4f4;'><td style='padding: 8px; border: 1px solid #ddd;'>Total Revenue:</td><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold; color: green;'>₹" + stats.getTotalRevenue() + "</td></tr>"
                    + "<tr><td style='padding: 8px; border: 1px solid #ddd;'>Advance Collected:</td><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold;'>₹" + stats.getAdvanceCollected() + "</td></tr>"
                    + "<tr style='background: #f4f4f4;'><td style='padding: 8px; border: 1px solid #ddd;'>Pending Balance:</td><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #c0392b;'>₹" + stats.getPendingBalance() + "</td></tr>"
                    + "</table>"
                    + "<p style='margin-top: 20px; font-size: 12px; color: #777;'>Attached is the latest Leads dataset export for offline archive.</p>"
                    + "</body></html>";

            helper.setText(html, true);

            ByteArrayInputStream excelStream = reportService.exportLeadsExcel();
            helper.addAttachment("Leads_Export_" + LocalDate.now() + ".xlsx", new ByteArrayResource(excelStream.readAllBytes()));

            mailSender.send(message);
            log.info("Daily LMS Report email successfully sent to {}", adminRecipient);
        } catch (Exception e) {
            log.warn("Could not dispatch daily report email (SMTP might be unconfigured in current environment): {}", e.getMessage());
        }
    }

    @Override
    @Scheduled(cron = "0 0 0 L * *") // Monthly last day midnight trigger
    public void sendMonthlyReport() {
        log.info("Executing Monthly Executive Excel Report email task...");
        try {
            String monthStr = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy"));

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(adminRecipient);
            helper.setSubject("[Aranavee Hospitality] Monthly Financial & Operations Ledger - " + monthStr);

            String html = "<h2>Aranavee Hospitality — Monthly Ledger Backup (" + monthStr + ")</h2>"
                    + "<p>Attached is the full financial transactions and leads master workbook.</p>";

            helper.setText(html, true);

            ByteArrayInputStream financeStream = reportService.exportFinanceExcel();
            helper.addAttachment("Finance_Ledger_" + LocalDate.now() + ".xlsx", new ByteArrayResource(financeStream.readAllBytes()));

            mailSender.send(message);
            log.info("Monthly Finance Report email successfully sent to {}", adminRecipient);
        } catch (Exception e) {
            log.warn("Could not dispatch monthly report email: {}", e.getMessage());
        }
    }
}
