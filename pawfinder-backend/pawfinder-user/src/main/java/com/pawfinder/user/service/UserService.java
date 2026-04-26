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
        vo.setPhone(user.getPhone());
        vo.setNickname(user.getNickname());
        vo.setAvatar(user.getAvatar());
        vo.setRole(user.getRole());
        vo.setRealName(user.getRealName());
        vo.setIdCard(user.getIdCard());
        vo.setAddress(user.getAddress());
        vo.setVerified(user.getVerified());
        vo.setCreatedAt(user.getCreatedAt());
        return vo;
    }
}
