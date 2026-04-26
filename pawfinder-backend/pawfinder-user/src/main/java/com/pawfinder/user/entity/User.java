package com.pawfinder.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.pawfinder.user.constants.AdopterStatusEnum;
import com.pawfinder.user.constants.RoleEnum;
import com.pawfinder.user.constants.UserStatusEnum;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户实体类
 * 对应数据库表 users
 */
@Data
@TableName("users")
public class User {

    @TableId(type = IdType.INPUT)
    private String id;

    private String phone;

    private String name;

    private String email;

    private RoleEnum role;

    private UserStatusEnum status;

    @TableField("institution_id")
    private String institutionId;

    @TableField("avatar_url")
    private String avatarUrl;

    private String bio;

    private String address;

    @TableField("id_card_number")
    private String idCardNumber;

    @TableField("adopter_status")
    private AdopterStatusEnum adopterStatus;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;
}