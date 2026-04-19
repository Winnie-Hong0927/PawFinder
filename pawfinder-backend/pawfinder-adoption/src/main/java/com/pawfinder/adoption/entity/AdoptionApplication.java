package com.pawfinder.adoption.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("adoption_applications")
public class AdoptionApplication implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_STRING)
    private String id;

    private String petId;

    private String userId;

    private String reason;

    private String livingCondition;

    private String experience;

    private Boolean hasOtherPets;

    private String otherPetsDetail;

    /**
     * Documents stored as JSON array
     */
    private String documents;

    /**
     * Living condition images stored as JSON array
     */
    private String livingConditionImages;

    /**
     * Status: pending, approved, rejected, canceled
     */
    private String status;

    private String adminNotes;

    private String reviewedBy;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reviewedAt;

    @TableField(fill = FieldFill.INSERT)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @TableLogic
    private LocalDateTime deletedAt;
}
