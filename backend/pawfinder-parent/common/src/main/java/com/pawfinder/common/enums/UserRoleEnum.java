package com.pawfinder.common.enums;

/**
 * User Role Enum
 */
public enum UserRoleEnum {
    USER("user", "普通用户"),
    ADOPTER("adopter", "领养人"),
    DONOR("donor", "捐赠人"),
    ADMIN("admin", "管理员");

    private final String code;
    private final String description;

    UserRoleEnum(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static UserRoleEnum fromCode(String code) {
        for (UserRoleEnum role : values()) {
            if (role.code.equals(code)) {
                return role;
            }
        }
        return USER;
    }
}
