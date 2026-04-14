package com.pawfinder.common.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Base Entity - All domain entities should extend this class
 */
@Data
public class BaseEntity implements Serializable {

    /**
     * Primary key ID
     */
    private Long id;

    /**
     * Creation time
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createdAt;

    /**
     * Creator ID
     */
    private Long createdBy;

    /**
     * Update time
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updatedAt;

    /**
     * Updater ID
     */
    private Long updatedBy;

    /**
     * Soft delete flag (0: not deleted, 1: deleted)
     */
    private Integer deleted;
}
