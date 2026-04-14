package com.pawfinder.common.enums;

/**
 * Adoption Status Enum
 */
public enum AdoptionStatusEnum {
    PENDING("pending", "待审核"),
    APPROVED("approved", "已通过"),
    REJECTED("rejected", "已拒绝"),
    ACTIVE("active", "领养中"),
    CANCELLED("cancelled", "已取消"),
    TERMINATED("terminated", "已终止");

    private final String code;
    private final String description;

    AdoptionStatusEnum(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static AdoptionStatusEnum fromCode(String code) {
        for (AdoptionStatusEnum status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return PENDING;
    }
}
