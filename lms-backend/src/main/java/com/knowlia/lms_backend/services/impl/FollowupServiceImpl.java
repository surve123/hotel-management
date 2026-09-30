package com.knowlia.lms_backend.services.impl;

import com.knowlia.lms_backend.dtos.followup.*;
import com.knowlia.lms_backend.entities.*;
import com.knowlia.lms_backend.exceptions.ResourceNotFoundException;
import com.knowlia.lms_backend.repositories.CallLogRepository;
import com.knowlia.lms_backend.repositories.LeadActivityRepository;
import com.knowlia.lms_backend.repositories.LeadRepository;
import com.knowlia.lms_backend.repositories.UserRepository;
import com.knowlia.lms_backend.services.FollowupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowupServiceImpl implements FollowupService {

    private final LeadRepository leadRepository;
    private final CallLogRepository callLogRepository;
    private final UserRepository userRepository;
    private final LeadActivityRepository leadActivityRepository;

    @Override
    @Transactional(readOnly = true)
    public FollowupDashboardDto getFollowupDashboard(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername).orElse(null);
        boolean isCaller = user != null && user.getRole() == Role.ROLE_TELECALLER;

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);
        LocalDateTime upcomingEnd = LocalDate.now().plusDays(7).atTime(LocalTime.MAX);

        List<Lead> dueTodayLeads = isCaller
                ? leadRepository.findFollowupsBetweenForUser(user, startOfToday, endOfToday)
                : leadRepository.findFollowupsBetween(startOfToday, endOfToday);

        List<Lead> overdueLeads = isCaller
                ? leadRepository.findOverdueFollowupsForUser(user, now)
                : leadRepository.findOverdueFollowups(now);

        List<Lead> upcomingLeads = isCaller
                ? leadRepository.findFollowupsBetweenForUser(user, endOfToday, upcomingEnd)
                : leadRepository.findFollowupsBetween(endOfToday, upcomingEnd);

        long completedToday = isCaller
                ? callLogRepository.countCallsBetweenForCaller(user, startOfToday, endOfToday)
                : callLogRepository.countCallsBetween(startOfToday, endOfToday);

        long highPriority = isCaller && user != null
                ? leadRepository.countByAssignedToAndPriorityAndActiveTrue(user, LeadPriority.HIGH)
                : leadRepository.countByPriorityAndActiveTrue(LeadPriority.HIGH);

        return FollowupDashboardDto.builder()
                .dueToday(dueTodayLeads.size())
                .overdue(overdueLeads.size())
                .upcoming(upcomingLeads.size())
                .completedToday(completedToday)
                .highPriority(highPriority)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowupItemDto> getTodayFollowups(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername).orElse(null);
        boolean isCaller = user != null && user.getRole() == Role.ROLE_TELECALLER;

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);

        List<Lead> leads = isCaller
                ? leadRepository.findFollowupsBetweenForUser(user, startOfToday, endOfToday)
                : leadRepository.findFollowupsBetween(startOfToday, endOfToday);

        return leads.stream().map(this::mapToFollowupItem).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowupItemDto> getOverdueFollowups(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername).orElse(null);
        boolean isCaller = user != null && user.getRole() == Role.ROLE_TELECALLER;

        LocalDateTime now = LocalDateTime.now();
        List<Lead> leads = isCaller
                ? leadRepository.findOverdueFollowupsForUser(user, now)
                : leadRepository.findOverdueFollowups(now);

        return leads.stream().map(this::mapToFollowupItem).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowupCalendarEventDto> getCalendarEvents(LocalDateTime start, LocalDateTime end, String currentUsername) {
        User user = userRepository.findByUsername(currentUsername).orElse(null);
        boolean isCaller = user != null && user.getRole() == Role.ROLE_TELECALLER;

        LocalDateTime rangeStart = start != null ? start : LocalDate.now().minusDays(30).atStartOfDay();
        LocalDateTime rangeEnd = end != null ? end : LocalDate.now().plusDays(60).atTime(LocalTime.MAX);

        List<Lead> leads = isCaller
                ? leadRepository.findFollowupsBetweenForUser(user, rangeStart, rangeEnd)
                : leadRepository.findFollowupsBetween(rangeStart, rangeEnd);

        return leads.stream().map(lead -> FollowupCalendarEventDto.builder()
                .id(String.valueOf(lead.getId()))
                .title(lead.getCustomerName() + " (" + (lead.getProperty() != null ? lead.getProperty().getName() : "General") + ")")
                .start(lead.getNextFollowupDate())
                .end(lead.getNextFollowupDate() != null ? lead.getNextFollowupDate().plusMinutes(30) : null)
                .customerName(lead.getCustomerName())
                .mobileNumber(lead.getMobileNumber())
                .status(lead.getStatus() != null ? lead.getStatus().name() : "")
                .priority(lead.getPriority() != null ? lead.getPriority().name() : "")
                .propertyName(lead.getProperty() != null ? lead.getProperty().getName() : "")
                .assignedToName(lead.getAssignedTo() != null ? lead.getAssignedTo().getFullName() : "Unassigned")
                .build()).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowupItemDto> getFollowupHistory(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername).orElse(null);
        List<CallLog> logs = (user != null && user.getRole() == Role.ROLE_TELECALLER)
                ? callLogRepository.findByCallerOrderByCallDateDesc(user)
                : callLogRepository.findAll();

        return logs.stream().map(log -> FollowupItemDto.builder()
                .leadId(log.getLead() != null ? log.getLead().getId() : null)
                .customerName(log.getLead() != null ? log.getLead().getCustomerName() : "")
                .mobileNumber(log.getLead() != null ? log.getLead().getMobileNumber() : "")
                .propertyName(log.getLead() != null && log.getLead().getProperty() != null ? log.getLead().getProperty().getName() : "")
                .leadStatus(log.getLead() != null ? log.getLead().getStatus() : null)
                .priority(log.getLead() != null ? log.getLead().getPriority() : null)
                .scheduledTime(log.getCallDate())
                .remarks("Outcome: " + log.getOutcome() + " | " + (log.getRemarks() != null ? log.getRemarks() : ""))
                .assignedToId(log.getCaller() != null ? log.getCaller().getId() : null)
                .assignedToName(log.getCaller() != null ? log.getCaller().getFullName() : "")
                .build()).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void rescheduleFollowup(Long leadId, LocalDateTime nextDate, String remarks, String currentUsername) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + leadId));
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);

        lead.setNextFollowupDate(nextDate);
        lead.setStatus(LeadStatus.FOLLOW_UP);
        leadRepository.save(lead);

        leadActivityRepository.save(LeadActivity.builder()
                .lead(lead)
                .performedBy(currentUser)
                .activityType(ActivityType.CALL_LOGGED)
                .description("Follow-up rescheduled to " + nextDate + ". Remarks: " + (remarks != null ? remarks : "None"))
                .build());
    }

    private FollowupItemDto mapToFollowupItem(Lead lead) {
        return FollowupItemDto.builder()
                .leadId(lead.getId())
                .customerName(lead.getCustomerName())
                .mobileNumber(lead.getMobileNumber())
                .propertyName(lead.getProperty() != null ? lead.getProperty().getName() : null)
                .leadStatus(lead.getStatus())
                .priority(lead.getPriority())
                .scheduledTime(lead.getNextFollowupDate())
                .remarks(lead.getRemarks())
                .assignedToId(lead.getAssignedTo() != null ? lead.getAssignedTo().getId() : null)
                .assignedToName(lead.getAssignedTo() != null ? lead.getAssignedTo().getFullName() : "Unassigned")
                .build();
    }
}
