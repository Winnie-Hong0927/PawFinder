package com.pawfinder.user.service;

import com.pawfinder.common.enums.AdopterStatusEnum;
import com.pawfinder.common.enums.UserRoleEnum;
import com.pawfinder.common.exception.BusinessException;
import com.pawfinder.common.utils.JwtUtils;
import com.pawfinder.user.dto.req.LoginReq;
import com.pawfinder.user.dto.req.RegisterReq;
import com.pawfinder.user.dto.req.UpdateUserReq;
import com.pawfinder.user.dto.resp.LoginResp;
import com.pawfinder.user.dto.resp.UserDetailResp;
import com.pawfinder.user.entity.User;
import com.pawfinder.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * User Service
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final JwtUtils jwtUtils;

    /**
     * Register new user
     */
    @Transactional
    public LoginResp register(RegisterReq req) {
        // Check if email already exists
        User existingUser = userMapper.selectByEmail(req.getEmail());
        if (existingUser != null) {
            throw new BusinessException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword()); // TODO: Hash password
        user.setName(req.getName());
        user.setPhone(req.getPhone());
        user.setRole(req.getRole() != null ? req.getRole() : UserRoleEnum.USER.getCode());
        user.setAdopterStatus(AdopterStatusEnum.PENDING.getCode());
        user.setCreatedAt(LocalDateTime.now());

        userMapper.insert(user);

        // Generate token
        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole());

        return buildLoginResp(user, token);
    }

    /**
     * Login
     */
    public LoginResp login(LoginReq req) {
        // Find user by email
        User user = userMapper.selectByEmail(req.getEmail());
        if (user == null) {
            throw new BusinessException(401, "Invalid email or password");
        }

        // Check password (TODO: Use proper password hashing)
        if (!req.getPassword().equals(user.getPassword())) {
            throw new BusinessException(401, "Invalid email or password");
        }

        // Generate token
        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole());

        return buildLoginResp(user, token);
    }

    /**
     * Get user by ID
     */
    public UserDetailResp getUserById(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(404, "User not found");
        }
        return buildUserDetailResp(user);
    }

    /**
     * Get user by email
     */
    public UserDetailResp getUserByEmail(String email) {
        User user = userMapper.selectByEmail(email);
        if (user == null) {
            throw new BusinessException(404, "User not found");
        }
        return buildUserDetailResp(user);
    }

    /**
     * Update user profile
     */
    @Transactional
    public UserDetailResp updateUser(Long userId, UpdateUserReq req) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(404, "User not found");
        }

        if (req.getName() != null) {
            user.setName(req.getName());
        }
        if (req.getPhone() != null) {
            user.setPhone(req.getPhone());
        }
        if (req.getAvatarUrl() != null) {
            user.setAvatarUrl(req.getAvatarUrl());
        }
        if (req.getAddress() != null) {
            user.setAddress(req.getAddress());
        }
        if (req.getBio() != null) {
            user.setBio(req.getBio());
        }
        if (req.getIdCard() != null) {
            user.setIdCard(req.getIdCard());
        }
        user.setUpdatedAt(LocalDateTime.now());
        user.setUpdatedBy(userId);

        userMapper.update(user);

        return buildUserDetailResp(user);
    }

    /**
     * Update adopter status (admin only)
     */
    @Transactional
    public void updateAdopterStatus(Long userId, String status, Long adminId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(404, "User not found");
        }

        user.setAdopterStatus(status);
        user.setUpdatedAt(LocalDateTime.now());
        user.setUpdatedBy(adminId);

        // If approved, update role to adopter
        if (AdopterStatusEnum.APPROVED.getCode().equals(status)) {
            user.setRole(UserRoleEnum.ADOPTER.getCode());
        }

        userMapper.update(user);
    }

    /**
     * Get users by role
     */
    public List<UserDetailResp> getUsersByRole(String role) {
        List<User> users = userMapper.selectByRole(role);
        return users.stream().map(this::buildUserDetailResp).toList();
    }

    /**
     * Get users by adopter status
     */
    public List<UserDetailResp> getUsersByAdopterStatus(String status) {
        List<User> users = userMapper.selectByAdopterStatus(status);
        return users.stream().map(this::buildUserDetailResp).toList();
    }

    /**
     * Get user count
     */
    public Long getUserCount() {
        return userMapper.count();
    }

    /**
     * Get user count by role
     */
    public Long getUserCountByRole(String role) {
        return userMapper.countByRole(role);
    }

    /**
     * Build login response
     */
    private LoginResp buildLoginResp(User user, String token) {
        return LoginResp.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .adopterStatus(user.getAdopterStatus())
                .build();
    }

    /**
     * Build user detail response
     */
    private UserDetailResp buildUserDetailResp(User user) {
        UserRoleEnum roleEnum = UserRoleEnum.fromCode(user.getRole());
        AdopterStatusEnum statusEnum = AdopterStatusEnum.fromCode(user.getAdopterStatus());

        return UserDetailResp.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .name(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .roleDesc(roleEnum.getDescription())
                .adopterStatus(user.getAdopterStatus())
                .adopterStatusDesc(statusEnum.getDescription())
                .address(user.getAddress())
                .bio(user.getBio())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
