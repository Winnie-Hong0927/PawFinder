package com.pawfinder.payment.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 支付流水实体
 */
@Data
@TableName("payment_transactions")
public class PaymentTransaction {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    /** 支付流水号 */
    private String transactionNo;

    /** 订单ID */
    private String orderId;

    /** 支付金额 */
    private BigDecimal amount;

    /** 支付状态: pending, success, failed, refunded */
    private String status;

    /** 支付渠道: alipay */
    private String paymentChannel;

    /** 渠道交易号 */
    private String channelTransactionNo;

    /** 支付时间 */
    private LocalDateTime payTime;

    /** 回调数据 */
    private String callbackData;

    /** 创建时间 */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /** 更新时间 */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
