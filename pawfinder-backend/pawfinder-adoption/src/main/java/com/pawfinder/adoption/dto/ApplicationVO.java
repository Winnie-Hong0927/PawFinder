package com.pawfinder.adoption.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Application view object DTO
 */
@Data
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
    private LocalDateTime updatedAt;
}
