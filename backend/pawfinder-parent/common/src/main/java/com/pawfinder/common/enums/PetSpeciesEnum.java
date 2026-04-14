package com.pawfinder.common.enums;

/**
 * Pet Species Enum
 */
public enum PetSpeciesEnum {
    DOG("dog", "狗狗"),
    CAT("cat", "猫咪"),
    RABBIT("rabbit", "兔子"),
    BIRD("bird", "鸟类"),
    HAMSTER("hamster", "仓鼠"),
    OTHER("other", "其他");

    private final String code;
    private final String description;

    PetSpeciesEnum(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static PetSpeciesEnum fromCode(String code) {
        for (PetSpeciesEnum species : values()) {
            if (species.code.equals(code)) {
                return species;
            }
        }
        return OTHER;
    }
}
