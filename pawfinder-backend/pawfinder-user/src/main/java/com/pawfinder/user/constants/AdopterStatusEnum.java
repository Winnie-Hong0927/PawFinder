package com.pawfinder.user.constants;

import com.baomidou.mybatisplus.annotation.EnumValue;
import lombok.Getter;

@Getter
public enum AdopterStatusEnum {
    UNAPPLIED("UNAPPLIED"),
    PENDING("PENDING"),
    APPROVED("APPROVED"),
    REJECTED("REJECTED");

    @EnumValue
    private final String value;

    AdopterStatusEnum(String value) {
        this.value = value;
    }

    public static AdopterStatusEnum fromValue(String value) {
        for (AdopterStatusEnum status : AdopterStatusEnum.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("未知的领养人资质状态值: " + value);
    }
}
