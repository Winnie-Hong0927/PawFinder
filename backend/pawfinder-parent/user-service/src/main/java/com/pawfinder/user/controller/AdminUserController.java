package com.pawfinder.user.controller;

import com.pawfinder.common.dto.resp.ApiResponse;
import com.pawfinder.user.dto.resp.UserDetailResp;
import com.pawfinder.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin User Controller
 */
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    /**
     * Get all users
     */
    @GetMapping
    public ApiResponse<List<UserDetailResp>> getAllUsers(@RequestParam(required = false) String role) {
        List<UserDetailResp> users;
        if (role != null) {
            users = userService.getUsersByRole(role);
        } else {
            // Get all users (paginated in real implementation)
            users = userService.getUsersByRole(null);
        }
        return ApiResponse.success(users);
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{userId}")
    public ApiResponse<UserDetailResp> getUserById(@PathVariable Long userId) {
        UserDetailResp user = userService.getUserById(userId);
        return ApiResponse.success(user);
    }

    /**
     * Get users by adopter status
     */
    @GetMapping("/adopter-status/{status}")
    public ApiResponse<List<UserDetailResp>> getUsersByAdopterStatus(@PathVariable String status) {
        List<UserDetailResp> users = userService.getUsersByAdopterStatus(status);
        return ApiResponse.success(users);
    }

    /**
     * Update adopter status
     */
    @PutMapping("/{userId}/adopter-status")
    public ApiResponse<?> updateAdopterStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body,
            @RequestHeader("X-User-Id") Long adminId) {
        
        String status = body.get("status");
        if (status == null || status.isEmpty()) {
            return ApiResponse.badRequest("Status is required");
        }
        
        userService.updateAdopterStatus(userId, status, adminId);
        return ApiResponse.success("Adopter status updated");
    }

    /**
     * Get user statistics
     */
    @GetMapping("/stats")
    public ApiResponse<Map<String, Long>> getUserStats() {
        Long totalUsers = userService.getUserCount();
        Long adopters = userService.getUserCountByRole("adopter");
        Long donors = userService.getUserCountByRole("donor");
        Long pending = userService.getUserCountByRole("user");
        
        return ApiResponse.success(Map.of(
                "totalUsers", totalUsers,
                "adopters", adopters,
                "donors", donors,
                "pendingApproval", pending
        ));
    }
}
