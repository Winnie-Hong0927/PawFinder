package com.pawfinder.order.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.util.IdUtil;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.order.entity.Order;
import com.pawfinder.order.mapper.OrderMapper;
import lombok.extern.slf4j.Slf4j;
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
    public Order createOrder(String userId, String applicationId, String petId, BigDecimal amount, String description) {
        // 生成订单号
        String orderNo = generateOrderNo();
        
        Order order = new Order();
        order.setId(UUID.randomUUID().toString());
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setApplicationId(applicationId);
        order.setPetId(petId);
        order.setAmount(amount);
        order.setStatus("pending");
        order.setDescription(description);
        order.setExpireAt(LocalDateTime.now().plusHours(24)); // 24小时过期
        
        save(order);
        log.info("订单创建成功: orderNo={}, userId={}, amount={}", orderNo, userId, amount);
        
        return order;
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
     * 更新订单状态
     */
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(String orderNo, String status) {
        Order order = getByOrderNo(orderNo);
        if (order == null) {
            throw new BusinessException(ErrorCode.ORDER_NOT_FOUND);
        }
        
        order.setStatus(status);
        if ("paid".equals(status)) {
            order.setPaidAt(LocalDateTime.now());
        }
        
        updateById(order);
        log.info("订单状态更新: orderNo={}, status={}", orderNo, status);
    }

    /**
     * 取消订单
     */
    @Transactional(rollbackFor = Exception.class)
    public void cancelOrder(String orderNo, String userId) {
        Order order = getByOrderNo(orderNo);
        if (order == null) {
            throw new BusinessException(ErrorCode.ORDER_NOT_FOUND);
        }
        
        if (!order.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        
        if (!"pending".equals(order.getStatus())) {
            throw new BusinessException(ErrorCode.ORDER_STATUS_ERROR, "订单状态不允许取消");
        }
        
        order.setStatus("canceled");
        updateById(order);
        log.info("订单取消成功: orderNo={}", orderNo);
    }

    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        return "PF" + System.currentTimeMillis() + IdUtil.randomNumbers(6);
    }
}
