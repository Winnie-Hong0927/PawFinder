package com.pawfinder.adoption.feign.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InstitutionDTO {
    private String id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String email;
    private String logo;
    private String licenseNumber;
    private String status;
    private String userId;
    private LocalDateTime createdAt;
}
