package com.knowlia.lms_backend.repositories;

import com.knowlia.lms_backend.entities.CallLog;
import com.knowlia.lms_backend.entities.Lead;
import com.knowlia.lms_backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CallLogRepository extends JpaRepository<CallLog, Long> {

    List<CallLog> findByLeadOrderByCallDateDesc(Lead lead);

    List<CallLog> findByCallerOrderByCallDateDesc(User caller);

    Page<CallLog> findByCaller(User caller, Pageable pageable);

    @Query("SELECT COUNT(c) FROM CallLog c WHERE c.callDate >= :start AND c.callDate <= :end")
    long countCallsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(c) FROM CallLog c WHERE c.caller = :caller AND c.callDate >= :start AND c.callDate <= :end")
    long countCallsBetweenForCaller(@Param("caller") User caller, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT c.caller.id, c.caller.fullName, COUNT(c) FROM CallLog c GROUP BY c.caller.id, c.caller.fullName")
    List<Object[]> getCallStatsByTelecaller();
}
