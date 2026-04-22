package com.pawfinder.adoption.feign;

import com.pawfinder.common.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

/**
 * 用户服务 Feign 客户端
 * 用于调用用户服务的接口
 */
@FeignClient(name = "user-service", fallbackFactory = UserClientFallbackFactory.class)
public interface UserClient {

    /**
     * 根据用户ID获取用户信息
     */
    @GetMapping("/api/user/v1/internal/users/{id}")
    Result<Map<String, Object>> getUserById(@PathVariable("id") String id);

    /**
     * 根据Token获取当前用户信息
     */
    @GetMapping("/api/user/v1/users/me")
    Result<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String token);

    /**
     * 验证Token有效性
     */
    @GetMapping("/api/user/v1/internal/auth/validate")
    Result<Map<String, Object>> validateToken(@RequestHeader("Authorization") String token);
}
