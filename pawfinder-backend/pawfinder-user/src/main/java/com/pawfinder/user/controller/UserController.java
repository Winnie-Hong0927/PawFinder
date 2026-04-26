package com.pawfinder.user.controller;

import com.pawfinder.common.result.Result;
import com.pawfinder.user.dto.UserVO;
import com.pawfinder.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "用户管理")
@RestController
@RequestMapping("/api/user/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "获取用户详情")
    @GetMapping("/{userId}")
    public Result<UserVO> getUserById(@PathVariable String userId) {
        UserVO user = userService.getUserById(userId);
        return Result.success(user);
    }

    @Operation(summary = "根据手机号获取用户")
    @GetMapping("/phone/{phone}")
    public Result<UserVO> getUserByPhone(@PathVariable String phone) {
        UserVO user = userService.getUserByPhone(phone);
        return Result.success(user);
    }
}
