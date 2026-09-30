package com.knowlia.lms_backend.dtos.user;

import com.knowlia.lms_backend.entities.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private Role role;
    private String assignedProperty;
    private boolean active;
    private long activeLeadsCount;
    private LocalDateTime createdAt;
}
