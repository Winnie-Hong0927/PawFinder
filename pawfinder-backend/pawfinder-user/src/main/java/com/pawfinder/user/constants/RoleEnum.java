package com.pawfinder.user.constants;

import com.baomidou.mybatisplus.annotation.EnumValue;
import lombok.Getter;

@Getter
public enum RoleEnum {
    USER("USER"),
    ADMIN("ADMIN"),
    INSTITUTION("INSTITUTION");

    @EnumValue
    private final String value;

    RoleEnum(String value) {
        this.value = value;
    }

    public static RoleEnum fromValue(String value) {
        for (RoleEnum role : RoleEnum.values()) {
            if (role.value.equals(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("未知的角色值: " + value);
    }
}
