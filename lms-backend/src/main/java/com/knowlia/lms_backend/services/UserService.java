package com.knowlia.lms_backend.services;

import com.knowlia.lms_backend.dtos.user.CreateUserRequest;
import com.knowlia.lms_backend.dtos.user.UpdateUserRequest;
import com.knowlia.lms_backend.dtos.user.UserDto;
import com.knowlia.lms_backend.entities.Role;

import java.util.List;

public interface UserService {

    List<UserDto> getAllUsers(Role role);

    UserDto getUserById(Long id);

    UserDto createUser(CreateUserRequest request);

    UserDto updateUser(Long id, UpdateUserRequest request);

    void toggleUserStatus(Long id, boolean active);

    void resetPassword(Long id, String newPassword);

    void deleteUser(Long id);
}

