package com.pawfinder.user.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login Response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResp {

    /**
     * JWT Token
     */
    private String token;

    /**
     * Token type
     */
    private String tokenType;

    /**
     * User ID
     */
    private Long userId;

    /**
     * Email
     */
    private String email;

    /**
     * Name
     */
    private String name;

    /**
     * Role
     */
    private String role;

    /**
     * Adopter Status
     */
    private String adopterStatus;
}
