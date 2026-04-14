package com.pawfinder.common.enums;

/**
 * Pet Status Enum
 */
public enum PetStatusEnum {
    AVAILABLE("available", "可领养"),
    PENDING("pending", "待审核"),
    ADOPTED("adopted", "已领养"),
    UNAVAILABLE("unavailable", "不可领养");

    private final String code;
    private final String description;

    PetStatusEnum(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static PetStatusEnum fromCode(String code) {
        for (PetStatusEnum status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return AVAILABLE;
    }
}
