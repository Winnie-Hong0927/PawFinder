package com.pawfinder.user.dto.req;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Update User Request
 */
@Data
public class UpdateUserReq {

    private String name;

    private String phone;

    private String avatarUrl;

    private String address;

    private String bio;

    private String idCard;
}
