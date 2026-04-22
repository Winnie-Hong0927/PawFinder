package com.pawfinder.order;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * 订单服务启动类
 * 
 * 功能：
 * - 订单创建、查询、取消
 * - 订单状态管理
 * - Seata AT 模式分布式事务
 */
@SpringBootApplication
@MapperScan("com.pawfinder.order.mapper")
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.pawfinder.order.feign")
public class OrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}
