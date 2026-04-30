package com.pawfinder.adoption.entity;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Adoption record entity
 */
@TableName("adoption_records")
@Data
public class AdoptionRecord {

    @TableId(type = IdType.INPUT)
    private String id;
    private String applicationId;
    private String petId;
    private String userId;
    private String adopterName;
    private String adopterPhone;
    private String adopterAddress;
    private LocalDateTime adoptionDate;
    private String contractUrl;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}