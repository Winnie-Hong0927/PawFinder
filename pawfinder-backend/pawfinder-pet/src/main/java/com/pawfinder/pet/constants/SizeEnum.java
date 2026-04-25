package com.pawfinder.pet.constants;

import lombok.Getter;

/**
 * SizeEnum 枚举类
 * 用于定义尺寸大小的枚举类型
 */
import lombok.Getter;
import java.util.HashMap;
import java.util.Map;

public enum SizeEnum {
    SMALL("small"),
    MEDIUM("medium"),
    LARGE("large");

    @Getter
    private final String value;

    private static final Map<String, SizeEnum> VALUE_MAP = new HashMap<>();

    static {
        for (SizeEnum size : SizeEnum.values()) {
            VALUE_MAP.put(size.value, size);
        }
    }

    SizeEnum(String value) {
        this.value = value;
    }

    /**
     * 根据字符串 value 获取对应的枚举实例
     *
     * @param value 枚举的 value 字段值（如 "small", "medium", "large"）
     * @return 对应的枚举实例
     * @throws IllegalArgumentException 如果 value 为 null 或不存在对应的枚举
     */
    public static SizeEnum fromValue(String value) {
        if (value == null) {
            throw new IllegalArgumentException("SizeEnum value 不能为 null");
        }
        SizeEnum size = VALUE_MAP.get(value.toLowerCase());
        if (size == null) {
            throw new IllegalArgumentException("未知的身材尺寸值: " + value);
        }
        return size;
    }
}