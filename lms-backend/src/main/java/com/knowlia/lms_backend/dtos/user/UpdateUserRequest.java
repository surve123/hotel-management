package com.knowlia.lms_backend.dtos.user;

import com.knowlia.lms_backend.entities.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {

    private String fullName;
    private String phone;
    private String password;
    private Role role;
    private String assignedProperty;
    private Boolean active;
}
