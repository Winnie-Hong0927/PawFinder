package com.pawfinder.order.entity;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum OrderStatus {

    PENDING("PENDING"),
    PAID("PAID"),
    CANCELED("CANCELED"),
    REFUNDED("REFUNDED");

    // 数据库存储的值：大写字符串
    @EnumValue  // MyBatis-Plus 自动映射
    @JsonValue  // JSON 序列化返回大写
    private final String code;

    OrderStatus(String code) {
        this.code = code;
    }

    /**
     * 忽略大小写，从字符串转换为枚举
     * 传入 pending / Pending / PENDING 都能识别
     */
    public static OrderStatus fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (OrderStatus status : values()) {
            if (status.code.equalsIgnoreCase(value)) {
                return status;
            }
        }
        return null;
    }

}