package com.pawfinder.pet.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 宠物实体类
 * 对应数据库表 pet，记录待领养宠物的完整信息
 */
@TableName("pets")
@Data
public class Pet {

    /**
     * 宠物唯一标识ID，采用UUID策略（32位字符串）
     */
    @TableId(type = IdType.INPUT)
    private String id;
    /**
     * 宠物名称
     */
    private String name;

    /**
     * 物种
     */
    private String species;

    /**
     * 品种，如：金毛、布偶猫、垂耳兔
     */
    private String breed;

    /**
     * 年龄，格式示例："2岁3个月" 或 "3个月"
     */
    private String age;

    /**
     * 性别：公、母（枚举类型）
     */
    private String gender;

    /**
     * 体型：小型、中型、大型（枚举类型）
     */
    private String size;

    /**
     * 宠物图片URL列表，多个URL之间使用逗号分隔；也可存储为JSON数组字符串
     */
    private String images;

    /**
     * 宠物详细描述，包括性格、习惯、救助背景等
     */
    private String description;

    /**
     * 宠物特点/性格标签，如：粘人、活泼、胆小
     */
    private String traits;

    /**
     * 健康状况描述
     */
    private String healthStatus;

    /**
     * 是否已接种疫苗，true=已接种，false=未接种
     */
    private Boolean vaccinationStatus;

    /**
     * 是否已绝育，true=已绝育，false=未绝育
     */
    private Boolean sterilizationStatus;

    /**
     * 救助点/收容所位置，用于筛选附近宠物
     */
    private String shelterLocation;

    /**
     * 领养押金金额（单位：元），领养成功后退还
     */
    private BigDecimal adoptionFee;

    /**
     * 宠物当前状态：待领养、已领养、已删除、不可领养
     */
    private String status;

    /**
     * 所属救助机构ID，关联机构表
     */
    private String institutionId;

    /**
     * 创建人ID（后台管理员ID）
     */
    private String createdBy;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

    /**
     * 逻辑删除时间，NULL表示未删除；非NULL表示已删除
     * todo 待删除 还要记得修改数据库
     */
    private LocalDateTime deletedAt;
}
