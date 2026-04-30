package com.pawfinder.user.service;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.user.dto.UserVO;
import com.pawfinder.user.entity.User;
import com.pawfinder.user.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserService {

    private final UserMapper userMapper;

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public UserVO getUserById(String userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return toVO(user);
    }

    public UserVO getUserByPhone(String phone) {
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getPhone, phone)
                        .last("LIMIT 1")
        );
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return toVO(user);
    }

    private UserVO toVO(User user) {
        UserVO vo = new UserVO();
        vo.setId(user.getId());
        vo.setBio(user.getBio());
        vo.setAddress(user.getAddress());
        vo.setRole(user.getRole().getValue());
        vo.setPhone(user.getPhone());
        vo.setEmail(user.getEmail());
        vo.setName(user.getName());
        vo.setAdopterStatus(user.getAdopterStatus().getValue());
        vo.setAvatarUrl(user.getAvatarUrl());
        vo.setInstitutionId(user.getInstitutionId());
        return vo;
    }
}
