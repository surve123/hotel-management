package com.knowlia.lms_backend.repositories;

import com.knowlia.lms_backend.entities.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByActiveTrue();

    Optional<Property> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
