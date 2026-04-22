package com.pawfinder.gateway.config;

import com.alibaba.csp.sentinel.adapter.gateway.common.ApiDefinition;
import com.alibaba.csp.sentinel.adapter.gateway.common.ApiPathPredicateItem;
import com.alibaba.csp.sentinel.adapter.gateway.common.ApiPredicateItem;
import com.alibaba.csp.sentinel.adapter.gateway.common.GatewayApiDefinitionManager;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Gateway API 分组定义
 * 用于 Sentinel 流控规则的 API 分组
 */
@Configuration
public class ApiDefinitionConfig {

    /**
     * 初始化 API 分组定义
     */
    @PostConstruct
    public void initApiDefinitions() {
        Map<String, Set<ApiPredicateItem>> apiDefinitions = new HashMap<>();

        // 认证服务 API 分组
        Set<ApiPredicateItem> authApis = new HashSet<>();
        authApis.add(new ApiPathPredicateItem()
                .setPattern("/api/user/v1/auth/**")
                .setMatchStrategy(2)); // URL_MATCH_STRATEGY_PREFIX
        apiDefinitions.put("auth_api_group", authApis);

        // 宠物服务 API 分组
        Set<ApiPredicateItem> petApis = new HashSet<>();
        petApis.add(new ApiPathPredicateItem()
                .setPattern("/api/pet/v1/**")
                .setMatchStrategy(2));
        apiDefinitions.put("pet_api_group", petApis);

        // 领养服务 API 分组
        Set<ApiPredicateItem> adoptionApis = new HashSet<>();
        adoptionApis.add(new ApiPathPredicateItem()
                .setPattern("/api/adoption/v1/**")
                .setMatchStrategy(2));
        apiDefinitions.put("adoption_api_group", adoptionApis);

        // 订单服务 API 分组
        Set<ApiPredicateItem> orderApis = new HashSet<>();
        orderApis.add(new ApiPathPredicateItem()
                .setPattern("/api/order/v1/**")
                .setMatchStrategy(2));
        apiDefinitions.put("order_api_group", orderApis);

        // 支付服务 API 分组
        Set<ApiPredicateItem> paymentApis = new HashSet<>();
        paymentApis.add(new ApiPathPredicateItem()
                .setPattern("/api/payment/v1/**")
                .setMatchStrategy(2));
        apiDefinitions.put("payment_api_group", paymentApis);

        // 搜索服务 API 分组
        Set<ApiPredicateItem> searchApis = new HashSet<>();
        searchApis.add(new ApiPathPredicateItem()
                .setPattern("/api/search/v1/**")
                .setMatchStrategy(2));
        apiDefinitions.put("search_api_group", searchApis);

        // 加载 API 分组定义
        GatewayApiDefinitionManager.loadApiDefinitions(apiDefinitions.entrySet().stream()
                .map(entry -> new ApiDefinition(entry.getKey())
                        .setPredicateItems(entry.getValue()))
                .collect(java.util.stream.Collectors.toSet()));
    }
}
