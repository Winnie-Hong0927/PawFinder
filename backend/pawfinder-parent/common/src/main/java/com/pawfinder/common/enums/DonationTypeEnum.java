package com.pawfinder.common.enums;

/**
 * Donation Type Enum
 */
public enum DonationTypeEnum {
    MONEY("money", "资金捐赠"),
    GOODS("goods", "物资捐赠");

    private final String code;
    private final String description;

    DonationTypeEnum(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static DonationTypeEnum fromCode(String code) {
        for (DonationTypeEnum type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        return MONEY;
    }
}
