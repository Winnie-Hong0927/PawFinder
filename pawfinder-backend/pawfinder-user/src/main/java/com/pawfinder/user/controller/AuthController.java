package com.pawfinder.user.controller;

import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.JwtUtil;
import com.pawfinder.user.dto.*;
import com.pawfinder.user.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import static com.pawfinder.common.result.ErrorCode.SEND_VERIFICATION_CODE_FAIL;

@Tag(name = "认证管理")
@RestController
@RequestMapping("/api/user/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "发送验证码")
    @PostMapping("/send-code")
    public Result<String> sendCode(@RequestBody SendCodeRequest request) {
        boolean isSuccess = authService.sendCode(request.getPhone());
        return isSuccess? Result.success("验证码已发送"):Result.fail(SEND_VERIFICATION_CODE_FAIL, "验证码发送失败");
    }

    @Operation(summary = "验证码登录")
    @PostMapping("/verify-code")
    public Result<LoginResponse> verifyCode(@Valid @RequestBody VerifyCodeRequest request) {
        LoginResponse response = authService.verifyCodeAndLogin(request);
        return Result.success(response);
    }

    @Operation(summary = "获取当前用户信息")
    @GetMapping("/me")
    public Result<UserVO> getCurrentUser(HttpServletRequest request) {
        String userId = getUserIdFromRequest(request);
        UserVO user = authService.getCurrentUser(userId);
        return Result.success(user);
    }

    @Operation(summary = "更新当前用户信息")
    @PostMapping("/update/me")
    public Result<UserVO> updateCurrentUser(
            HttpServletRequest request,
            @RequestBody UserUpdateRequest updateRequest) {
        String userId = getUserIdFromRequest(request);
        UserVO user = authService.updateUser(userId, updateRequest);
        return Result.success(user);
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
