package com.pawfinder.user.dto;

import lombok.Data;

/**
 * User view object DTO
 */
@Data
public class UserVO {
    private String id;
    private String phone;
    private String name;
    private String email;
    private String role;
    private String institutionId;
    private String avatarUrl;
    private String bio;
    private String address;
    private String adopterStatus;
    private String institutionName;
}
