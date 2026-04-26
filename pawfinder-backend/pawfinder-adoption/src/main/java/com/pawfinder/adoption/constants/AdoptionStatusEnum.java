package com.pawfinder.adoption.constants;

import com.baomidou.mybatisplus.annotation.EnumValue;
import lombok.Getter;

@Getter
public enum AdoptionStatusEnum {
    PENDING("PENDING"),
    APPROVED("APPROVED"),
    REJECTED("REJECTED"),
    CANCELED("CANCELED");

    @EnumValue
    private final String value;

    AdoptionStatusEnum(String value) {
        this.value = value;
    }

    public static AdoptionStatusEnum fromValue(String value) {
        for (AdoptionStatusEnum status : AdoptionStatusEnum.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("未知的领养申请状态: " + value);
    }
}