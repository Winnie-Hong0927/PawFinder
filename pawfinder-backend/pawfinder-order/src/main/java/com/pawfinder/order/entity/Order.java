package com.pawfinder.order.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单实体
 */
@Data
@TableName("orders")
public class Order {

    @TableId(type = IdType.INPUT)
    private String id;

    /** 订单号 */
    private String orderNo;

    /** 用户ID */
    private String userId;

    /** 关联申请ID */
    private String applicationId;

    /** 关联宠物ID */
    private String petId;

    /** 订单金额 */
    private BigDecimal amount;

    /** 订单状态: pending, paid, canceled, refunded */
    private OrderStatus status;

    /** 支付方式 */
    private String paymentMethod;

    /** 支付时间 */
    private LocalDateTime paidAt;

    /** 过期时间 */
    private LocalDateTime expireAt;

    /** 订单描述 */
    private String description;

    /** 创建时间 */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /** 更新时间 */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    /** 删除时间 */
    @TableLogic
    private LocalDateTime deletedAt;
}
