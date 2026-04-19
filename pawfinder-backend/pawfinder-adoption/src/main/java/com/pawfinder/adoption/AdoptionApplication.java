package com.pawfinder.adoption;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.pawfinder.adoption.mapper")
public class AdoptionApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdoptionApplication.class, args);
    }
}
