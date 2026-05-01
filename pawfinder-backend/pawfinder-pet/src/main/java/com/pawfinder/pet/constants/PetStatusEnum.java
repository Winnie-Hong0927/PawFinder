package com.pawfinder.pet.constants;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

/**
 * 宠物状态枚举类
 * 用于表示系统中宠物可能的状态
 */
public enum PetStatusEnum {
    AVAILABLE("AVAILABLE"),
    ADOPTED("ADOPTED"),
    UNAVAILABLE("UNAVAILABLE"),
    DELETED("DELETED");

    @Getter
    private final String value;

    private static final Map<String, PetStatusEnum> VALUE_MAP = new HashMap<>();

    static {
        for (PetStatusEnum status : PetStatusEnum.values()) {
            VALUE_MAP.put(status.value, status);
        }
    }

    PetStatusEnum(String value) {
        this.value = value;
    }

    public static PetStatusEnum fromValue(String value) {
        if (value == null || !VALUE_MAP.containsKey(value.toUpperCase())) {
            throw new IllegalArgumentException("未知的状态值: " + value);
        }
        return VALUE_MAP.get(value.toUpperCase());
    }
}
