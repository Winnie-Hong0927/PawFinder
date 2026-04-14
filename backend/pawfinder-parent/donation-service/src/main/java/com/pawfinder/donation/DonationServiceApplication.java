package com.pawfinder.donation;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication(scanBasePackages = {"com.pawfinder.donation", "com.pawfinder.common"})
@MapperScan("com.pawfinder.donation.mapper")
public class DonationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DonationServiceApplication.class, args);
    }
}
