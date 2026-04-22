package com.pawfinder.search.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 宠物 Elasticsearch 文档
 */
@Data
@Document(indexName = "pawfinder_pet")
@Setting(shards = 1, replicas = 0)
public class PetDocument {

    @Id
    private String id;

    /** 宠物名称 */
    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String name;

    /** 物种: dog, cat, rabbit, other */
    @Field(type = FieldType.Keyword)
    private String species;

    /** 品种 */
    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String breed;

    /** 年龄 */
    @Field(type = FieldType.Keyword)
    private String age;

    /** 性别: male, female */
    @Field(type = FieldType.Keyword)
    private String gender;

    /** 体型: small, medium, large */
    @Field(type = FieldType.Keyword)
    private String size;

    /** 描述 */
    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String description;

    /** 性格特点 */
    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private List<String> traits;

    /** 健康状况 */
    @Field(type = FieldType.Keyword)
    private String healthStatus;

    /** 疫苗接种状态 */
    @Field(type = FieldType.Boolean)
    private Boolean vaccinationStatus;

    /** 绝育状态 */
    @Field(type = FieldType.Boolean)
    private Boolean sterilizationStatus;

    /** 收容所位置 */
    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String shelterLocation;

    /** 领养费用 */
    @Field(type = FieldType.Double)
    private BigDecimal adoptionFee;

    /** 状态: available, pending, adopted, offline */
    @Field(type = FieldType.Keyword)
    private String status;

    /** 所属机构ID */
    @Field(type = FieldType.Keyword)
    private String institutionId;

    /** 机构名称 */
    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String institutionName;

    /** 图片列表 */
    @Field(type = FieldType.Keyword, index = false)
    private List<String> images;

    /** 创建时间 */
    @Field(type = FieldType.Long)
    private Long createdAt;
}
