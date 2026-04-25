package com.pawfinder.pet.constants;

import lombok.Getter;

/**
 * 宠物种类枚举类
 * 用于定义系统中支持的宠物种类
 */
import lombok.Getter;
import java.util.HashMap;
import java.util.Map;

public enum PetSpeciesEnum {
    DOG("dog"),
    CAT("cat"),
    RABBIT("rabbit"),
    BIRD("bird"),
    HAMSTER("hamster"),
    OTHER("other");

    @Getter
    private final String value;

    private static final Map<String, PetSpeciesEnum> VALUE_MAP = new HashMap<>();

    static {
        for (PetSpeciesEnum species : PetSpeciesEnum.values()) {
            VALUE_MAP.put(species.value, species);
        }
    }

    PetSpeciesEnum(String value) {
        this.value = value;
    }

    /**
     * 根据字符串 value 获取对应的枚举实例
     *
     * @param value 枚举的 value 字段值（如 "dog", "cat", "rabbit" 等）
     * @return 对应的枚举实例
     * @throws IllegalArgumentException 如果 value 为 null 或不存在对应的枚举
     */
    public static PetSpeciesEnum fromValue(String value) {
        if (value == null) {
            throw new IllegalArgumentException("PetSpeciesEnum value 不能为 null");
        }
        PetSpeciesEnum species = VALUE_MAP.get(value.toLowerCase());
        if (species == null) {
            throw new IllegalArgumentException("未知的宠物物种值: " + value);
        }
        return species;
    }
}