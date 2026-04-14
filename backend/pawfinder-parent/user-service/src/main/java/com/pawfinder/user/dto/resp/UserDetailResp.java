package com.pawfinder.user.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * User Detail Response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailResp {

    /**
     * User ID
     */
    private Long id;

    /**
     * Email
     */
    private String email;

    /**
     * Phone
     */
    private String phone;

    /**
     * Name
     */
    private String name;

    /**
     * Avatar URL
     */
    private String avatarUrl;

    /**
     * Role
     */
    private String role;

    /**
     * Role Description
     */
    private String roleDesc;

    /**
     * Adopter Status
     */
    private String adopterStatus;

    /**
     * Adopter Status Description
     */
    private String adopterStatusDesc;

    /**
     * Address
     */
    private String address;

    /**
     * Bio
     */
    private String bio;

    /**
     * Created At
     */
    private LocalDateTime createdAt;
}
