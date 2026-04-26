package com.pawfinder.adoption.feign.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PetDTO {
    private String id;
    private String name;
    private String species;
    private String breed;
    private String age;
    private String gender;
    private String size;
    private List<String> images;
    private String description;
    private List<String> traits;
    private String healthStatus;
    private Boolean vaccinationStatus;
    private Boolean sterilizationStatus;
    private String shelterLocation;
    private BigDecimal adoptionFee;
    private String status;
    private String institutionId;
    private Long applicationCount;
    private LocalDateTime createdAt;
}
