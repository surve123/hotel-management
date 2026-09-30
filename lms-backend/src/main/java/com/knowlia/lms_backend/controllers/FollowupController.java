package com.knowlia.lms_backend.controllers;

import com.knowlia.lms_backend.dtos.common.ApiResponse;
import com.knowlia.lms_backend.dtos.followup.*;
import com.knowlia.lms_backend.services.FollowupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/followups")
@RequiredArgsConstructor
public class FollowupController {

    private final FollowupService followupService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<FollowupDashboardDto>> getFollowupDashboard(Authentication authentication) {
        FollowupDashboardDto dashboard = followupService.getFollowupDashboard(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(dashboard, "Follow-up dashboard metrics retrieved successfully"));
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<FollowupItemDto>>> getTodayFollowups(Authentication authentication) {
        List<FollowupItemDto> items = followupService.getTodayFollowups(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(items, "Today's follow-ups retrieved successfully"));
    }

    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<FollowupItemDto>>> getOverdueFollowups(Authentication authentication) {
        List<FollowupItemDto> items = followupService.getOverdueFollowups(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(items, "Overdue follow-ups retrieved successfully"));
    }

    @GetMapping("/calendar")
    public ResponseEntity<ApiResponse<List<FollowupCalendarEventDto>>> getCalendarEvents(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            Authentication authentication
    ) {
        List<FollowupCalendarEventDto> events = followupService.getCalendarEvents(start, end, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(events, "Calendar events retrieved successfully"));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<FollowupItemDto>>> getFollowupHistory(Authentication authentication) {
        List<FollowupItemDto> history = followupService.getFollowupHistory(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(history, "Follow-up history retrieved successfully"));
    }

    @PatchMapping("/{id}/reschedule")
    public ResponseEntity<ApiResponse<Void>> rescheduleFollowup(
            @PathVariable Long id,
            @Valid @RequestBody RescheduleFollowupRequest request,
            Authentication authentication
    ) {
        followupService.rescheduleFollowup(id, request.getNextFollowupDate(), request.getRemarks(), authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Follow-up rescheduled successfully"));
    }
}
