package com.pawfinder.order.controller;

import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.order.entity.Order;
import com.pawfinder.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

/**
 * 订单控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/order/v1")
@Tag(name = "订单管理", description = "订单创建、查询、取消接口")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * 创建订单
     */
    @PostMapping("/orders")
    @Operation(summary = "创建订单")
    public Result<Order> createOrder(@RequestBody Map<String, Object> request,
                                     @RequestHeader(value = "X-User-Id", required = false) String userId) {
        String applicationId = (String) request.get("applicationId");
        String petId = (String) request.get("petId");
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String description = (String) request.get("description");
        
        Order order = orderService.createOrder(userId, applicationId, petId, amount, description);
        return Result.success(order);
    }

    /**
     * 获取用户订单列表
     */
    @GetMapping("/orders")
    @Operation(summary = "获取用户订单列表")
    public Result<PageResult<Order>> getUserOrders(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResult<Order> result = orderService.getUserOrders(userId, page, size);
        return Result.success(result);
    }

    /**
     * 获取订单详情
     */
    @GetMapping("/orders/{orderNo}")
    @Operation(summary = "获取订单详情")
    public Result<Order> getOrder(@PathVariable String orderNo) {
        Order order = orderService.getByOrderNo(orderNo);
        if (order == null) {
            return Result.fail(100404, "订单不存在");
        }
        return Result.success(order);
    }

    /**
     * 取消订单
     */
    @PostMapping("/orders/{orderNo}/cancel")
    @Operation(summary = "取消订单")
    public Result<Void> cancelOrder(@PathVariable String orderNo,
                                    @RequestHeader(value = "X-User-Id", required = false) String userId) {
        orderService.cancelOrder(orderNo, userId);
        return Result.success();
    }

    /**
     * 内部接口 - 更新订单状态（供支付服务调用）
     */
    @PutMapping("/internal/orders/{orderNo}/status")
    @Operation(summary = "更新订单状态（内部接口）")
    public Result<Void> updateStatus(@PathVariable String orderNo, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        orderService.updateStatus(orderNo, status);
        return Result.success();
    }
}
