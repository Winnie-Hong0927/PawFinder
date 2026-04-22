package com.pawfinder.payment.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pawfinder.payment.entity.PaymentTransaction;
import org.apache.ibatis.annotations.Mapper;

/**
 * 支付流水 Mapper
 */
@Mapper
public interface PaymentTransactionMapper extends BaseMapper<PaymentTransaction> {
}
