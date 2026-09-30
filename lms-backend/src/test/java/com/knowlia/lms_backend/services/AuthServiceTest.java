package com.knowlia.lms_backend.services;

import com.knowlia.lms_backend.dtos.auth.AuthResponse;
import com.knowlia.lms_backend.dtos.auth.LoginRequest;
import com.knowlia.lms_backend.dtos.auth.UserProfileDto;
import com.knowlia.lms_backend.entities.Role;
import com.knowlia.lms_backend.entities.User;
import com.knowlia.lms_backend.repositories.UserRepository;
import com.knowlia.lms_backend.security.CustomUserDetails;
import com.knowlia.lms_backend.security.JwtTokenProvider;
import com.knowlia.lms_backend.services.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .username("admin")
                .email("admin@aranavee.com")
                .password("encoded_password")
                .fullName("Aranavee Admin")
                .role(Role.ROLE_SUPER_ADMIN)
                .active(true)
                .build();
    }

    @Test
    void testLoginSuccess() {
        LoginRequest loginRequest = LoginRequest.builder()
                .usernameOrEmail("admin")
                .password("admin123")
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(sampleUser);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtTokenProvider.generateToken(authentication)).thenReturn("mocked-jwt-access-token");
        when(jwtTokenProvider.generateRefreshToken(authentication)).thenReturn("mocked-jwt-refresh-token");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mocked-jwt-access-token", response.getAccessToken());
        assertEquals("mocked-jwt-refresh-token", response.getRefreshToken());
        assertEquals("admin", response.getUsername());
        assertEquals("ROLE_SUPER_ADMIN", response.getRole());
        assertEquals(1L, response.getUserId());
    }

    @Test
    void testGetCurrentUserProfile() {
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(sampleUser));

        UserProfileDto profile = authService.getCurrentUserProfile("admin");

        assertNotNull(profile);
        assertEquals("admin", profile.getUsername());
        assertEquals("admin@aranavee.com", profile.getEmail());
        assertEquals("Aranavee Admin", profile.getFullName());
        assertEquals("ROLE_SUPER_ADMIN", profile.getRole());
    }
}
