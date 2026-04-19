package com.pawfinder.adoption.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ApplicationCreateRequest {

    @NotBlank(message = "宠物ID不能为空")
    private String petId;

    private String reason;

    private String livingCondition;

    private String experience;

    private Boolean hasOtherPets;

    private String otherPetsDetail;

    private List<String> documents;

    private List<String> livingConditionImages;
}
