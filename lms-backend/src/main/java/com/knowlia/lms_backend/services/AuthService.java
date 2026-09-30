package com.knowlia.lms_backend.services;

import com.knowlia.lms_backend.dtos.auth.AuthResponse;
import com.knowlia.lms_backend.dtos.auth.ChangePasswordRequest;
import com.knowlia.lms_backend.dtos.auth.LoginRequest;
import com.knowlia.lms_backend.dtos.auth.UserProfileDto;

public interface AuthService {

    AuthResponse login(LoginRequest loginRequest);

    AuthResponse refreshToken(com.knowlia.lms_backend.dtos.auth.RefreshTokenRequest request);

    UserProfileDto getCurrentUserProfile(String username);

    void changePassword(String username, ChangePasswordRequest request);
}
