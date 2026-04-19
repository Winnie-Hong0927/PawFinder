package com.pawfinder.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

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

    private String status;

    private LocalDateTime createdAt;
}
