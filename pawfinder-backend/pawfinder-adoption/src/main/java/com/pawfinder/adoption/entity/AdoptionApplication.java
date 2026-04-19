package com.pawfinder.adoption.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

/**
 * Adoption application entity
 */
@TableName("adoption_applications")
public class AdoptionApplication {

    @TableId(type = IdType.INPUT)
    private String id;
    private String petId;
    private String userId;
    private String reason;
    private String livingCondition;
    private String experience;
    private Boolean hasOtherPets;
    private String otherPetsDetail;
    private String documents;
    private String livingConditionImages;
    private String status;
    private String adminNotes;
    private String reviewedBy;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdoptionApplication() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPetId() {
        return petId;
    }

    public void setPetId(String petId) {
        this.petId = petId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
