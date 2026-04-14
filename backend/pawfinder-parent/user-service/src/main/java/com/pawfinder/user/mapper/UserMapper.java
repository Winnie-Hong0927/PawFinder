package com.pawfinder.user.mapper;

import com.pawfinder.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * User Mapper
 */
@Mapper
public interface UserMapper {

    /**
     * Insert user
     */
    int insert(User user);

    /**
     * Update user
     */
    int update(User user);

    /**
     * Delete user by ID
     */
    int deleteById(@Param("id") Long id);

    /**
     * Select user by ID
     */
    User selectById(@Param("id") Long id);

    /**
     * Select user by email
     */
    User selectByEmail(@Param("email") String email);

    /**
     * Select users by role
     */
    List<User> selectByRole(@Param("role") String role);

    /**
     * Select users by adopter status
     */
    List<User> selectByAdopterStatus(@Param("adopterStatus") String adopterStatus);

    /**
     * Count users
     */
    Long count();

    /**
     * Count users by role
     */
    Long countByRole(@Param("role") String role);
}
