package com.knowlia.lms_backend.repositories;

import com.knowlia.lms_backend.entities.Lead;
import com.knowlia.lms_backend.entities.LeadSource;
import com.knowlia.lms_backend.entities.LeadStatus;
import com.knowlia.lms_backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long>, JpaSpecificationExecutor<Lead> {

    List<Lead> findByAssignedToAndActiveTrue(User assignedTo);

    Page<Lead> findByAssignedToAndActiveTrue(User assignedTo, Pageable pageable);

    long countByStatus(LeadStatus status);

    long countByAssignedToAndStatus(User assignedTo, LeadStatus status);

    long countByAssignedToAndActiveTrue(User assignedTo);

    long countByPriorityAndActiveTrue(com.knowlia.lms_backend.entities.LeadPriority priority);

    long countByAssignedToAndPriorityAndActiveTrue(User assignedTo, com.knowlia.lms_backend.entities.LeadPriority priority);

    long countBySource(LeadSource source);

    @Query("SELECT l FROM Lead l WHERE l.nextFollowupDate >= :start AND l.nextFollowupDate <= :end AND l.active = true")
    List<Lead> findFollowupsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT l FROM Lead l WHERE l.assignedTo = :user AND l.nextFollowupDate >= :start AND l.nextFollowupDate <= :end AND l.active = true")
    List<Lead> findFollowupsBetweenForUser(@Param("user") User user, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT l FROM Lead l WHERE l.nextFollowupDate < :now AND l.status NOT IN (com.knowlia.lms_backend.entities.LeadStatus.BOOKED, com.knowlia.lms_backend.entities.LeadStatus.CANCELLED) AND l.active = true")
    List<Lead> findOverdueFollowups(@Param("now") LocalDateTime now);

    @Query("SELECT l FROM Lead l WHERE l.assignedTo = :user AND l.nextFollowupDate < :now AND l.status NOT IN (com.knowlia.lms_backend.entities.LeadStatus.BOOKED, com.knowlia.lms_backend.entities.LeadStatus.CANCELLED) AND l.active = true")
    List<Lead> findOverdueFollowupsForUser(@Param("user") User user, @Param("now") LocalDateTime now);

    List<Lead> findByMobileNumberOrEmail(String mobileNumber, String email);

    @Query("SELECT l.source, COUNT(l) FROM Lead l GROUP BY l.source")
    List<Object[]> countLeadsBySource();

    @Query("SELECT l.status, COUNT(l) FROM Lead l GROUP BY l.status")
    List<Object[]> countLeadsByStatus();
}
