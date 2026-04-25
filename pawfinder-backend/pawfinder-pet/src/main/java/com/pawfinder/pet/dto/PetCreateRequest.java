package com.pawfinder.pet.dto;

import com.pawfinder.pet.constants.GenderEnum;
import com.pawfinder.pet.constants.HealthStatusEnum;
import com.pawfinder.pet.constants.PetSpeciesEnum;
import com.pawfinder.pet.constants.SizeEnum;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/**
 * Pet create request DTO
 */
@Data
public class PetCreateRequest {
    private String name;
    private PetSpeciesEnum species;
    private String breed;
    private String age;
    private GenderEnum gender;
    private SizeEnum size;
    private List<String> images;
    private String description;
    private List<String> traits;
    private List<HealthStatusEnum> healthStatus;
    private Boolean vaccinationStatus;
    private Boolean sterilizationStatus;
    private String shelterLocation;
    private BigDecimal adoptionFee;
    private String institutionId;
    private String createdBy;
}
