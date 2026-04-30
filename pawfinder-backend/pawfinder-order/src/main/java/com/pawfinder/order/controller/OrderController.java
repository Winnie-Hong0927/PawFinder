package com.pawfinder.order.controller;

import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.JwtUtil;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.order.entity.Order;
import com.pawfinder.order.entity.OrderCreateRequest;
import com.pawfinder.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
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
    public Result<Order> createOrder(HttpServletRequest request, @RequestBody OrderCreateRequest orderCreateRequest) {
        String userId = getUserIdFromRequest(request);
        String applicationId = orderCreateRequest.getApplicationId();
        String petId = orderCreateRequest.getPetId();
        BigDecimal amount = orderCreateRequest.getAmount(); // todo amount需要和宠物的价钱一样 从前端传入
        String  description = orderCreateRequest.getDescription();
        return orderService.createOrder(userId, applicationId, petId, amount, description);
    }

    /**
     * 获取用户订单列表
     */
    @GetMapping("/orders")
    @Operation(summary = "获取用户订单列表")
    public Result<PageResult<Order>> getUserOrders(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = getUserIdFromRequest(request);
        PageResult<Order> result = orderService.getUserOrders(userId, page, size);
        return Result.success(result);
    }

    @GetMapping("/all")
    @Operation(summary = "获取所有订单列表")
    public Result<PageResult<Order>> getAll(
            // todo 需要鉴权 只有管理员才能看到所有信息
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResult<Order> result = orderService.getAll(page, size);
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
    public Result<Void> cancelOrder(HttpServletRequest request, @PathVariable String orderNo) {
        String userId = getUserIdFromRequest(request);
        return orderService.cancelOrder(orderNo, userId);
    }

    /**
     * 内部接口 - 更新订单状态（供支付服务调用）
     */
    @PostMapping("/internal/update/status")
    @Operation(summary = "更新订单状态（内部接口）")
    public Result<Void> updateStatus(@RequestParam String orderNo, @RequestParam String status) {
        return orderService.updateStatus(orderNo, status);
    }

    private String getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        String token = authHeader.substring(7);
        return JwtUtil.getUserId(token);
    }
}
