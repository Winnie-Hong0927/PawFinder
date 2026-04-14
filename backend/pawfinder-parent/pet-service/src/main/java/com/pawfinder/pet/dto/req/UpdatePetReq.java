package com.pawfinder.pet.dto.req;

import lombok.Data;

/**
 * Update Pet Request
 */
@Data
public class UpdatePetReq {

    private String name;
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
    private String status;
}
