package com.pawfinder.pet.dto;

import com.pawfinder.pet.constants.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Pet view object DTO
 * 宠物视图对象数据传输类，用于展示宠物相关信息
 */
@Data
public class PetVO {
    private String id;                                    // 宠物唯一标识ID
    private String name;                                 // 宠物名称
    private PetSpeciesEnum species;                      // 宠物物种枚举
    private String breed;                                // 宠物品种
    private String age;                                  // 宠物年龄
    private GenderEnum gender;                           // 宠物性别枚举
    private SizeEnum size;                              // 宠物体型枚举
    private List<String> images;                         // 宠物图片列表
    private String description;                          // 宠物描述信息
    private List<String> traits;                         // 宠物特征列表
    private List<HealthStatusEnum> healthStatus;         // 宠物健康状态列表
    private Boolean vaccinationStatus;                    // 宠物疫苗接种状态
    private Boolean sterilizationStatus;                  // 宠物绝育状态
    private String shelterLocation;                      // 收容所位置
    private BigDecimal adoptionFee;                      // 领养费用
    private PetStatusEnum status;                               // 宠物状态
    private String institutionId;                        // 机构ID
    private String institutionName;                      // 机构名称
    private Long applicationCount;                       // 申请数量
    private LocalDateTime createdAt;                     // 创建时间
}
