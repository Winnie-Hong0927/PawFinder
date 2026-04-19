package com.pawfinder.adoption.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Application create request DTO
 */
public class ApplicationCreateRequest {

    @NotBlank(message = "宠物ID不能为空")
    private String petId;

    private String reason;
    private String livingCondition;
    private String experience;
    private Boolean hasOtherPets;
    private String otherPetsDetail;
    private String documents;
    private String livingConditionImages;

    public ApplicationCreateRequest() {
    }

    public String getPetId() {
        return petId;
    }

    public void setPetId(String petId) {
        this.petId = petId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getLivingCondition() {
        return livingCondition;
    }

    public void setLivingCondition(String livingCondition) {
        this.livingCondition = livingCondition;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public Boolean getHasOtherPets() {
        return hasOtherPets;
    }

    public void setHasOtherPets(Boolean hasOtherPets) {
        this.hasOtherPets = hasOtherPets;
    }

    public String getOtherPetsDetail() {
        return otherPetsDetail;
    }

    public void setOtherPetsDetail(String otherPetsDetail) {
        this.otherPetsDetail = otherPetsDetail;
    }

    public String getDocuments() {
        return documents;
    }

    public void setDocuments(String documents) {
        this.documents = documents;
    }

    public String getLivingConditionImages() {
        return livingConditionImages;
    }

    public void setLivingConditionImages(String livingConditionImages) {
        this.livingConditionImages = livingConditionImages;
    }
}
