package com.knowlia.lms_backend.controllers;

import com.knowlia.lms_backend.dtos.common.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class HealthControllerTest {

    private final HealthController healthController = new HealthController();

    @Test
    void testCheckHealth() {
        ResponseEntity<ApiResponse<Map<String, String>>> response = healthController.checkHealth();

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("UP", response.getBody().getData().get("status"));
        assertEquals("Aranavee LMS Backend", response.getBody().getData().get("service"));
    }
}
