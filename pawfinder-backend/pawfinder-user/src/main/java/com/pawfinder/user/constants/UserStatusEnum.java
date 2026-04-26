package com.pawfinder.user.constants;

import com.baomidou.mybatisplus.annotation.EnumValue;
import lombok.Getter;

@Getter
public enum UserStatusEnum {
    AVAILABLE("AVAILABLE"),
    UNAVAILABLE("UNAVAILABLE"),
    DELETED("DELETED");

    @EnumValue
    private final String value;

    UserStatusEnum(String value) {
        this.value = value;
    }

    public static UserStatusEnum fromValue(String value) {
        for (UserStatusEnum status : UserStatusEnum.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("未知的用户状态值: " + value);
    }
}