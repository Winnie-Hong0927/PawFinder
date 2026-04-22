package com.pawfinder.payment.feign;

import com.pawfinder.common.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 订单服务 Feign 客户端
 */
@FeignClient(name = "pawfinder-order", path = "/api/order/v1", fallbackFactory = OrderClientFallbackFactory.class)
public interface OrderClient {

    /**
     * 获取订单详情
     */
    @GetMapping("/orders/{orderId}")
    Result<Map<String, Object>> getOrder(@PathVariable("orderId") String orderId);

    /**
     * 更新订单状态
     */
    @PutMapping("/orders/{orderId}/status")
    Result<Void> updateStatus(@PathVariable("orderId") String orderId, @RequestBody Map<String, String> request);
}
