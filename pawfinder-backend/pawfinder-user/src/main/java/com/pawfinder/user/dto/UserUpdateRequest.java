package com.pawfinder.user.dto;

import com.pawfinder.user.constants.AdopterStatusEnum;
import com.pawfinder.user.constants.UserStatusEnum;
import lombok.Data;

/**
 * User update request DTO
 */
@Data
public class UserUpdateRequest {
    private String name;
    private String email;
    private String avatarUrl;
    private String bio;
    private String address;
    private String idCardNumber;
    private AdopterStatusEnum adopterStatus;
    private UserStatusEnum userStatus;
}
