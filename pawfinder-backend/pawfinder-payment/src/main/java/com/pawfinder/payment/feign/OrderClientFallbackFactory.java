package com.pawfinder.payment.feign;

import com.pawfinder.common.result.Result;
import com.pawfinder.common.result.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * 订单服务降级工厂
 */
@Slf4j
@Component
public class OrderClientFallbackFactory implements FallbackFactory<OrderClient> {

    @Override
    public OrderClient create(Throwable cause) {
        log.error("订单服务调用失败: {}", cause.getMessage());
        
        return new OrderClient() {
            @Override
            public Result<Map<String, Object>> getOrder(String orderId) {
                return Result.fail(ErrorCode.SERVICE_CALL_FAILED, "订单服务暂不可用");
            }

            @Override
            public Result<Void> updateStatus(String orderId, Map<String, String> request) {
                return Result.fail(ErrorCode.SERVICE_CALL_FAILED, "订单服务暂不可用");
            }
        };
    }
}
