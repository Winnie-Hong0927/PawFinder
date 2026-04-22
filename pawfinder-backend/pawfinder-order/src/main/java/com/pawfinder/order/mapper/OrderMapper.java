package com.pawfinder.order.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pawfinder.order.entity.Order;
import org.apache.ibatis.annotations.Mapper;

/**
 * 订单 Mapper
 */
@Mapper
public interface OrderMapper extends BaseMapper<Order> {
}
