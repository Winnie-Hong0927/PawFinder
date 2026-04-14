package com.pawfinder.pet.dto.req;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Create Pet Request
 */
@Data
public class CreatePetReq {

    @NotBlank(message = "Pet name cannot be empty")
    private String name;

    @NotBlank(message = "Species cannot be empty")
    private String species;

    private String breed;
    private String age;
    private String gender;
    private String size;
    private String images;
    private String traits;
    private String healthStatus;
    private String description;
    private String shelterLocation;
    private String shelterContact;
    private Boolean isVaccinated;
    private Boolean isNeutered;
    private String rescueStory;
    private Integer adoptionFee;
}
