package com.pawfinder.adoption.entity;

import com.pawfinder.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class PetVideo extends BaseEntity {
    private Long adoptionId;
    private Long userId;
    private Long petId;
    private String videoUrl;
    private String thumbnailUrl;
    private String description;
    private String status; // pending, approved, rejected
    private String reviewNotes;
    private Long reviewedBy;
    private LocalDateTime nextReminderDate;
}
