package com.knowlia.lms_backend.controllers;

import com.knowlia.lms_backend.dtos.common.ApiResponse;
import com.knowlia.lms_backend.dtos.report.LeadSourceReportDto;
import com.knowlia.lms_backend.dtos.report.RevenueReportDto;
import com.knowlia.lms_backend.dtos.report.TelecallerPerformanceDto;
import com.knowlia.lms_backend.services.EmailReportService;
import com.knowlia.lms_backend.services.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class ReportController {

    private final ReportService reportService;
    private final EmailReportService emailReportService;

    @GetMapping("/sources")
    public ResponseEntity<ApiResponse<List<LeadSourceReportDto>>> getLeadSourceReport() {
        List<LeadSourceReportDto> report = reportService.getLeadSourceReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Lead source report retrieved successfully"));
    }

    @GetMapping("/telecallers")
    public ResponseEntity<ApiResponse<List<TelecallerPerformanceDto>>> getTelecallerPerformanceReport() {
        List<TelecallerPerformanceDto> report = reportService.getTelecallerPerformanceReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Telecaller performance report retrieved successfully"));
    }

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<RevenueReportDto>> getRevenueReport() {
        RevenueReportDto report = reportService.getRevenueReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Revenue report retrieved successfully"));
    }

    @GetMapping("/export/leads")
    public ResponseEntity<InputStreamResource> exportLeadsExcel() {
        ByteArrayInputStream in = reportService.exportLeadsExcel();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Leads_Report_" + LocalDate.now() + ".xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @GetMapping("/export/finance")
    public ResponseEntity<InputStreamResource> exportFinanceExcel() {
        ByteArrayInputStream in = reportService.exportFinanceExcel();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Finance_Ledger_" + LocalDate.now() + ".xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @PostMapping("/trigger-daily-email")
    public ResponseEntity<ApiResponse<Void>> triggerDailyEmail() {
        emailReportService.sendDailyReport();
        return ResponseEntity.ok(ApiResponse.success(null, "Daily report email triggered successfully"));
    }
}
