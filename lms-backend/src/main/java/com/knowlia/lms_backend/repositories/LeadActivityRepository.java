package com.knowlia.lms_backend.repositories;

import com.knowlia.lms_backend.entities.Lead;
import com.knowlia.lms_backend.entities.LeadActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadActivityRepository extends JpaRepository<LeadActivity, Long> {

    List<LeadActivity> findByLeadOrderByActivityTimeDesc(Lead lead);
}
