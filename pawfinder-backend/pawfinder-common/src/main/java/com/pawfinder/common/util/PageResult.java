package com.pawfinder.common.util;

import java.util.List;

/**
 * Page result wrapper
 */
public class PageResult<T> {

    private long total;
    private long current;
    private long size;
    private long pages;
    private List<T> records;

    public PageResult() {
    }

    public PageResult(long total, long current, long size, long pages, List<T> records) {
        this.total = total;
        this.current = current;
        this.size = size;
        this.pages = pages;
        this.records = records;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getCurrent() {
        return current;
    }

    public void setCurrent(long current) {
        this.current = current;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public long getPages() {
        return pages;
    }

    public void setPages(long pages) {
        this.pages = pages;
    }

    public List<T> getRecords() {
        return records;
    }

    public void setRecords(List<T> records) {
        this.records = records;
    }
}
