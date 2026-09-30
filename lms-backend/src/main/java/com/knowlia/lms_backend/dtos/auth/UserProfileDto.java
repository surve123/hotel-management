package com.knowlia.lms_backend.dtos.auth;

import com.knowlia.lms_backend.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private String assignedProperty;
    private boolean active;

    public static UserProfileDto fromEntity(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .assignedProperty(user.getAssignedProperty())
                .active(user.isActive())
                .build();
    }
}
