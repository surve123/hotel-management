package com.knowlia.lms_backend.controllers;

import com.knowlia.lms_backend.dtos.common.ApiResponse;
import com.knowlia.lms_backend.dtos.common.PageResponse;
import com.knowlia.lms_backend.dtos.lead.*;
import com.knowlia.lms_backend.entities.LeadPriority;
import com.knowlia.lms_backend.entities.LeadSource;
import com.knowlia.lms_backend.entities.LeadStatus;
import com.knowlia.lms_backend.services.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<LeadResponseDto>>> getLeads(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(required = false) LeadPriority priority,
            @RequestParam(required = false) LeadSource source,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponse<LeadResponseDto> leads = leadService.getLeads(
                search, status, priority, source, propertyId, assignedToId, startDate, endDate, pageable
        );

        return ResponseEntity.ok(ApiResponse.success(leads, "Leads retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LeadResponseDto>> createLead(
            @Valid @RequestBody CreateLeadRequest request,
            Authentication authentication
    ) {
        LeadResponseDto created = leadService.createLead(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Lead created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadResponseDto>> getLeadById(@PathVariable Long id) {
        LeadResponseDto lead = leadService.getLeadById(id);
        return ResponseEntity.ok(ApiResponse.success(lead, "Lead retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadResponseDto>> updateLead(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLeadRequest request,
            Authentication authentication
    ) {
        LeadResponseDto updated = leadService.updateLead(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(updated, "Lead updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Lead archived successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LeadResponseDto>> updateLeadStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication
    ) {
        LeadStatus status = LeadStatus.valueOf(body.get("status"));
        LeadResponseDto updated = leadService.updateLeadStatus(id, status, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(updated, "Lead status updated successfully"));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<LeadResponseDto>> assignLead(
            @PathVariable Long id,
            @Valid @RequestBody AssignLeadRequest request,
            Authentication authentication
    ) {
        LeadResponseDto updated = leadService.assignLead(id, request.getUserId(), authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(updated, "Lead assigned successfully"));
    }

    @PostMapping("/{id}/call-logs")
    public ResponseEntity<ApiResponse<LeadResponseDto>> logCall(
            @PathVariable Long id,
            @Valid @RequestBody LogCallRequest request,
            Authentication authentication
    ) {
        LeadResponseDto updated = leadService.logCall(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(updated, "Call logged successfully"));
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<ApiResponse<LeadResponseDto>> addNote(
            @PathVariable Long id,
            @Valid @RequestBody AddNoteRequest request,
            Authentication authentication
    ) {
        LeadResponseDto updated = leadService.addNote(id, request.getNote(), authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(updated, "Note added successfully"));
    }
}
