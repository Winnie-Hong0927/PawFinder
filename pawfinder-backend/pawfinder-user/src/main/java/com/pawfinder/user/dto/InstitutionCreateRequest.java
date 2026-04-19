package com.pawfinder.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InstitutionCreateRequest {

    @NotBlank(message = "机构名称不能为空")
    private String name;

    private String type;

    private String licenseNumber;

    private String contactPhone;

    private String contactEmail;

    private String address;

    private String province;

    private String city;

    private String district;

    private String description;

    private String logoUrl;

    private String businessHours;
}
