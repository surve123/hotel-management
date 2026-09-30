package com.knowlia.lms_backend.services.impl;

import com.knowlia.lms_backend.dtos.common.PageResponse;
import com.knowlia.lms_backend.dtos.lead.*;
import com.knowlia.lms_backend.entities.*;
import com.knowlia.lms_backend.exceptions.ResourceNotFoundException;
import com.knowlia.lms_backend.repositories.*;
import com.knowlia.lms_backend.services.LeadService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final CallLogRepository callLogRepository;
    private final LeadActivityRepository leadActivityRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<LeadResponseDto> getLeads(
            String search,
            LeadStatus status,
            LeadPriority priority,
            LeadSource source,
            Long propertyId,
            Long assignedToId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    ) {
        Specification<Lead> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate nameP = cb.like(cb.lower(root.get("customerName")), pattern);
                Predicate phoneP = cb.like(root.get("mobileNumber"), pattern);
                Predicate emailP = cb.like(cb.lower(root.get("email")), pattern);
                predicates.add(cb.or(nameP, phoneP, emailP));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }

            if (source != null) {
                predicates.add(cb.equal(root.get("source"), source));
            }

            if (propertyId != null) {
                predicates.add(cb.equal(root.get("property").get("id"), propertyId));
            }

            if (assignedToId != null) {
                predicates.add(cb.equal(root.get("assignedTo").get("id"), assignedToId));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), startDate.atStartOfDay()));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), endDate.atTime(23, 59, 59)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Lead> page = leadRepository.findAll(spec, pageable);
        List<LeadResponseDto> content = page.getContent().stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());

        return PageResponse.<LeadResponseDto>builder()
                .content(content)
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isLast(page.isLast())
                .build();
    }

    @Override
    @Transactional
    public LeadResponseDto createLead(CreateLeadRequest request, String currentUsername) {
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);

        Property property = null;
        if (request.getPropertyId() != null) {
            property = propertyRepository.findById(request.getPropertyId()).orElse(null);
        }

        User assignedTo = null;
        if (request.getAssignedToUserId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToUserId()).orElse(null);
        }

        Lead lead = Lead.builder()
                .customerName(request.getCustomerName())
                .mobileNumber(request.getMobileNumber())
                .email(request.getEmail())
                .city(request.getCity())
                .numberOfGuests(request.getNumberOfGuests())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .source(request.getSource())
                .status(request.getStatus() != null ? request.getStatus() : LeadStatus.NEW)
                .priority(request.getPriority() != null ? request.getPriority() : LeadPriority.MEDIUM)
                .budget(request.getBudget())
                .remarks(request.getRemarks())
                .nextFollowupDate(request.getNextFollowupDate())
                .property(property)
                .assignedTo(assignedTo)
                .active(true)
                .build();

        Lead savedLead = leadRepository.save(lead);

        // Record creation activity
        leadActivityRepository.save(LeadActivity.builder()
                .lead(savedLead)
                .performedBy(currentUser)
                .activityType(ActivityType.STATUS_CHANGE)
                .description("Lead created via " + request.getSource())
                .build());

        return getLeadById(savedLead.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public LeadResponseDto getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));

        List<CallLog> callLogs = callLogRepository.findByLeadOrderByCallDateDesc(lead);
        List<LeadActivity> activities = leadActivityRepository.findByLeadOrderByActivityTimeDesc(lead);

        return mapToFullDto(lead, callLogs, activities);
    }

    @Override
    @Transactional
    public LeadResponseDto updateLead(Long id, UpdateLeadRequest request, String currentUsername) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);

        if (request.getCustomerName() != null) lead.setCustomerName(request.getCustomerName());
        if (request.getMobileNumber() != null) lead.setMobileNumber(request.getMobileNumber());
        if (request.getEmail() != null) lead.setEmail(request.getEmail());
        if (request.getCity() != null) lead.setCity(request.getCity());
        if (request.getNumberOfGuests() != null) lead.setNumberOfGuests(request.getNumberOfGuests());
        if (request.getCheckInDate() != null) lead.setCheckInDate(request.getCheckInDate());
        if (request.getCheckOutDate() != null) lead.setCheckOutDate(request.getCheckOutDate());
        if (request.getSource() != null) lead.setSource(request.getSource());
        if (request.getStatus() != null) lead.setStatus(request.getStatus());
        if (request.getPriority() != null) lead.setPriority(request.getPriority());
        if (request.getBudget() != null) lead.setBudget(request.getBudget());
        if (request.getRemarks() != null) lead.setRemarks(request.getRemarks());
        if (request.getNextFollowupDate() != null) lead.setNextFollowupDate(request.getNextFollowupDate());

        if (request.getPropertyId() != null) {
            Property property = propertyRepository.findById(request.getPropertyId()).orElse(null);
            lead.setProperty(property);
        }

        if (request.getAssignedToUserId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToUserId()).orElse(null);
            lead.setAssignedTo(assignedTo);
        }

        Lead savedLead = leadRepository.save(lead);

        leadActivityRepository.save(LeadActivity.builder()
                .lead(savedLead)
                .performedBy(currentUser)
                .activityType(ActivityType.LEAD_UPDATED)
                .description("Lead information updated")
                .build());

        return getLeadById(savedLead.getId());
    }

    @Override
    @Transactional
    public void deleteLead(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        lead.setActive(false);
        leadRepository.save(lead);
    }

    @Override
    @Transactional
    public LeadResponseDto updateLeadStatus(Long id, LeadStatus status, String currentUsername) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);

        LeadStatus oldStatus = lead.getStatus();
        lead.setStatus(status);
        Lead saved = leadRepository.save(lead);

        leadActivityRepository.save(LeadActivity.builder()
                .lead(saved)
                .performedBy(currentUser)
                .activityType(ActivityType.STATUS_CHANGE)
                .description("Status changed from " + oldStatus + " to " + status)
                .build());

        return getLeadById(saved.getId());
    }

    @Override
    @Transactional
    public LeadResponseDto assignLead(Long id, Long userId, String currentUsername) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        User userToAssign = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);

        lead.setAssignedTo(userToAssign);
        Lead saved = leadRepository.save(lead);

        leadActivityRepository.save(LeadActivity.builder()
                .lead(saved)
                .performedBy(currentUser)
                .activityType(ActivityType.ASSIGNED)
                .description("Assigned to " + userToAssign.getFullName())
                .build());

        return getLeadById(saved.getId());
    }

    @Override
    @Transactional
    public LeadResponseDto logCall(Long id, LogCallRequest request, String currentUsername) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        CallLog callLog = CallLog.builder()
                .lead(lead)
                .caller(currentUser)
                .callDate(LocalDateTime.now())
                .durationMinutes(request.getDurationMinutes())
                .outcome(request.getOutcome())
                .remarks(request.getRemarks())
                .nextFollowupDate(request.getNextFollowupDate())
                .build();

        callLogRepository.save(callLog);

        if (request.getNextFollowupDate() != null) {
            lead.setNextFollowupDate(request.getNextFollowupDate());
            lead.setStatus(LeadStatus.FOLLOW_UP);
            leadRepository.save(lead);
        }

        leadActivityRepository.save(LeadActivity.builder()
                .lead(lead)
                .performedBy(currentUser)
                .activityType(ActivityType.CALL_LOGGED)
                .description("Call logged: Outcome [" + request.getOutcome() + "] - " + (request.getRemarks() != null ? request.getRemarks() : "No remarks"))
                .build());

        return getLeadById(lead.getId());
    }

    @Override
    @Transactional
    public LeadResponseDto addNote(Long id, String note, String currentUsername) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);

        leadActivityRepository.save(LeadActivity.builder()
                .lead(lead)
                .performedBy(currentUser)
                .activityType(ActivityType.NOTE_ADDED)
                .description(note)
                .build());

        return getLeadById(lead.getId());
    }

    private LeadResponseDto mapToSummaryDto(Lead lead) {
        return LeadResponseDto.builder()
                .id(lead.getId())
                .customerName(lead.getCustomerName())
                .mobileNumber(lead.getMobileNumber())
                .email(lead.getEmail())
                .city(lead.getCity())
                .numberOfGuests(lead.getNumberOfGuests())
                .checkInDate(lead.getCheckInDate())
                .checkOutDate(lead.getCheckOutDate())
                .source(lead.getSource())
                .status(lead.getStatus())
                .priority(lead.getPriority())
                .budget(lead.getBudget())
                .remarks(lead.getRemarks())
                .nextFollowupDate(lead.getNextFollowupDate())
                .propertyId(lead.getProperty() != null ? lead.getProperty().getId() : null)
                .propertyName(lead.getProperty() != null ? lead.getProperty().getName() : null)
                .assignedToId(lead.getAssignedTo() != null ? lead.getAssignedTo().getId() : null)
                .assignedToName(lead.getAssignedTo() != null ? lead.getAssignedTo().getFullName() : null)
                .createdAt(lead.getCreatedAt())
                .updatedAt(lead.getUpdatedAt())
                .build();
    }

    private LeadResponseDto mapToFullDto(Lead lead, List<CallLog> callLogs, List<LeadActivity> activities) {
        LeadResponseDto dto = mapToSummaryDto(lead);

        dto.setCallLogs(callLogs.stream().map(c -> LeadResponseDto.CallLogDto.builder()
                .id(c.getId())
                .callerId(c.getCaller() != null ? c.getCaller().getId() : null)
                .callerName(c.getCaller() != null ? c.getCaller().getFullName() : null)
                .callDate(c.getCallDate())
                .durationMinutes(c.getDurationMinutes())
                .outcome(c.getOutcome())
                .remarks(c.getRemarks())
                .nextFollowupDate(c.getNextFollowupDate())
                .build()).collect(Collectors.toList()));

        dto.setActivities(activities.stream().map(a -> LeadResponseDto.LeadActivityDto.builder()
                .id(a.getId())
                .userId(a.getPerformedBy() != null ? a.getPerformedBy().getId() : null)
                .userName(a.getPerformedBy() != null ? a.getPerformedBy().getFullName() : null)
                .activityType(a.getActivityType())
                .description(a.getDescription())
                .activityTime(a.getActivityTime())
                .build()).collect(Collectors.toList()));

        return dto;
    }
}
