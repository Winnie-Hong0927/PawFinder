package com.pawfinder.adoption.feign;

import com.pawfinder.common.result.Result;
import com.pawfinder.common.result.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

/**
 * 用户服务 Feign 降级工厂
 */
@Slf4j
@Component
public class UserClientFallbackFactory implements FallbackFactory<UserClient> {

    @Override
    public UserClient create(Throwable cause) {
        log.error("用户服务调用失败: {}", cause.getMessage());
        
        return new UserClient() {
            @Override
            public Result<Map<String, Object>> getUserById(@PathVariable("id") String id) {
                log.error("获取用户信息降级, userId: {}", id);
                return Result.fail(ErrorCode.SERVICE_UNAVAILABLE, "用户服务暂时不可用");
            }

            @Override
            public Result<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String token) {
                log.error("获取当前用户信息降级");
                return Result.fail(ErrorCode.SERVICE_UNAVAILABLE, "用户服务暂时不可用");
            }

            @Override
            public Result<Map<String, Object>> validateToken(@RequestHeader("Authorization") String token) {
                log.error("验证Token降级");
                return Result.fail(ErrorCode.SERVICE_UNAVAILABLE, "用户服务暂时不可用");
            }
        };
    }
}
