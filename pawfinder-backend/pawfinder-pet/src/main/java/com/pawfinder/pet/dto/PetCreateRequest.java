package com.pawfinder.pet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class PetCreateRequest {

    @NotBlank(message = "宠物名称不能为空")
    private String name;

    @NotBlank(message = "物种类型不能为空")
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

    private String institutionId;
}
