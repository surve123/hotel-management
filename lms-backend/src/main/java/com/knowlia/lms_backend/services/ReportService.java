package com.knowlia.lms_backend.services;

import com.knowlia.lms_backend.dtos.report.LeadSourceReportDto;
import com.knowlia.lms_backend.dtos.report.RevenueReportDto;
import com.knowlia.lms_backend.dtos.report.TelecallerPerformanceDto;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface ReportService {

    List<LeadSourceReportDto> getLeadSourceReport();

    List<TelecallerPerformanceDto> getTelecallerPerformanceReport();

    RevenueReportDto getRevenueReport();

    ByteArrayInputStream exportLeadsExcel();

    ByteArrayInputStream exportFinanceExcel();
}
