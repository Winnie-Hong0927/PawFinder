package com.pawfinder.user.service;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.LineCaptcha;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.util.IdUtil;
import com.pawfinder.common.util.JwtUtil;
import com.pawfinder.user.dto.*;
import com.pawfinder.user.entity.Institution;
import com.pawfinder.user.entity.User;
import com.pawfinder.user.mapper.InstitutionMapper;
import com.pawfinder.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final InstitutionMapper institutionMapper;
    private final StringRedisTemplate redisTemplate;

    private static final String SMS_CODE_PREFIX = "sms:code:";
    private static final String CAPTCHA_PREFIX = "captcha:";

    /**
     * Send verification code
     */
    public String sendCode(String phone) {
        // Generate 6-digit code
        String code = String.valueOf((int) ((Math.random() * 9 + 1) * 100000));

        // Store in Redis with 5 minutes expiration
        String key = SMS_CODE_PREFIX + phone;
        redisTemplate.opsForValue().set(key, code, 5, TimeUnit.MINUTES);

        log.info("SMS code sent to {}: {}", phone, code);

        // In production, integrate with SMS gateway here
        // For development, just return the code
        return code;
    }

    /**
     * Verify code and login/register
     */
    @Transactional
    public LoginResponse verifyCodeAndLogin(VerifyCodeRequest request) {
        String phone = request.getPhone();
        String code = request.getCode();

        // Verify code
        String key = SMS_CODE_PREFIX + phone;
        String storedCode = redisTemplate.opsForValue().get(key);

        if (storedCode == null || !storedCode.equals(code)) {
            throw BusinessException.INVALID_VERIFICATION_CODE;
        }

        // Delete used code
        redisTemplate.delete(key);

        // Find or create user
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getPhone, phone)
        );

        if (user == null) {
            user = createNewUser(phone);
        }

        // Generate JWT token
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("phone", user.getPhone());
        String token = JwtUtil.generateToken(user.getId(), claims);

        // Build response
        UserVO userVO = buildUserVO(user);
        return new LoginResponse(token, userVO);
    }

    private User createNewUser(String phone) {
        User user = new User();
        user.setId(IdUtil.snowflakeId());
        user.setPhone(phone);
        user.setName("用户" + phone.substring(phone.length() - 4));
        user.setRole("user");
        user.setAdopterStatus("pending");
        userMapper.insert(user);
        log.info("New user created: {}", user.getId());
        return user;
    }

    /**
     * Get current user info
     */
    public UserVO getCurrentUser(String userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw BusinessException.USER_NOT_FOUND;
        }
        return buildUserVO(user);
    }

    /**
     * Update user profile
     */
    @Transactional
    public UserVO updateUser(String userId, UserUpdateRequest request) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw BusinessException.USER_NOT_FOUND;
        }

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getIdCardNumber() != null) {
            user.setIdCardNumber(request.getIdCardNumber());
        }

        userMapper.updateById(user);
        log.info("User updated: {}", userId);

        return buildUserVO(user);
    }

    private UserVO buildUserVO(User user) {
        UserVO.UserVOBuilder builder = UserVO.builder()
                .id(user.getId())
                .phone(user.getPhone())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .institutionId(user.getInstitutionId())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .address(user.getAddress())
                .adopterStatus(user.getAdopterStatus())
                .createdAt(user.getCreatedAt());

        // Load institution name if exists
        if (user.getInstitutionId() != null) {
            Institution institution = institutionMapper.selectById(user.getInstitutionId());
            if (institution != null) {
                builder.institutionName(institution.getName());
            }
        }

        return builder.build();
    }
}
