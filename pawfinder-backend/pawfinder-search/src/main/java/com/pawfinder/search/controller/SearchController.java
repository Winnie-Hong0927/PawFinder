package com.pawfinder.search.controller;

import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.search.service.SearchService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 搜索控制器
 */
@RestController
@RequestMapping("/api/search/v1")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    /**
     * 综合搜索宠物
     */
    @GetMapping("/pets")
    public Result<PageResult<Map<String, Object>>> searchPets(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String size,
            @RequestParam(required = false, defaultValue = "AVAILABLE") String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int pageSize) {

        return searchService.searchPets(keyword, species, gender, size, status, page, pageSize);
    }

    /**
     * 同步宠物数据到 ES
     */
    @PostMapping("/sync")
    public Result<String> syncPetData() {
        // todo 每次查找之前都需要调用这个方法刷新es 前端可以实现一下
        return searchService.syncPetData();
    }
}
