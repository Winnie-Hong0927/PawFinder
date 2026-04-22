package com.pawfinder.gateway.config;

import com.alibaba.csp.sentinel.adapter.gateway.common.rule.GatewayFlowRule;
import com.alibaba.csp.sentinel.adapter.gateway.common.rule.GatewayRuleManager;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

/**
 * Gateway Sentinel 流控规则配置
 * 定义各 API 的限流规则
 */
@Configuration
public class SentinelRulesConfig {

    /**
     * 初始化网关流控规则
     */
    @PostConstruct
    public void initGatewayRules() {
        Set<GatewayFlowRule> rules = new HashSet<>();

        // 认证服务限流 - 每秒最多 100 次请求
        rules.add(new GatewayFlowRule("auth_api_group")
                .setCount(100)
                .setIntervalSec(1)
                .setBurst(20));

        // 宠物服务限流 - 每秒最多 50 次请求
        rules.add(new GatewayFlowRule("pet_api_group")
                .setCount(50)
                .setIntervalSec(1)
                .setBurst(10));

        // 领养服务限流 - 每秒最多 30 次请求
        rules.add(new GatewayFlowRule("adoption_api_group")
                .setCount(30)
                .setIntervalSec(1)
                .setBurst(5));

        // 订单服务限流 - 每秒最多 20 次请求
        rules.add(new GatewayFlowRule("order_api_group")
                .setCount(20)
                .setIntervalSec(1));

        // 支付服务限流 - 每秒最多 10 次请求（支付敏感操作）
        rules.add(new GatewayFlowRule("payment_api_group")
                .setCount(10)
                .setIntervalSec(1));

        // 搜索服务限流 - 每秒最多 100 次请求
        rules.add(new GatewayFlowRule("search_api_group")
                .setCount(100)
                .setIntervalSec(1)
                .setBurst(30));

        GatewayRuleManager.loadRules(rules);
    }
}
