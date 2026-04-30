package com.pawfinder.adoption.feign;

import com.pawfinder.user.dto.*;
import com.pawfinder.common.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 * 用户服务 Feign 客户端
 * 用于调用用户服务的接口
 */
@FeignClient(name = "user-service", fallbackFactory = UserClientFallbackFactory.class)
public interface UserClient {

    /**
     * 根据用户ID获取用户信息
    */
    @GetMapping("/api/user/v1/users/{userId}")
    Result<UserVO> getUserById(@PathVariable String userId);

    /**
     * 根据Token获取当前用户信息
     */
    @GetMapping("/api/user/v1/auth/me")
    Result<UserVO> getCurrentUser(@RequestHeader("Authorization") String token);
}