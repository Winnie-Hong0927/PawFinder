package com.pawfinder.common.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Page Response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    /**
     * Current page
     */
    private Long current;

    /**
     * Page size
     */
    private Long size;

    /**
     * Total records
     */
    private Long total;

    /**
     * Total pages
     */
    private Long pages;

    /**
     * Records
     */
    private List<T> records;

    /**
     * Create page response
     */
    public static <T> PageResponse<T> of(Long current, Long size, Long total, List<T> records) {
        long pages = (total + size - 1) / size;
        return PageResponse.<T>builder()
                .current(current)
                .size(size)
                .total(total)
                .pages(pages)
                .records(records)
                .build();
    }
}
