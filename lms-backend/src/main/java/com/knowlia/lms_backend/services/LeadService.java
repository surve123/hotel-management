package com.knowlia.lms_backend.services;

import com.knowlia.lms_backend.dtos.common.PageResponse;
import com.knowlia.lms_backend.dtos.lead.*;
import com.knowlia.lms_backend.entities.LeadPriority;
import com.knowlia.lms_backend.entities.LeadSource;
import com.knowlia.lms_backend.entities.LeadStatus;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface LeadService {

    PageResponse<LeadResponseDto> getLeads(
            String search,
            LeadStatus status,
            LeadPriority priority,
            LeadSource source,
            Long propertyId,
            Long assignedToId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    LeadResponseDto createLead(CreateLeadRequest request, String currentUsername);

    LeadResponseDto getLeadById(Long id);

    LeadResponseDto updateLead(Long id, UpdateLeadRequest request, String currentUsername);

    void deleteLead(Long id);

    LeadResponseDto updateLeadStatus(Long id, LeadStatus status, String currentUsername);

    LeadResponseDto assignLead(Long id, Long userId, String currentUsername);

    LeadResponseDto logCall(Long id, LogCallRequest request, String currentUsername);

    LeadResponseDto addNote(Long id, String note, String currentUsername);
}
