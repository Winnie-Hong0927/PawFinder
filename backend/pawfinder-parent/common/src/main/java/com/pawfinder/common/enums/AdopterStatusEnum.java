package com.pawfinder.common.enums;

/**
 * Adopter Status Enum
 */
public enum AdopterStatusEnum {
    PENDING("pending", "待审核"),
    APPROVED("approved", "已认证"),
    REJECTED("rejected", "未通过");

    private final String code;
    private final String description;

    AdopterStatusEnum(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static AdopterStatusEnum fromCode(String code) {
        for (AdopterStatusEnum status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return PENDING;
    }
}
