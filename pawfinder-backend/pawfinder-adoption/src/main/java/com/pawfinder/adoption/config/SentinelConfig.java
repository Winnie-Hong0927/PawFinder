package com.pawfinder.adoption.config;

import com.alibaba.csp.sentinel.annotation.aspectj.SentinelResourceAspect;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.pawfinder.common.result.Result;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Sentinel 配置类
 */
@Configuration
public class SentinelConfig {

    /**
     * 启用 Sentinel 注解支持
     */
    @Bean
    public SentinelResourceAspect sentinelResourceAspect() {
        return new SentinelResourceAspect();
    }

    /**
     * 通用限流降级处理
     */
    public static Result<Void> handleBlockException(BlockException ex) {
        return Result.error(429, "系统繁忙，请稍后再试");
    }

    /**
     * 通用熔断降级处理
     */
    public static Result<Void> handleFallback(Throwable ex) {
        return Result.error(500, "服务异常: " + ex.getMessage());
    }
}
