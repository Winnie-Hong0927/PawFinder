package com.pawfinder.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("institutions")
public class Institution implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_STRING)
    private String id;

    private String name;

    /**
     * Type: shelter, rescue, hospital, other
     */
    private String type;

    private String licenseNumber;

    private String contactPhone;

    private String contactEmail;

    private String address;

    private String province;

    private String city;

    private String district;

    private String description;

    private String logoUrl;

    private String businessHours;

    /**
     * Status: active, suspended, closed
     */
    private String status;

    @TableField(fill = FieldFill.INSERT)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @TableLogic
    private LocalDateTime deletedAt;
}
