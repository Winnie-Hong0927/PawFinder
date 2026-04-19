package com.pawfinder.adoption.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Application view object DTO
 */
public class ApplicationVO {

    private String id;
    private String petId;
    private String petName;
    private String petImage;
    private String userId;
    private String userName;
    private String userPhone;
    private String reason;
    private String livingCondition;
    private String experience;
    private Boolean hasOtherPets;
    private String otherPetsDetail;
    private List<String> documents;
    private List<String> livingConditionImages;
    private String status;
    private String adminNotes;
    private String reviewedBy;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;

    public ApplicationVO() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPetId() { return petId; }
    public void setPetId(String petId) { this.petId = petId; }

    public String getPetName() { return petName; }
    public void setPetName(String petName) { this.petName = petName; }

    public String getPetImage() { return petImage; }
    public void setPetImage(String petImage) { this.petImage = petImage; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getLivingCondition() { return livingCondition; }
    public void setLivingCondition(String livingCondition) { this.livingCondition = livingCondition; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public Boolean getHasOtherPets() { return hasOtherPets; }
    public void setHasOtherPets(Boolean hasOtherPets) { this.hasOtherPets = hasOtherPets; }

    public String getOtherPetsDetail() { return otherPetsDetail; }
    public void setOtherPetsDetail(String otherPetsDetail) { this.otherPetsDetail = otherPetsDetail; }

    public List<String> getDocuments() { return documents; }
    public void setDocuments(List<String> documents) { this.documents = documents; }

    public List<String> getLivingConditionImages() { return livingConditionImages; }
    public void setLivingConditionImages(List<String> livingConditionImages) { this.livingConditionImages = livingConditionImages; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
