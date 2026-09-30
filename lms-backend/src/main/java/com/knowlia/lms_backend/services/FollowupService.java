package com.knowlia.lms_backend.services;

import com.knowlia.lms_backend.dtos.followup.*;

import java.time.LocalDateTime;
import java.util.List;

public interface FollowupService {

    FollowupDashboardDto getFollowupDashboard(String currentUsername);

    List<FollowupItemDto> getTodayFollowups(String currentUsername);

    List<FollowupItemDto> getOverdueFollowups(String currentUsername);

    List<FollowupCalendarEventDto> getCalendarEvents(LocalDateTime start, LocalDateTime end, String currentUsername);

    List<FollowupItemDto> getFollowupHistory(String currentUsername);

    void rescheduleFollowup(Long leadId, LocalDateTime nextDate, String remarks, String currentUsername);
}
