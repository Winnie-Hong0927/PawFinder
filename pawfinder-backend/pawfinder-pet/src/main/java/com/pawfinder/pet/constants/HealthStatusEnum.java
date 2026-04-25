package com.pawfinder.pet.constants;

import lombok.Getter;
import java.util.HashMap;
import java.util.Map;

/**
 * 宠物健康状态枚举
 */
public enum HealthStatusEnum {
    HEALTHY("healthy"),
    SICK("sick"),
    RECOVERING("recovering"),
    DISABLED("disabled"),
    SENIOR("senior"),
    PREGNANT("pregnant"),
    LACTATING("lactating"),
    SPECIAL_CARE("special_care");

    @Getter
    private final String value;

    private static final Map<String, HealthStatusEnum> VALUE_MAP = new HashMap<>();

    static {
        for (HealthStatusEnum status : HealthStatusEnum.values()) {
            VALUE_MAP.put(status.value, status);
        }
    }

    HealthStatusEnum(String value) {
        this.value = value;
    }

    public static HealthStatusEnum fromValue(String value) {
        if (value == null) return null;
        String lowerValue = value.toLowerCase();
        if (!VALUE_MAP.containsKey(lowerValue)) {
            throw new IllegalArgumentException("未知的健康状态值: " + value);
        }
        return VALUE_MAP.get(lowerValue);
    }
}