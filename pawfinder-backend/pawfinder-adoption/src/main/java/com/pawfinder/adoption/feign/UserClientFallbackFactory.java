package com.pawfinder.adoption.feign;

import com.pawfinder.adoption.feign.dto.UserDTO;
import com.pawfinder.common.result.Result;
import feign.hystrix.FallbackFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserClientFallbackFactory implements FallbackFactory<UserClient> {

    @Override
    public UserClient create(Throwable cause) {
        return new UserClient() {
            @Override
            public Result<UserDTO> getUserById(String userId) {
                log.error("Feign调用 user-service.getUserById 失败, userId: {}, error: {}", userId, cause.getMessage());
                return Result.fail("调用用户服务失败");
            }

            @Override
            public Result<UserDTO> getCurrentUser(String token) {
                log.error("Feign调用 user-service.getCurrentUser 失败, error: {}", cause.getMessage());
                return Result.fail("调用用户服务失败");
            }
        };
    }
}