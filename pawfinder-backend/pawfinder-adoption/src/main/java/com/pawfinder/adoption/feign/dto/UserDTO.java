package com.pawfinder.adoption.feign.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserDTO {
    private String id;
    private String phone;
    private String nickname;
    private String avatar;
    private String role;
    private String realName;
    private String idCard;
    private String address;
    private Boolean verified;
    private LocalDateTime createdAt;
}
