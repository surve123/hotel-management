package com.knowlia.lms_backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * DataInitializer is kept completely empty so that all logins, users,
 * properties, leads, and bookings are 100% managed dynamically through the backend database.
 */
@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    @Override
    public void run(String... args) {
        log.info("LMS Backend started: All user authentication and data are strictly database-driven.");
    }
}


