package com.pawfinder.search.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 宠物 ES 文档实体
 */
@Document(indexName = "pets")
@Data
public class PetDocument {

    @Id
    private String id;

    @Field(type = FieldType.Text, analyzer = "ik_max_word")
    private String name;

    @Field(type = FieldType.Keyword)
    private String species;

    @Field(type = FieldType.Text, analyzer = "ik_max_word")
    private String breed;

    @Field(type = FieldType.Keyword)
    private String gender;

    @Field(type = FieldType.Keyword)
    private String size;

    @Field(type = FieldType.Keyword)
    private String status;

    @Field(type = FieldType.Text, analyzer = "ik_max_word")
    private String description;

    @Field(type = FieldType.Keyword)
    private String institutionId;

    @Field(type = FieldType.Text)
    private String shelterLocation;

    private List<String> images;

    private BigDecimal adoptionFee;

    private String healthStatus;

    private Boolean vaccinationStatus;

    private Boolean sterilizationStatus;
}
