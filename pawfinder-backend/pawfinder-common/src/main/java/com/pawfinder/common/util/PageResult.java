package com.pawfinder.common.util;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * Pagination wrapper
 */
@Data
public class PageResult<T> implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * Total records
     */
    private long total;

    /**
     * Current page
     */
    private long current;

    /**
     * Page size
     */
    private long size;

    /**
     * Total pages
     */
    private long pages;

    /**
     * Records
     */
    private List<T> records;

    public static <T> PageResult<T> of(IPage<T> page) {
        PageResult<T> result = new PageResult<>();
        result.setTotal(page.getTotal());
        result.setCurrent(page.getCurrent());
        result.setSize(page.getSize());
        result.setPages(page.getPages());
        result.setRecords(page.getRecords());
        return result;
    }

    public static <T> PageResult<T> of(List<T> records, long total, long current, long size) {
        PageResult<T> result = new PageResult<>();
        result.setTotal(total);
        result.setCurrent(current);
        result.setSize(size);
        result.setPages((total + size - 1) / size);
        result.setRecords(records);
        return result;
    }

    public static <T> Page<T> toPage(long current, long size) {
        return new Page<>(current, size);
    }
}
