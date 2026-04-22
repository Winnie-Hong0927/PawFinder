package com.pawfinder.payment;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * 支付服务启动类
 * 
 * 功能：
 * - 支付宝沙箱支付
 * - 支付回调处理
 * - Seata AT 模式分布式事务
 */
@SpringBootApplication
@MapperScan("com.pawfinder.payment.mapper")
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.pawfinder.payment.feign")
public class PaymentApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentApplication.class, args);
    }
}
