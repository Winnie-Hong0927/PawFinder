package com.pawfinder.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String phone;

    private String name;

    private String email;

    private String role;

    private String institutionId;

    private String institutionName;

    private String avatarUrl;

    private String bio;

    private String address;

    private String adopterStatus;

    private LocalDateTime createdAt;
}
