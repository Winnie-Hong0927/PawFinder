package com.pawfinder.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("users")
public class User implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_STRING)
    private String id;

    private String phone;

    private String name;

    private String email;

    private String passwordHash;

    /**
     * Role: user, admin, institution_admin
     */
    private String role;

    private String institutionId;

    private String avatarUrl;

    private String bio;

    private String address;

    private String idCardNumber;

    /**
     * Adopter status: pending, verified, rejected
     */
    private String adopterStatus;

    @TableField(fill = FieldFill.INSERT)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @TableLogic
    private LocalDateTime deletedAt;
}
