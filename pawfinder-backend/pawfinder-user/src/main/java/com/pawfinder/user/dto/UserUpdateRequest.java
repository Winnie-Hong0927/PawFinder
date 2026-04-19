package com.pawfinder.user.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UserUpdateRequest {

    private String name;

    @Email(message = "邮箱格式不正确")
    private String email;

    private String avatarUrl;

    private String bio;

    private String address;

    private String idCardNumber;
}
