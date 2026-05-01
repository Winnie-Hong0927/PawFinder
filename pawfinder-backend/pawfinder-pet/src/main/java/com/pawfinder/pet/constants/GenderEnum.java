package com.pawfinder.pet.constants;

import lombok.Getter;

import lombok.Getter;
import java.util.HashMap;
import java.util.Map;

public enum GenderEnum {
    FEMALE("FEMALE"),
    MALE("MALE");

    @Getter
    private final String value;

    private static final Map<String, GenderEnum> VALUE_MAP = new HashMap<>();

    static {
        for (GenderEnum gender : GenderEnum.values()) {
            VALUE_MAP.put(gender.value, gender);
        }
    }

    GenderEnum(String value) {
        this.value = value;
    }

    /**
     * 根据字符串 value 获取对应的枚举实例
     *
     * @param value 枚举的 value 字段值（如 "female", "name"）
     * @return 对应的枚举实例
     * @throws IllegalArgumentException 如果 value 为 null 或不存在对应的枚举
     */
    public static GenderEnum fromValue(String value) {
        if (value == null) {
            throw new IllegalArgumentException("GenderEnum value 不能为 null");
        }
        GenderEnum gender = VALUE_MAP.get(value.toUpperCase());
        if (gender == null) {
            throw new IllegalArgumentException("未知的性别值: " + value);
        }
        return gender;
    }
}
