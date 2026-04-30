package com.pawfinder.adoption.constants;

import lombok.Getter;

@Getter
public enum AdoptionStatusEnum {

    /**
     * 待审核
     */
    PENDING("待审核"),

    /**
     * 已通过
     */
    APPROVED("已通过"),

    /**
     * 已拒绝
     */
    REJECTED("已拒绝"),

    /**
     * 已取消
     */
    CANCELED("已取消");

    /**
     * 中文描述
     * -- GETTER --
     *  获取中文描述

     */
    private final String desc;

    AdoptionStatusEnum(String desc) {
        this.desc = desc;
    }

    /**
     * 根据枚举名称字符串获取枚举（常用于数据库值转枚举）
     * @param name 枚举名称（如：PENDING）
     * @return 对应的枚举
     */
    public static AdoptionStatusEnum getByName(String name) {
        if (name == null) {
            return null;
        }
        for (AdoptionStatusEnum status : AdoptionStatusEnum.values()) {
            if (status.name().equals(name)) {
                return status;
            }
        }
        return null;
    }
}
