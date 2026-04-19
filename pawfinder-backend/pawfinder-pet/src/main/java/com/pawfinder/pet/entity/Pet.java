package com.pawfinder.pet.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("pets")
public class Pet implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_STRING)
    private String id;

    private String name;

    /**
     * Species: dog, cat, rabbit, other
     */
    private String species;

    private String breed;

    private String age;

    /**
     * Gender: male, female
     */
    private String gender;

    /**
     * Size: small, medium, large
     */
    private String size;

    /**
     * Image URLs stored as JSON array
     */
    private String images;

    private String description;

    /**
     * Personality traits stored as JSON array
     */
    private String traits;

    private String healthStatus;

    private Boolean vaccinationStatus;

    private Boolean sterilizationStatus;

    private String shelterLocation;

    private BigDecimal adoptionFee;

    /**
     * Status: available, pending, adopted, offline
     */
    private String status;

    private String institutionId;

    private String createdBy;

    @TableField(fill = FieldFill.INSERT)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @TableLogic
    private LocalDateTime deletedAt;
}
