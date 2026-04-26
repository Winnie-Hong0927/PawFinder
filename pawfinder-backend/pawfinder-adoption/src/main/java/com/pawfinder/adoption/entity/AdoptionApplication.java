package com.pawfinder.adoption.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.pawfinder.adoption.constants.AdoptionStatusEnum;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Adoption application entity
 */
@TableName("adoption_applications")
@Data
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
    private AdoptionStatusEnum status; // 状态: PENDING, APPROVED, REJECTED, CANCELED
    private String adminNotes;
    private String reviewedBy;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
