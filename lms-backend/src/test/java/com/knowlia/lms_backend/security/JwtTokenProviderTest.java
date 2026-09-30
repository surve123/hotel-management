package com.knowlia.lms_backend.security;

import com.knowlia.lms_backend.entities.Role;
import com.knowlia.lms_backend.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        // 256-bit base64-encoded secret key for testing
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationDate", 3600000L); // 1 hour
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtRefreshExpirationDate", 604800000L); // 7 days
    }

    @Test
    void testGenerateAndValidateToken() {
        User user = User.builder()
                .id(1L)
                .username("admin")
                .email("admin@aranavee.com")
                .fullName("Aranavee Admin")
                .role(Role.ROLE_SUPER_ADMIN)
                .active(true)
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = jwtTokenProvider.generateToken(authentication);

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("admin", jwtTokenProvider.getUsername(token));
    }

    @Test
    void testGenerateRefreshToken() {
        User user = User.builder()
                .id(2L)
                .username("neha")
                .email("neha@aranavee.com")
                .fullName("Neha Sharma")
                .role(Role.ROLE_TELECALLER)
                .active(true)
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        assertNotNull(refreshToken);
        assertTrue(jwtTokenProvider.validateToken(refreshToken));
        assertEquals("neha", jwtTokenProvider.getUsername(refreshToken));
    }

    @Test
    void testInvalidToken() {
        String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.token";
        assertFalse(jwtTokenProvider.validateToken(invalidToken));
    }
}
