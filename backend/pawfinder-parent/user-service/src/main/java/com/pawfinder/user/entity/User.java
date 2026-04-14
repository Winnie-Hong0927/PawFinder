package com.pawfinder.user.entity;

import com.pawfinder.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * User Entity
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {

    /**
     * Email (unique)
     */
    private String email;

    /**
     * Password (hashed)
     */
    private String password;

    /**
     * Phone number
     */
    private String phone;

    /**
     * Name
     */
    private String name;

    /**
     * Avatar URL
     */
    private String avatarUrl;

    /**
     * Role: user, adopter, donor, admin
     */
    private String role;

    /**
     * Adopter status: pending, approved, rejected
     */
    private String adopterStatus;

    /**
     * ID card number (encrypted)
     */
    private String idCard;

    /**
     * Address
     */
    private String address;

    /**
     * Bio description
     */
    private String bio;
}
