package com.pawfinder.order.entity;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderCreateRequest {

    /** 关联申请ID */
    private String applicationId;

    /** 关联宠物ID */
    private String petId;

    /** 订单金额 */
    private BigDecimal amount;

    /** 订单描述 */
    private String description;
}
