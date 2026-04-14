package com.pawfinder.pet.dto.resp;

import com.alibaba.fastjson2.annotation.JSONField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Pet Detail Response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetDetailResp {

    private Long id;
    private String name;
    private String species;
    private String speciesDesc;
    private String breed;
    private String age;
    private String gender;
    private String size;
    private List<String> images;
    private List<String> traits;
    private String healthStatus;
    private String description;
    private String status;
    private String statusDesc;
    private String shelterLocation;
    private String shelterContact;
    private Boolean isVaccinated;
    private Boolean isNeutered;
    private String rescueStory;
    private Integer adoptionFee;
    private Integer viewCount;
    private LocalDateTime createdAt;
}
