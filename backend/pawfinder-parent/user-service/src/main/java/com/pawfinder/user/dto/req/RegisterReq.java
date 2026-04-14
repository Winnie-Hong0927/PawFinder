package com.pawfinder.user.dto.req;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Register Request
 */
@Data
public class RegisterReq {

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, max = 20, message = "Password must be 6-20 characters")
    private String password;

    @NotBlank(message = "Name cannot be empty")
    private String name;

    private String phone;

    private String role;
}
