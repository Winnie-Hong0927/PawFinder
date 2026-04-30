package com.pawfinder.order.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.pawfinder.adoption.service.AdoptionService;
import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.IdUtil;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.order.entity.Order;
import com.pawfinder.order.entity.OrderStatus;
import com.pawfinder.order.mapper.OrderMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 订单服务
 */
@Slf4j
@Service
public class OrderService extends ServiceImpl<OrderMapper, Order> {

    /**
     * 创建订单
     */
    @Transactional(rollbackFor = Exception.class)
    public Result<Order> createOrder(String userId, String applicationId, String petId, BigDecimal amount, String description) {
        // 一个申请只能创建一个订单
        long count = count(new LambdaQueryWrapper<Order>().eq(Order::getApplicationId, applicationId));
        if (count > 0) {
            return Result.fail(ErrorCode.ORDER_ALREADY_EXIST, "一个领养申请只能创建一个订单");
        }

        // 生成订单号
        String orderNo = generateOrderNo();
        Order order = new Order();
        order.setId(IdUtil.snowflakeId());
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setApplicationId(applicationId);
        order.setPetId(petId);
        order.setAmount(amount);
        order.setStatus(OrderStatus.PENDING);
        order.setDescription(description);
        order.setExpireAt(LocalDateTime.now().plusHours(24));
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        
        save(order);
        log.info("订单创建成功: orderNo={}, userId={}, amount={}", orderNo, userId, amount);
        
        return Result.success(order);
    }

    /**
     * 根据订单号查询
     */
    public Order getByOrderNo(String orderNo) {
        return getOne(new LambdaQueryWrapper<Order>()
                .eq(Order::getOrderNo, orderNo));
    }

    /**
     * 用户订单列表
     */
    public PageResult<Order> getUserOrders(String userId, int page, int size) {
        Page<Order> pageObj = new Page<>(page, size);
        Page<Order> result = page(pageObj, new LambdaQueryWrapper<Order>()
                .eq(Order::getUserId, userId)
                .orderByDesc(Order::getCreatedAt));
        
        long pages = (result.getTotal() + size - 1) / size;
        return new PageResult<>(result.getTotal(), page, size, pages, result.getRecords());
    }

    /**
     * 获取所有订单列表
     */
    public PageResult<Order> getAll(int page, int size) {
        Page<Order> pageObj = new Page<>(page, size);
        Page<Order> result = page(pageObj, new LambdaQueryWrapper<Order>()
                .orderByDesc(Order::getCreatedAt));

        long pages = (result.getTotal() + size - 1) / size;
        return new PageResult<>(result.getTotal(), page, size, pages, result.getRecords());
    }

    /**
     * 更新订单状态
     */
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> updateStatus(String orderNo, String status) {
        // todo 只有真正支付成功之后再回调这个方法修改订单的状态
        Order order = getByOrderNo(orderNo);
        if (order == null) {
            return Result.fail(ErrorCode.ORDER_NOT_FOUND, ErrorCode.ORDER_NOT_FOUND.getMessage());
        }
        
        order.setStatus(OrderStatus.fromValue(status));
        if (OrderStatus.PAID.getCode().equals(status)) {
            order.setPaidAt(LocalDateTime.now());
        }

        order.setUpdatedAt(LocalDateTime.now());
        updateById(order);
        log.info("订单状态更新: orderNo={}, status={}", orderNo, status);
        return Result.success();
    }

    /**
     * 取消订单
     */
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> cancelOrder(String orderNo, String userId) {
        Order order = getByOrderNo(orderNo);
        if (order == null) {
            return Result.fail(ErrorCode.ORDER_NOT_FOUND, ErrorCode.ORDER_NOT_FOUND.getMessage());
        }
        
        if (!order.getUserId().equals(userId)) {
            return Result.fail(ErrorCode.FORBIDDEN, ErrorCode.FORBIDDEN.getMessage());
        }
        
        if (!OrderStatus.PENDING.equals(order.getStatus())) {
            return Result.fail(ErrorCode.ORDER_STATUS_ERROR, "订单状态不允许取消");
        }
        
        order.setStatus(OrderStatus.CANCELED);
        order.setUpdatedAt(LocalDateTime.now());
        updateById(order);
        log.info("订单取消成功: orderNo={}", orderNo);
        return Result.success();
    }

    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        return "PF" + System.currentTimeMillis() + IdUtil.randomNumbers(6);
    }
}
