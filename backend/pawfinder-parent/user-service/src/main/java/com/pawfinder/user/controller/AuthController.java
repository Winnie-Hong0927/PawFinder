package com.pawfinder.user.controller;

import com.pawfinder.common.dto.resp.ApiResponse;
import com.pawfinder.user.dto.req.LoginReq;
import com.pawfinder.user.dto.req.RegisterReq;
import com.pawfinder.user.dto.req.UpdateUserReq;
import com.pawfinder.user.dto.resp.LoginResp;
import com.pawfinder.user.dto.resp.UserDetailResp;
import com.pawfinder.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * User Controller
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * Register
     */
    @PostMapping("/register")
    public ApiResponse<LoginResp> register(@Valid @RequestBody RegisterReq req) {
        LoginResp resp = userService.register(req);
        return ApiResponse.success("Registration successful", resp);
    }

    /**
     * Login
     */
    @PostMapping("/login")
    public ApiResponse<LoginResp> login(@Valid @RequestBody LoginReq req) {
        LoginResp resp = userService.login(req);
        return ApiResponse.success("Login successful", resp);
    }

    /**
     * Get current user
     */
    @GetMapping("/me")
    public ApiResponse<UserDetailResp> getCurrentUser(@RequestHeader("X-User-Id") Long userId) {
        UserDetailResp user = userService.getUserById(userId);
        return ApiResponse.success(user);
    }

    /**
     * Update current user profile
     */
    @PutMapping("/me")
    public ApiResponse<UserDetailResp> updateCurrentUser(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody UpdateUserReq req) {
        UserDetailResp user = userService.updateUser(userId, req);
        return ApiResponse.success("Profile updated", user);
    }
}
