# PawFinder 系统实现文档

> **版本**: v1.0  
> **最后更新**: 2025-01-13  
> **作者**: PawFinder 开发团队

---

## 目录

1. [概述](#1-概述)
2. [开发环境搭建](#2-开发环境搭建)
3. [项目结构实现](#3-项目结构实现)
4. [核心功能实现](#4-核心功能实现)
5. [技术难点攻克](#5-技术难点攻克)
6. [配置文件详解](#6-配置文件详解)
7. [数据库初始化](#7-数据库初始化)
8. [前端实现细节](#8-前端实现细节)
9. [测试实现](#9-测试实现)
10. [部署实现](#10-部署实现)
11. [附录](#11-附录)

---

## 1. 概述

### 1.1 文档目的

本文档详细记录 PawFinder 宠物领养系统的具体实现过程，包括：
- 开发环境的具体搭建步骤
- 核心功能的代码实现细节
- 遇到的技术难点及解决方案
- 配置文件的具体含义
- 测试和部署的具体操作

### 1.2 与设计文档的区别

| 对比项 | 系统设计文档 | 系统实现文档 |
|--------|-------------|-------------|
| **关注点** | What & Why | How |
| **内容** | 架构设计、技术选型理由 | 具体代码、配置细节 |
| **读者** | 架构师、技术决策者 | 开发人员、运维人员 |
| **示例** | "使用 JWT 进行认证" | "JwtUtil 类的具体实现代码" |

### 1.3 技术栈版本

#### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| JDK | 17 | Java 运行环境 |
| Spring Boot | 3.2.5 | 基础框架 |
| Spring Cloud | 2023.0.0 | 微服务框架 |
| Spring Cloud Alibaba | 2023.0.1.0 | 微服务组件 |
| MyBatis-Plus | 3.5.6 | ORM 框架 |
| MySQL | 8.0 | 关系型数据库 |
| Redis | 7.0 | 缓存数据库 |
| Nacos | 2.3.0 | 服务注册与配置中心 |
| Elasticsearch | 8.12.0 | 搜索引擎 |
| Seata | 2.0.0 | 分布式事务 |
| Sentinel | 1.8.6 | 流量控制 |

#### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 20+ | JavaScript 运行环境 |
| pnpm | 9+ | 包管理器 |
| Next.js | 16.1.1 | React 框架 |
| React | 19.2.3 | UI 库 |
| TypeScript | 5+ | 类型安全 |
| Tailwind CSS | 4.0 | CSS 框架 |
| shadcn/ui | latest | UI 组件库 |

---

## 2. 开发环境搭建

### 2.1 基础环境安装

#### 2.1.1 JDK 17 安装

```bash
# macOS (使用 Homebrew)
brew install openjdk@17

# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# 验证安装
java -version
# 输出: openjdk version "17.0.x"
```

#### 2.1.2 Maven 安装

```bash
# macOS
brew install maven

# Ubuntu/Debian
sudo apt install maven

# 验证安装
mvn -version
# 输出: Apache Maven 3.9.x
```

#### 2.1.3 Node.js 安装

```bash
# 使用 nvm 安装 (推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# 安装 pnpm
npm install -g pnpm

# 验证安装
node -version  # v20.x.x
pnpm -version   # 9.x.x
```

#### 2.1.4 MySQL 8.0 安装

```bash
# macOS
brew install mysql@8.0
brew services start mysql@8.0

# Ubuntu/Debian
sudo apt install mysql-server
sudo systemctl start mysql

# 安全配置
mysql_secure_installation

# 验证安装
mysql --version
# 输出: mysql  Ver 8.0.x
```

#### 2.1.5 Redis 安装

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis

# 验证安装
redis-cli ping
# 输出: PONG
```

### 2.2 中间件安装

#### 2.2.1 Nacos 安装

```bash
# 下载 Nacos
wget https://github.com/alibaba/nacos/releases/download/2.3.0/nacos-server-2.3.0.tar.gz
tar -xzf nacos-server-2.3.0.tar.gz
cd nacos

# 单机模式启动
sh bin/startup.sh -m standalone

# 访问控制台
# URL: http://localhost:8848/nacos
# 默认账号: nacos
# 默认密码: nacos
```

#### 2.2.2 Elasticsearch 安装

```bash
# macOS
brew tap elastic/tap
brew install elastic/tap/elasticsearch-full
elasticsearch-service start

# Ubuntu/Debian
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.12.0-linux-x86_64.tar.gz
tar -xzf elasticsearch-8.12.0-linux-x86_64.tar.gz
cd elasticsearch-8.12.0
./bin/elasticsearch -d

# 验证安装
curl http://localhost:9200
```

#### 2.2.3 Seata 安装

```bash
# 下载 Seata
wget https://github.com/seata/seata/releases/download/v2.0.0/seata-server-2.0.0.tar.gz
tar -xzf seata-server-2.0.0.tar.gz
cd seata

# 修改配置 file.conf 和 registry.conf
# 使用 Nacos 作为注册中心

# 启动
sh bin/seata-server.sh

# 访问控制台
# URL: http://localhost:7091
```

### 2.3 IDE 配置

#### 2.3.1 IntelliJ IDEA 配置

```yaml
# 必装插件
- Lombok Plugin
- MyBatis-Plus Plugin
- Spring Boot Assistant
- Nacos Config
- Elasticsearch

# 代码风格配置
Settings -> Editor -> Code Style -> Java
- Indent: 4 spaces
- Continuation indent: 8 spaces
- Keep maximum blank lines: 2

# Lombok 配置
Settings -> Build, Execution, Deployment -> Compiler -> Annotation Processors
- Enable annotation processing: ✓
```

#### 2.3.2 VS Code 配置

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}

// 必装插件
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
```

---

## 3. 项目结构实现

### 3.1 后端项目结构

```
pawfinder-backend/
├── pom.xml                          # 父 POM，管理依赖版本
├── pawfinder-common/                 # 公共模块
│   ├── src/main/java/com/pawfinder/common/
│   │   ├── result/                   # 统一响应封装
│   │   │   └── Result.java           # Result<T> 类
│   │   ├── exception/                # 自定义异常
│   │   │   ├── BusinessException.java
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── util/                     # 工具类
│   │   │   ├── JwtUtil.java          # JWT 工具
│   │   │   └── RedisUtil.java        # Redis 工具
│   │   └── constant/                 # 常量定义
│   │       └── Constants.java
│   └── pom.xml
│
├── pawfinder-gateway/                # API 网关 (8080)
│   ├── src/main/java/com/pawfinder/gateway/
│   │   ├── GatewayApplication.java   # 启动类
│   │   ├── config/                   # 配置类
│   │   │   └── CorsConfig.java       # 跨域配置
│   │   └── filter/                   # 过滤器
│   │       └── AuthGlobalFilter.java # 认证过滤器
│   └── src/main/resources/
│       └── application.yml           # 网关配置
│
├── pawfinder-user/                   # 用户服务 (8081)
│   ├── src/main/java/com/pawfinder/user/
│   │   ├── UserApplication.java      # 启动类
│   │   ├── controller/               # 控制器层
│   │   │   ├── AuthController.java   # 认证接口
│   │   │   ├── UserController.java   # 用户接口
│   │   │   └── InstitutionController.java  # 机构接口
│   │   ├── service/                  # 服务层
│   │   │   ├── AuthService.java
│   │   │   ├── UserService.java
│   │   │   └── InstitutionService.java
│   │   ├── mapper/                   # 数据访问层
│   │   │   ├── UserMapper.java
│   │   │   └── InstitutionMapper.java
│   │   ├── entity/                   # 实体类
│   │   │   ├── User.java
│   │   │   └── Institution.java
│   │   └── dto/                      # 数据传输对象
│   │       ├── LoginRequest.java
│   │       └── UserVO.java
│   └── src/main/resources/
│       ├── application.yml           # 主配置
│       ├── application-dev.yml       # 开发环境配置
│       └── bootstrap.yml             # 启动配置
│
├── pawfinder-pet/                    # 宠物服务 (8082)
│   ├── src/main/java/com/pawfinder/pet/
│   │   ├── PetApplication.java
│   │   ├── controller/
│   │   │   └── PetController.java
│   │   ├── service/
│   │   │   └── PetService.java
│   │   ├── mapper/
│   │   │   └── PetMapper.java
│   │   ├── entity/
│   │   │   └── Pet.java
│   │   ├── dto/
│   │   │   ├── PetCreateRequest.java
│   │   │   ├── PetUpdateRequest.java
│   │   │   └── PetVO.java
│   │   └── constants/                # 枚举定义
│   │       ├── PetStatusEnum.java    # 宠物状态
│   │       ├── GenderEnum.java       # 性别
│   │       ├── SizeEnum.java         # 体型
│   │       └── PetSpeciesEnum.java   # 物种
│   └── src/main/resources/
│       └── application.yml
│
├── pawfinder-adoption/               # 领养服务 (8083)
│   ├── src/main/java/com/pawfinder/adoption/
│   │   ├── AdoptionApplication.java
│   │   ├── controller/
│   │   │   └── AdoptionController.java
│   │   ├── service/
│   │   │   └── AdoptionService.java
│   │   ├── feign/                    # Feign 客户端
│   │   │   ├── UserClient.java       # 调用用户服务
│   │   │   ├── UserClientFallbackFactory.java
│   │   │   ├── PetClient.java        # 调用宠物服务
│   │   │   └── PetClientFallbackFactory.java
│   │   ├── feign/dto/                # Feign DTO
│   │   │   ├── UserDTO.java
│   │   │   ├── PetDTO.java
│   │   │   └── InstitutionDTO.java
│   │   ├── entity/
│   │   │   ├── AdoptionApplication.java
│   │   │   └── AdoptionRecord.java
│   │   └── mapper/
│   │       ├── AdoptionApplicationMapper.java
│   │       └── AdoptionRecordMapper.java
│   └── src/main/resources/
│       └── application.yml
│
├── pawfinder-order/                  # 订单服务 (8084)
│   ├── src/main/java/com/pawfinder/order/
│   │   ├── OrderApplication.java
│   │   ├── controller/
│   │   │   └── OrderController.java
│   │   ├── service/
│   │   │   └── OrderService.java
│   │   ├── feign/
│   │   │   └── PetClient.java        # 调用宠物服务
│   │   ├── entity/
│   │   │   └── Order.java
│   │   ├── enums/
│   │   │   └── OrderStatus.java
│   │   └── dto/
│   │       └── OrderCreateRequest.java
│   └── src/main/resources/
│       └── application.yml
│
├── pawfinder-payment/                # 支付服务 (8085)
│   ├── src/main/java/com/pawfinder/payment/
│   │   ├── PaymentApplication.java
│   │   ├── controller/
│   │   │   └── PaymentController.java
│   │   ├── service/
│   │   │   ├── PaymentService.java
│   │   │   └── AlipayService.java    # 支付宝服务
│   │   ├── feign/
│   │   │   └── OrderClient.java      # 调用订单服务
│   │   └── entity/
│   │       └── PaymentTransaction.java
│   └── src/main/resources/
│       └── application.yml
│
└── pawfinder-search/                 # 搜索服务 (8086)
    ├── src/main/java/com/pawfinder/search/
    │   ├── SearchApplication.java
    │   ├── controller/
    │   │   └── SearchController.java
    │   ├── service/
    │   │   └── SearchService.java
    │   ├── document/                 # ES 文档
    │   │   └── PetDocument.java
    │   ├── repository/               # ES Repository
    │   │   └── PetSearchRepository.java
    │   ├── feign/
    │   │   └── PetClient.java        # 调用宠物服务同步数据
    │   └── sync/                     # 数据同步
    │       └── PetDataSyncComponent.java
    └── src/main/resources/
        └── application.yml
```

### 3.2 前端项目结构

```
frontend/
├── package.json                      # 依赖配置
├── tsconfig.json                     # TypeScript 配置
├── tailwind.config.ts                # Tailwind 配置
├── next.config.ts                    # Next.js 配置
├── .env.local                        # 环境变量
│
├── src/
│   ├── app/                          # App Router 页面
│   │   ├── layout.tsx                # 根布局
│   │   ├── page.tsx                  # 首页
│   │   ├── globals.css               # 全局样式
│   │   │
│   │   ├── api/                      # API 路由 (代理层)
│   │   │   ├── auth/
│   │   │   │   ├── send-code/route.ts
│   │   │   │   ├── verify-code/route.ts
│   │   │   │   └── me/route.ts
│   │   │   ├── pets/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── applications-count/route.ts
│   │   │   ├── applications/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── adoptions/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── institutions/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── orders/
│   │   │   │   ├── route.ts
│   │   │   │   └── [orderNo]/route.ts
│   │   │   └── payment/
│   │   │       ├── route.ts
│   │   │       ├── notify/route.ts
│   │   │       └── query/route.ts
│   │   │
│   │   ├── (auth)/                   # 认证相关页面
│   │   │   └── login/
│   │   │       └── page.tsx          # 登录页
│   │   │
│   │   ├── pets/                     # 宠物相关页面
│   │   │   ├── page.tsx              # 宠物列表
│   │   │   └── [id]/
│   │   │       └── page.tsx          # 宠物详情
│   │   │
│   │   ├── applications/             # 领养申请页面
│   │   │   └── page.tsx
│   │   │
│   │   ├── adoptions/                # 领养记录页面
│   │   │   └── page.tsx
│   │   │
│   │   ├── institutions/             # 机构页面
│   │   │   ├── page.tsx              # 机构列表
│   │   │   └── [id]/
│   │   │       └── page.tsx          # 机构详情
│   │   │
│   │   ├── orders/                   # 订单页面
│   │   │   └── page.tsx
│   │   │
│   │   ├── admin/                    # 管理后台
│   │   │   └── page.tsx
│   │   │
│   │   └── profile/                  # 个人中心
│   │       └── page.tsx
│   │
│   ├── components/                   # 组件目录
│   │   ├── layout/                   # 布局组件
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── sidebar.tsx
│   │   ├── pet/                      # 宠物组件
│   │   │   ├── pet-card.tsx
│   │   │   └── pet-filter.tsx
│   │   ├── auth/                     # 认证组件
│   │   │   └── login-form.tsx
│   │   ├── chat/                     # 聊天组件
│   │   │   └── chat-widget.tsx
│   │   └── ui/                       # shadcn/ui 组件
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   │
│   ├── lib/                          # 工具库
│   │   ├── api-config.ts             # API 配置
│   │   └── utils.ts                  # 工具函数
│   │
│   └── types/                        # 类型定义
│       └── index.ts
│
└── public/                           # 静态资源
    └── images/
```

---

## 4. 核心功能实现

### 4.1 统一响应封装实现

#### 4.1.1 Result 类实现

```java
// pawfinder-common/src/main/java/com/pawfinder/common/result/Result.java

package com.pawfinder.common.result;

import lombok.Data;
import java.io.Serializable;

/**
 * 统一响应封装类
 * @param <T> 数据类型
 */
@Data
public class Result<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /** 状态码 */
    private Integer code;
    
    /** 消息 */
    private String message;
    
    /** 数据 */
    private T data;
    
    /** 时间戳 */
    private Long timestamp;
    
    public Result() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public Result(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }
    
    // 静态工厂方法
    public static <T> Result<T> success() {
        return new Result<>(200, "success", null);
    }
    
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }
    
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(200, message, data);
    }
    
    public static <T> Result<T> error(String message) {
        return new Result<>(500, message, null);
    }
    
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
    
    // 链式调用
    public Result<T> code(Integer code) {
        this.code = code;
        return this;
    }
    
    public Result<T> message(String message) {
        this.message = message;
        return this;
    }
    
    public Result<T> data(T data) {
        this.data = data;
        return this;
    }
}
```

#### 4.1.2 全局异常处理实现

```java
// pawfinder-common/src/main/java/com/pawfinder/common/exception/GlobalExceptionHandler.java

package com.pawfinder.common.exception;

import com.pawfinder.common.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * 业务异常处理
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.error("业务异常: {}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }
    
    /**
     * 参数校验异常处理
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldError().getDefaultMessage();
        log.error("参数校验失败: {}", message);
        return Result.error(400, message);
    }
    
    /**
     * 绑定异常处理
     */
    @ExceptionHandler(BindException.class)
    public Result<Void> handleBindException(BindException e) {
        String message = e.getBindingResult().getFieldError().getDefaultMessage();
        log.error("参数绑定失败: {}", message);
        return Result.error(400, message);
    }
    
    /**
     * 其他异常处理
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常: ", e);
        return Result.error(500, "系统繁忙，请稍后重试");
    }
}
```

### 4.2 JWT 认证实现

#### 4.2.1 JwtUtil 工具类实现

```java
// pawfinder-common/src/main/java/com/pawfinder/common/util/JwtUtil.java

package com.pawfinder.common.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

/**
 * JWT 工具类
 */
public class JwtUtil {
    
    // 密钥（生产环境应从配置文件读取）
    private static final String SECRET = "pawfinder-secret-key-for-jwt-token-generation-2024";
    
    // 过期时间：7天
    private static final long EXPIRATION = 7 * 24 * 60 * 60 * 1000L;
    
    // 生成密钥
    private static final SecretKey KEY = Keys.hmacShaKeyFor(
        SECRET.getBytes(StandardCharsets.UTF_8)
    );
    
    /**
     * 生成 Token
     * @param userId 用户ID
     * @param claims 自定义声明
     * @return JWT Token
     */
    public static String generateToken(String userId, Map<String, Object> claims) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION);
        
        JwtBuilder builder = Jwts.builder()
                .subject(userId)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(KEY);
        
        // 添加自定义声明
        if (claims != null) {
            claims.forEach(builder::claim);
        }
        
        return builder.compact();
    }
    
    /**
     * 生成简单 Token
     */
    public static String generateToken(String userId) {
        return generateToken(userId, null);
    }
    
    /**
     * 解析 Token
     * @param token JWT Token
     * @return Claims
     */
    public static Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(KEY)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new BusinessException(401, "Token 已过期");
        } catch (JwtException e) {
            throw new BusinessException(401, "无效的 Token");
        }
    }
    
    /**
     * 获取用户ID
     */
    public static String getUserId(String token) {
        return parseToken(token).getSubject();
    }
    
    /**
     * 获取声明值
     */
    public static <T> T getClaim(String token, String claimName, Class<T> clazz) {
        return parseToken(token).get(claimName, clazz);
    }
    
    /**
     * 验证 Token 是否有效
     */
    public static boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

#### 4.2.2 登录认证实现

```java
// pawfinder-user/src/main/java/com/pawfinder/user/service/AuthService.java

package com.pawfinder.user.service;

import com.pawfinder.common.exception.BusinessException;
import com.pawfinder.common.util.JwtUtil;
import com.pawfinder.common.util.RedisUtil;
import com.pawfinder.user.dto.LoginRequest;
import com.pawfinder.user.dto.LoginResponse;
import com.pawfinder.user.entity.User;
import com.pawfinder.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

/**
 * 认证服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserMapper userMapper;
    private final RedisUtil redisUtil;
    
    // 验证码过期时间：5分钟
    private static final long CODE_EXPIRATION = 5 * 60;
    
    // 验证码长度
    private static final int CODE_LENGTH = 6;
    
    /**
     * 发送验证码
     * @param phone 手机号
     */
    public void sendCode(String phone) {
        // 1. 校验手机号格式
        if (!phone.matches("^1[3-9]\\d{9}$")) {
            throw new BusinessException(400, "手机号格式不正确");
        }
        
        // 2. 检查发送频率（1分钟内只能发一次）
        String limitKey = "sms:limit:" + phone;
        if (redisUtil.hasKey(limitKey)) {
            throw new BusinessException(429, "验证码发送过于频繁，请稍后再试");
        }
        
        // 3. 生成验证码
        String code = generateCode();
        
        // 4. 存储验证码到 Redis
        String codeKey = "sms:code:" + phone;
        redisUtil.set(codeKey, code, CODE_EXPIRATION, TimeUnit.SECONDS);
        
        // 5. 设置发送频率限制
        redisUtil.set(limitKey, "1", 60, TimeUnit.SECONDS);
        
        // 6. 发送验证码（实际项目中调用短信服务）
        // smsService.send(phone, code);
        log.info("验证码发送成功: phone={}, code={}", phone, code);
    }
    
    /**
     * 验证码登录
     * @param request 登录请求
     * @return 登录响应
     */
    public LoginResponse login(LoginRequest request) {
        String phone = request.getPhone();
        String code = request.getCode();
        
        // 1. 校验验证码
        String codeKey = "sms:code:" + phone;
        String storedCode = (String) redisUtil.get(codeKey);
        
        if (storedCode == null) {
            throw new BusinessException(400, "验证码已过期");
        }
        
        if (!storedCode.equals(code)) {
            throw new BusinessException(400, "验证码错误");
        }
        
        // 2. 删除验证码（一次性使用）
        redisUtil.delete(codeKey);
        
        // 3. 查询或创建用户
        User user = userMapper.selectByPhone(phone);
        if (user == null) {
            // 自动注册
            user = new User();
            user.setPhone(phone);
            user.setNickname("用户" + phone.substring(7));
            user.setRole("USER");
            user.setStatus("ACTIVE");
            userMapper.insert(user);
            log.info("用户自动注册成功: userId={}", user.getId());
        }
        
        // 4. 检查用户状态
        if ("BANNED".equals(user.getStatus())) {
            throw new BusinessException(403, "账号已被封禁");
        }
        
        // 5. 生成 Token
        Map<String, Object> claims = new HashMap<>();
        claims.put("phone", user.getPhone());
        claims.put("role", user.getRole());
        String token = JwtUtil.generateToken(user.getId(), claims);
        
        // 6. 返回登录信息
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setNickname(user.getNickname());
        response.setRole(user.getRole());
        
        log.info("用户登录成功: userId={}, phone={}", user.getId(), phone);
        return response;
    }
    
    /**
     * 生成随机验证码
     */
    private String generateCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }
}
```

### 4.3 Feign 服务调用实现

#### 4.3.1 Feign 客户端定义

```java
// pawfinder-adoption/src/main/java/com/pawfinder/adoption/feign/PetClient.java

package com.pawfinder.adoption.feign;

import com.pawfinder.adoption.feign.dto.PetDTO;
import com.pawfinder.common.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 宠物服务 Feign 客户端
 * name: 目标服务名（在 Nacos 中注册的服务名）
 * contextId: 唯一标识（同一服务多个客户端时区分）
 * fallbackFactory: 降级处理工厂
 */
@FeignClient(
    name = "pet-service",
    contextId = "petClientForAdoption",
    fallbackFactory = PetClientFallbackFactory.class
)
public interface PetClient {
    
    /**
     * 获取宠物信息
     * 注意：路径必须与 PetController 中定义的路径一致
     */
    @GetMapping("/api/pet/v1/pets/{id}")
    Result<PetDTO> getPetById(@PathVariable("id") String id);
    
    /**
     * 更新宠物状态
     */
    @PostMapping("/api/pet/v1/pets/status/{id}")
    Result<Void> updatePetStatus(
        @PathVariable("id") String id,
        @RequestBody Map<String, String> request
    );
    
    /**
     * 获取宠物申请人数
     */
    @GetMapping("/api/pet/v1/pets/{id}/application-count")
    Result<Long> getApplicationCount(@PathVariable("id") String id);
}
```

#### 4.3.2 Feign 降级处理实现

```java
// pawfinder-adoption/src/main/java/com/pawfinder/adoption/feign/PetClientFallbackFactory.java

package com.pawfinder.adoption.feign;

import com.pawfinder.adoption.feign.dto.PetDTO;
import com.pawfinder.common.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * PetClient 降级处理工厂
 * 当 pet-service 不可用或调用失败时执行降级逻辑
 */
@Slf4j
@Component
public class PetClientFallbackFactory implements FallbackFactory<PetClient> {
    
    @Override
    public PetClient create(Throwable cause) {
        log.error("PetClient 调用失败，触发降级: {}", cause.getMessage());
        
        return new PetClient() {
            
            @Override
            public Result<PetDTO> getPetById(String id) {
                log.warn("降级处理: getPetById, id={}", id);
                return Result.error(503, "宠物服务暂时不可用");
            }
            
            @Override
            public Result<Void> updatePetStatus(String id, Map<String, String> request) {
                log.warn("降级处理: updatePetStatus, id={}", id);
                return Result.error(503, "宠物服务暂时不可用");
            }
            
            @Override
            public Result<Long> getApplicationCount(String id) {
                log.warn("降级处理: getApplicationCount, id={}", id);
                return Result.error(503, "宠物服务暂时不可用");
            }
        };
    }
}
```

#### 4.3.3 Feign DTO 定义

```java
// pawfinder-adoption/src/main/java/com/pawfinder/adoption/feign/dto/PetDTO.java

package com.pawfinder.adoption.feign.dto;

import lombok.Data;
import java.io.Serializable;

/**
 * 宠物 DTO（用于 Feign 调用）
 * 注意：字段名必须与 PetVO 一致，否则反序列化会失败
 */
@Data
public class PetDTO implements Serializable {
    
    private String id;
    private String name;
    private String species;      // DOG, CAT
    private String breed;        // 品种
    private String gender;       // MALE, FEMALE
    private String size;         // SMALL, MEDIUM, LARGE
    private Integer age;
    private String color;
    private String status;       // AVAILABLE, ADOPTED, UNAVAILABLE
    private String description;
    private String imageUrl;
    private String institutionId;
    private String institutionName;
}
```

### 4.4 领养申请业务实现

#### 4.4.1 领养服务实现

```java
// pawfinder-adoption/src/main/java/com/pawfinder/adoption/service/AdoptionService.java

package com.pawfinder.adoption.service;

import com.pawfinder.adoption.dto.ApplicationCreateRequest;
import com.pawfinder.adoption.dto.ApplicationVO;
import com.pawfinder.adoption.entity.AdoptionApplication;
import com.pawfinder.adoption.feign.PetClient;
import com.pawfinder.adoption.feign.UserClient;
import com.pawfinder.adoption.feign.dto.PetDTO;
import com.pawfinder.adoption.mapper.AdoptionApplicationMapper;
import com.pawfinder.common.exception.BusinessException;
import com.pawfinder.common.result.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 领养申请服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdoptionService {
    
    private final AdoptionApplicationMapper applicationMapper;
    private final PetClient petClient;
    private final UserClient userClient;
    
    /**
     * 创建领养申请
     */
    @Transactional(rollbackFor = Exception.class)
    public String createApplication(String userId, ApplicationCreateRequest request) {
        String petId = request.getPetId();
        
        // 1. 通过 Feign 获取宠物信息
        Result<PetDTO> petResult = petClient.getPetById(petId);
        if (petResult.getCode() != 200 || petResult.getData() == null) {
            throw new BusinessException(400, "宠物信息获取失败");
        }
        
        PetDTO pet = petResult.getData();
        
        // 2. 检查宠物状态
        if (!"AVAILABLE".equals(pet.getStatus())) {
            throw new BusinessException(400, "该宠物暂不可领养");
        }
        
        // 3. 检查是否已申请
        if (applicationMapper.existsByUserIdAndPetId(userId, petId) > 0) {
            throw new BusinessException(400, "您已提交过申请，请勿重复提交");
        }
        
        // 4. 创建申请记录
        AdoptionApplication application = new AdoptionApplication();
        application.setUserId(userId);
        application.setPetId(petId);
        application.setInstitutionId(pet.getInstitutionId());
        application.setReason(request.getReason());
        application.setExperience(request.getExperience());
        application.setContactName(request.getContactName());
        application.setContactPhone(request.getContactPhone());
        application.setAddress(request.getAddress());
        application.setStatus("PENDING");
        
        applicationMapper.insert(application);
        log.info("领养申请创建成功: applicationId={}, userId={}, petId={}", 
            application.getId(), userId, petId);
        
        // 5. 更新宠物申请人数
        petClient.updateApplicationCount(petId, 1);
        
        return application.getId();
    }
    
    /**
     * 审核领养申请
     */
    @Transactional(rollbackFor = Exception.class)
    public void reviewApplication(String applicationId, String status, String reviewNote) {
        // 1. 查询申请
        AdoptionApplication application = applicationMapper.selectById(applicationId);
        if (application == null) {
            throw new BusinessException(404, "申请不存在");
        }
        
        if (!"PENDING".equals(application.getStatus())) {
            throw new BusinessException(400, "该申请已审核");
        }
        
        // 2. 更新申请状态
        application.setStatus(status);
        application.setReviewNote(reviewNote);
        applicationMapper.updateById(application);
        
        // 3. 如果审核通过，更新宠物状态
        if ("APPROVED".equals(status)) {
            Result<Void> result = petClient.updatePetStatus(
                application.getPetId(), 
                Map.of("status", "ADOPTED")
            );
            
            if (result.getCode() != 200) {
                throw new BusinessException(500, "宠物状态更新失败");
            }
        }
        
        log.info("申请审核完成: applicationId={}, status={}", applicationId, status);
    }
    
    /**
     * 分页查询申请列表
     */
    public Page<ApplicationVO> pageApplications(int current, int size, String status, String userId) {
        Page<AdoptionApplication> page = new Page<>(current, size);
        
        // 构建查询条件
        LambdaQueryWrapper<AdoptionApplication> wrapper = new LambdaQueryWrapper<>();
        if (status != null && !status.isEmpty()) {
            wrapper.eq(AdoptionApplication::getStatus, status);
        }
        if (userId != null && !userId.isEmpty()) {
            wrapper.eq(AdoptionApplication::getUserId, userId);
        }
        wrapper.orderByDesc(AdoptionApplication::getCreatedAt);
        
        Page<AdoptionApplication> applicationPage = applicationMapper.selectPage(page, wrapper);
        
        // 转换为 VO
        Page<ApplicationVO> voPage = new Page<>();
        voPage.setCurrent(applicationPage.getCurrent());
        voPage.setSize(applicationPage.getSize());
        voPage.setTotal(applicationPage.getTotal());
        voPage.setRecords(applicationPage.getRecords().stream()
            .map(this::convertToVO)
            .collect(Collectors.toList()));
        
        return voPage;
    }
    
    /**
     * 转换为 VO
     */
    private ApplicationVO convertToVO(AdoptionApplication application) {
        ApplicationVO vo = new ApplicationVO();
        vo.setId(application.getId());
        vo.setUserId(application.getUserId());
        vo.setPetId(application.getPetId());
        vo.setStatus(application.getStatus());
        vo.setReason(application.getReason());
        vo.setCreatedAt(application.getCreatedAt());
        
        // 通过 Feign 获取宠物信息
        try {
            Result<PetDTO> petResult = petClient.getPetById(application.getPetId());
            if (petResult.getCode() == 200 && petResult.getData() != null) {
                PetDTO pet = petResult.getData();
                vo.setPetName(pet.getName());
                vo.setPetImageUrl(pet.getImageUrl());
            }
        } catch (Exception e) {
            log.warn("获取宠物信息失败: petId={}", application.getPetId());
        }
        
        return vo;
    }
}
```

### 4.5 Elasticsearch 搜索实现

#### 4.5.1 ES 文档定义

```java
// pawfinder-search/src/main/java/com/pawfinder/search/document/PetDocument.java

package com.pawfinder.search.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

/**
 * 宠物 ES 文档
 */
@Data
@Document(indexName = "pets")
@Setting(replicas = 0)
public class PetDocument {
    
    @Id
    private String id;
    
    @Field(type = FieldType.Keyword)
    private String name;
    
    @Field(type = FieldType.Keyword)
    private String species;  // DOG, CAT
    
    @Field(type = FieldType.Keyword)
    private String breed;
    
    @Field(type = FieldType.Keyword)
    private String gender;   // MALE, FEMALE
    
    @Field(type = FieldType.Keyword)
    private String size;     // SMALL, MEDIUM, LARGE
    
    @Field(type = FieldType.Integer)
    private Integer age;
    
    @Field(type = FieldType.Keyword)
    private String color;
    
    @Field(type = FieldType.Keyword)
    private String status;   // AVAILABLE, ADOPTED
    
    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String description;
    
    @Field(type = FieldType.Keyword)
    private String imageUrl;
    
    @Field(type = FieldType.Keyword)
    private String institutionId;
    
    @Field(type = FieldType.Keyword)
    private String institutionName;
    
    @Field(type = FieldType.Long)
    private Long createdAt;
}
```

#### 4.5.2 搜索服务实现

```java
// pawfinder-search/src/main/java/com/pawfinder/search/service/SearchService.java

package com.pawfinder.search.service;

import com.pawfinder.search.document.PetDocument;
import com.pawfinder.search.repository.PetSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 搜索服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SearchService {
    
    private final PetSearchRepository petSearchRepository;
    private final ElasticsearchRestTemplate elasticsearchTemplate;
    
    /**
     * 综合搜索宠物
     */
    public List<PetDocument> searchPets(String keyword, String species, String gender, 
                                         String size, Integer minAge, Integer maxAge, 
                                         int page, int size) {
        
        // 构建布尔查询
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        
        // 关键词搜索（名称、品种、描述）
        if (keyword != null && !keyword.isEmpty()) {
            boolQuery.should(QueryBuilders.matchQuery("name", keyword));
            boolQuery.should(QueryBuilders.matchQuery("breed", keyword));
            boolQuery.should(QueryBuilders.matchQuery("description", keyword));
            boolQuery.minimumShouldMatch(1);
        }
        
        // 精确过滤
        if (species != null && !species.isEmpty()) {
            boolQuery.filter(QueryBuilders.termQuery("species", species));
        }
        if (gender != null && !gender.isEmpty()) {
            boolQuery.filter(QueryBuilders.termQuery("gender", gender));
        }
        if (size != null && !size.isEmpty()) {
            boolQuery.filter(QueryBuilders.termQuery("size", size));
        }
        
        // 范围过滤（年龄）
        if (minAge != null || maxAge != null) {
            var rangeQuery = QueryBuilders.rangeQuery("age");
            if (minAge != null) {
                rangeQuery.gte(minAge);
            }
            if (maxAge != null) {
                rangeQuery.lte(maxAge);
            }
            boolQuery.filter(rangeQuery);
        }
        
        // 只搜索可领养的宠物
        boolQuery.filter(QueryBuilders.termQuery("status", "AVAILABLE"));
        
        // 构建查询
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(boolQuery)
            .withPageable(PageRequest.of(page, size))
            .build();
        
        // 执行搜索
        SearchHits<PetDocument> searchHits = elasticsearchTemplate.search(
            searchQuery, PetDocument.class
        );
        
        return searchHits.getSearchHits().stream()
            .map(SearchHit::getContent)
            .collect(Collectors.toList());
    }
    
    /**
     * 同步宠物数据到 ES
     */
    public void syncPet(PetDocument petDocument) {
        petSearchRepository.save(petDocument);
        log.info("同步宠物数据到ES: petId={}", petDocument.getId());
    }
    
    /**
     * 批量同步宠物数据
     */
    public void syncPets(List<PetDocument> petDocuments) {
        petSearchRepository.saveAll(petDocuments);
        log.info("批量同步宠物数据到ES: count={}", petDocuments.size());
    }
}
```

### 4.6 支付宝支付实现

#### 4.6.1 支付服务实现

```java
// pawfinder-payment/src/main/java/com/pawfinder/payment/service/AlipayService.java

package com.pawfinder.payment.service;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipayTradePagePayRequest;
import com.alipay.api.request.AlipayTradeQueryRequest;
import com.alipay.api.response.AlipayTradeQueryResponse;
import com.pawfinder.common.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * 支付宝支付服务
 */
@Slf4j
@Service
public class AlipayService {
    
    @Value("${alipay.app-id}")
    private String appId;
    
    @Value("${alipay.private-key}")
    private String privateKey;
    
    @Value("${alipay.public-key}")
    private String alipayPublicKey;
    
    @Value("${alipay.gateway}")
    private String gateway;
    
    @Value("${alipay.notify-url}")
    private String notifyUrl;
    
    @Value("${alipay.return-url}")
    private String returnUrl;
    
    private AlipayClient alipayClient;
    
    /**
     * 获取支付宝客户端
     */
    private AlipayClient getAlipayClient() {
        if (alipayClient == null) {
            alipayClient = new DefaultAlipayClient(
                gateway, appId, privateKey,
                "json", "UTF-8", alipayPublicKey, "RSA2"
            );
        }
        return alipayClient;
    }
    
    /**
     * 创建支付链接
     */
    public String createPayment(String orderNo, BigDecimal amount, String subject) {
        AlipayClient client = getAlipayClient();
        
        AlipayTradePagePayRequest request = new AlipayTradePagePayRequest();
        request.setReturnUrl(returnUrl);
        request.setNotifyUrl(notifyUrl);
        
        // 设置业务参数
        request.setBizContent(String.format(
            "{\"out_trade_no\":\"%s\"," +
            "\"total_amount\":\"%.2f\"," +
            "\"subject\":\"%s\"," +
            "\"product_code\":\"FAST_INSTANT_TRADE_PAY\"}",
            orderNo, amount, subject
        ));
        
        try {
            // 调用 SDK 生成表单
            String form = client.pageExecute(request).getBody();
            log.info("创建支付订单成功: orderNo={}", orderNo);
            return form;
        } catch (AlipayApiException e) {
            log.error("创建支付订单失败: {}", e.getMessage(), e);
            throw new BusinessException(500, "支付创建失败");
        }
    }
    
    /**
     * 查询支付状态
     */
    public String queryPayment(String orderNo) {
        AlipayClient client = getAlipayClient();
        
        AlipayTradeQueryRequest request = new AlipayTradeQueryRequest();
        request.setBizContent(String.format(
            "{\"out_trade_no\":\"%s\"}", orderNo
        ));
        
        try {
            AlipayTradeQueryResponse response = client.execute(request);
            if (response.isSuccess()) {
                String tradeStatus = response.getTradeStatus();
                log.info("查询支付状态成功: orderNo={}, status={}", orderNo, tradeStatus);
                return tradeStatus;
            } else {
                log.warn("查询支付状态失败: {}", response.getSubMsg());
                return "UNKNOWN";
            }
        } catch (AlipayApiException e) {
            log.error("查询支付状态异常: {}", e.getMessage(), e);
            return "UNKNOWN";
        }
    }
}
```

---

## 5. 技术难点攻克

### 5.1 Feign 调用降级问题

#### 5.1.1 问题描述

在 `pawfinder-adoption` 服务中，创建领养申请时会通过 Feign 调用 `pawfinder-pet` 服务的 `getPetById` 接口。但即使 `pet-service` 正常运行，仍然会触发降级逻辑。

#### 5.1.2 问题排查过程

1. **检查日志**：查看 adoption-service 日志，发现 Feign 调用返回 404
2. **检查路径**：对比 Feign 定义的路径和 PetController 实际路径

```
Feign 调用路径: /api/pet/v1/internal/pets/{id}
Controller 路径: /api/pet/v1/pets/{id}
```

3. **问题定位**：Feign 调用的 `/internal/` 路径不存在，导致 404，触发降级

#### 5.1.3 解决方案

修改 Feign Client，直接调用对外接口（无需 `/internal/` 前缀）：

```java
// 修改前
@GetMapping("/api/pet/v1/internal/pets/{id}")
Result<PetDTO> getPetById(@PathVariable String id);

// 修改后
@GetMapping("/api/pet/v1/pets/{id}")
Result<PetVO> getPetById(@PathVariable("id") String id);
```

#### 5.1.4 经验总结

- Feign 调用的路径必须与 Controller 中 `@GetMapping` 定义的路径**完全一致**
- 404 错误也会触发 Feign 的降级逻辑，不仅仅是服务不可用
- 路径变量名必须用 `@PathVariable("id")` 明确指定

### 5.2 前端状态枚举大小写问题

#### 5.2.1 问题描述

数据库中宠物状态是 `AVAILABLE`（大写），但前端显示"已领养"。

#### 5.2.2 问题排查

前端状态判断逻辑：

```javascript
const statusLabel = 
  status === "available" ? "可领养" : 
  status === "pending" ? "待审核" : "已领养";
```

后端返回 `"AVAILABLE"`，前端用小写 `"available"` 比较，永远匹配不上，最终返回"已领养"。

#### 5.2.3 解决方案

使用 `toUpperCase()` 或定义状态映射：

```javascript
// 方案1：大小写兼容
const statusLabel = 
  status?.toUpperCase() === "AVAILABLE" ? "可领养" : 
  status?.toUpperCase() === "ADOPTED" ? "已领养" : "暂不可领养";

// 方案2：状态映射（推荐）
const statusConfig = {
  AVAILABLE: { label: "可领养", color: "green" },
  ADOPTED: { label: "已领养", color: "gray" },
  UNAVAILABLE: { label: "暂不可领养", color: "orange" }
};

const statusInfo = statusConfig[status?.toUpperCase()] || 
  { label: "未知", color: "default" };
```

### 5.3 Gateway 与 MVC 冲突

#### 5.3.1 问题描述

启动 `pawfinder-gateway` 报错：

```
Spring MVC found on classpath, which is incompatible with Spring Cloud Gateway
```

#### 5.3.2 原因分析

Spring Cloud Gateway 基于 WebFlux（响应式），与 Spring MVC 不兼容。

#### 5.3.3 解决方案

在 `pom.xml` 中排除 `spring-boot-starter-web`：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<!-- 使用 WebFlux -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

### 5.4 MyBatis-Plus 主键生成问题

#### 5.4.1 问题描述

插入数据时报错：

```
Field 'id' doesn't have a default value
```

#### 5.4.2 原因分析

`id-type: ASSIGN_ID` 生成 Long 类型雪花 ID，但数据库字段是 VARCHAR。

#### 5.4.3 解决方案

修改为 `ASSIGN_UUID`：

```yaml
mybatis-plus:
  global-config:
    db-config:
      id-type: assign_uuid  # 生成 UUID 字符串
```

---

## 6. 配置文件详解

### 6.1 网关配置

```yaml
# pawfinder-gateway/src/main/resources/application.yml

server:
  port: 8080                    # 网关端口

spring:
  application:
    name: gateway-service       # 服务名称（注册到 Nacos）
  
  cloud:
    gateway:
      # 开启服务发现
      discovery:
        locator:
          enabled: true         # 启用服务发现
          lower-case-service-id: true  # 服务名小写
      
      # 路由配置
      routes:
        # 用户服务路由
        - id: user-service      # 路由 ID（唯一）
          uri: lb://user-service  # lb:// 表示负载均衡，后跟服务名
          predicates:
            - Path=/api/user/**  # 匹配路径
        
        # 宠物服务路由
        - id: pet-service
          uri: lb://pet-service
          predicates:
            - Path=/api/pet/**
        
        # ... 其他服务路由

# 日志配置
logging:
  level:
    org.springframework.cloud.gateway: INFO
    com.pawfinder.gateway: DEBUG
```

### 6.2 用户服务配置

```yaml
# pawfinder-user/src/main/resources/application.yml

server:
  port: 8081

spring:
  application:
    name: user-service
  profiles:
    active: dev                  # 激活开发环境配置
  
  # 数据源配置
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/pawfinder_user?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: pawfinder
    password: pawfinder123
  
  # Redis 配置
  data:
    redis:
      host: localhost
      port: 6379
      database: 0
      timeout: 10000ms          # 连接超时
  
  # Nacos 配置
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848  # Nacos 地址
        namespace: pawfinder         # 命名空间
        group: DEFAULT_GROUP
      config:
        server-addr: localhost:8848
        namespace: pawfinder
        group: DEFAULT_GROUP
        file-extension: yaml
    
    # Sentinel 配置
    sentinel:
      transport:
        dashboard: localhost:8080  # Sentinel 控制台
        port: 8719
      eager: true
    
    # Seata 配置
    seata:
      enabled: true
      application-id: user-service
      tx-service-group: pawfinder-tx-group
      service:
        vgroup-mapping:
          pawfinder-tx-group: default

# MyBatis-Plus 配置
mybatis-plus:
  mapper-locations: classpath*:/mapper/**/*.xml
  type-aliases-package: com.pawfinder.user.entity
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: assign_uuid      # 主键策略：UUID
      logic-delete-field: deletedAt
      logic-delete-value: 'NOW()'
      logic-not-delete-value: 'NULL'

# JWT 配置
jwt:
  secret: PawFinder2024SecretKeyForJWTTokenGenerationAndValidation
  expiration: 86400000         # 24小时

# Actuator 配置
management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: always

# Knife4j 配置
knife4j:
  enable: true
  openapi:
    title: PawFinder 用户服务 API
    description: 用户认证、用户管理、机构管理接口
    version: 1.0.0
    base-url: http://localhost:8081
```

### 6.3 前端环境变量配置

```env
# frontend/.env.local

# 使用直连模式（不走网关）
NEXT_PUBLIC_USE_GATEWAY=false

# 基础地址
NEXT_PUBLIC_API_BASE_URL=http://localhost

# 各服务端口
NEXT_PUBLIC_USER_SERVICE_PORT=8081
NEXT_PUBLIC_PET_SERVICE_PORT=8082
NEXT_PUBLIC_ADOPTION_SERVICE_PORT=8083
NEXT_PUBLIC_ORDER_SERVICE_PORT=8084
NEXT_PUBLIC_PAYMENT_SERVICE_PORT=8085
NEXT_PUBLIC_SEARCH_SERVICE_PORT=8086
```

---

## 7. 数据库初始化

### 7.1 创建数据库和用户

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS pawfinder_user 
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS pawfinder_pet 
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS pawfinder_adoption 
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS pawfinder_order 
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS pawfinder_payment 
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER IF NOT EXISTS 'pawfinder'@'localhost' IDENTIFIED BY 'pawfinder123';
CREATE USER IF NOT EXISTS 'pawfinder'@'%' IDENTIFIED BY 'pawfinder123';

-- 授权
GRANT ALL PRIVILEGES ON pawfinder_user.* TO 'pawfinder'@'localhost';
GRANT ALL PRIVILEGES ON pawfinder_pet.* TO 'pawfinder'@'localhost';
GRANT ALL PRIVILEGES ON pawfinder_adoption.* TO 'pawfinder'@'localhost';
GRANT ALL PRIVILEGES ON pawfinder_order.* TO 'pawfinder'@'localhost';
GRANT ALL PRIVILEGES ON pawfinder_payment.* TO 'pawfinder'@'localhost';

GRANT ALL PRIVILEGES ON pawfinder_user.* TO 'pawfinder'@'%';
GRANT ALL PRIVILEGES ON pawfinder_pet.* TO 'pawfinder'@'%';
GRANT ALL PRIVILEGES ON pawfinder_adoption.* TO 'pawfinder'@'%';
GRANT ALL PRIVILEGES ON pawfinder_order.* TO 'pawfinder'@'%';
GRANT ALL PRIVILEGES ON pawfinder_payment.* TO 'pawfinder'@'%';

FLUSH PRIVILEGES;
```

### 7.2 用户服务表结构

```sql
-- pawfinder_user 数据库

-- 用户表
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `password` VARCHAR(255) DEFAULT NULL COMMENT '密码',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `real_name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名',
  `id_card` VARCHAR(20) DEFAULT NULL COMMENT '身份证号',
  `gender` VARCHAR(10) DEFAULT NULL COMMENT '性别(MALE/FEMALE)',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
  `role` VARCHAR(20) NOT NULL DEFAULT 'USER' COMMENT '角色(USER/ADMIN/INSTITUTION)',
  `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态(ACTIVE/BANNED)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 机构表
CREATE TABLE `institutions` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `user_id` VARCHAR(36) NOT NULL COMMENT '关联用户ID',
  `name` VARCHAR(100) NOT NULL COMMENT '机构名称',
  `description` TEXT COMMENT '机构简介',
  `logo` VARCHAR(500) DEFAULT NULL COMMENT 'Logo URL',
  `license` VARCHAR(500) DEFAULT NULL COMMENT '营业执照URL',
  `contact_name` VARCHAR(50) DEFAULT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `address` VARCHAR(500) DEFAULT NULL COMMENT '机构地址',
  `province` VARCHAR(50) DEFAULT NULL COMMENT '省',
  `city` VARCHAR(50) DEFAULT NULL COMMENT '市',
  `district` VARCHAR(50) DEFAULT NULL COMMENT '区',
  `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态(PENDING/APPROVED/REJECTED)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='机构表';
```

### 7.3 宠物服务表结构

```sql
-- pawfinder_pet 数据库

CREATE TABLE `pets` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `name` VARCHAR(50) NOT NULL COMMENT '宠物名称',
  `species` VARCHAR(20) NOT NULL COMMENT '物种(DOG/CAT)',
  `breed` VARCHAR(50) DEFAULT NULL COMMENT '品种',
  `gender` VARCHAR(10) DEFAULT NULL COMMENT '性别(MALE/FEMALE)',
  `size` VARCHAR(20) DEFAULT NULL COMMENT '体型(SMALL/MEDIUM/LARGE)',
  `age` INT DEFAULT NULL COMMENT '年龄(月)',
  `color` VARCHAR(50) DEFAULT NULL COMMENT '颜色',
  `weight` DECIMAL(5,2) DEFAULT NULL COMMENT '体重(kg)',
  `status` VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' COMMENT '状态(AVAILABLE/ADOPTED/UNAVAILABLE)',
  `description` TEXT COMMENT '描述',
  `health_info` TEXT COMMENT '健康信息',
  `vaccinated` TINYINT(1) DEFAULT 0 COMMENT '是否接种疫苗',
  `sterilized` TINYINT(1) DEFAULT 0 COMMENT '是否绝育',
  `image_url` VARCHAR(500) DEFAULT NULL COMMENT '图片URL',
  `images` TEXT COMMENT '图片URLs(JSON)',
  `institution_id` VARCHAR(36) NOT NULL COMMENT '机构ID',
  `application_count` INT DEFAULT 0 COMMENT '申请人数',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_species` (`species`),
  KEY `idx_status` (`status`),
  KEY `idx_institution_id` (`institution_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='宠物表';
```

---

## 8. 前端实现细节

### 8.1 API 配置实现

```typescript
// frontend/src/lib/api-config.ts

// 服务端口配置
const SERVICE_PORTS = {
  USER: process.env.NEXT_PUBLIC_USER_SERVICE_PORT || '8081',
  PET: process.env.NEXT_PUBLIC_PET_SERVICE_PORT || '8082',
  ADOPTION: process.env.NEXT_PUBLIC_ADOPTION_SERVICE_PORT || '8083',
  ORDER: process.env.NEXT_PUBLIC_ORDER_SERVICE_PORT || '8084',
  PAYMENT: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_PORT || '8085',
  SEARCH: process.env.NEXT_PUBLIC_SEARCH_SERVICE_PORT || '8086',
} as const;

// 是否使用网关
const USE_GATEWAY = process.env.NEXT_PUBLIC_USE_GATEWAY === 'true';

// 基础地址
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost';

// 网关地址
const GATEWAY_URL = `${BASE_URL}:8080`;

/**
 * 获取服务地址
 */
function getServiceUrl(service: keyof typeof SERVICE_PORTS): string {
  if (USE_GATEWAY) {
    return GATEWAY_URL;
  }
  return `${BASE_URL}:${SERVICE_PORTS[service]}`;
}

// API 端点配置
export const API_ENDPOINTS = {
  // 用户服务
  AUTH: {
    SEND_CODE: `${getServiceUrl('USER')}/api/user/v1/auth/send-code`,
    VERIFY_CODE: `${getServiceUrl('USER')}/api/user/v1/auth/login`,
    GET_CURRENT_USER: `${getServiceUrl('USER')}/api/user/v1/users/me`,
    UPDATE_USER: `${getServiceUrl('USER')}/api/user/v1/users/me`,
  },
  
  // 宠物服务
  PETS: {
    LIST: `${getServiceUrl('PET')}/api/pet/v1/pets`,
    DETAIL: (id: string) => `${getServiceUrl('PET')}/api/pet/v1/pets/${id}`,
    CREATE: `${getServiceUrl('PET')}/api/pet/v1/pets`,
    UPDATE: (id: string) => `${getServiceUrl('PET')}/api/pet/v1/pets/${id}`,
    DELETE: (id: string) => `${getServiceUrl('PET')}/api/pet/v1/pets/${id}`,
    APPLICATION_COUNT: (id: string) => 
      `${getServiceUrl('PET')}/api/pet/v1/pets/${id}/application-count`,
  },
  
  // 领养服务
  ADOPTIONS: {
    // ...
  },
  
  // 订单服务
  ORDERS: {
    // ...
  },
  
  // 支付服务
  PAYMENT: {
    // ...
  },
  
  // 搜索服务
  SEARCH: {
    PETS: `${getServiceUrl('SEARCH')}/api/search/v1/pets`,
  },
} as const;
```

### 8.2 状态枚举映射

```typescript
// frontend/src/lib/constants.ts

/**
 * 宠物状态配置
 * 注意：后端返回大写枚举值
 */
export const PET_STATUS = {
  AVAILABLE: {
    label: '可领养',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  ADOPTED: {
    label: '已领养',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
  UNAVAILABLE: {
    label: '暂不可领养',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
  },
} as const;

/**
 * 获取状态信息
 */
export function getStatusInfo(status: string | undefined) {
  const upperStatus = status?.toUpperCase() as keyof typeof PET_STATUS;
  return PET_STATUS[upperStatus] || {
    label: '未知',
    color: 'default',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-500',
  };
}

/**
 * 物种配置
 */
export const PET_SPECIES = {
  DOG: { label: '狗狗', icon: '🐕' },
  CAT: { label: '猫咪', icon: '🐱' },
} as const;

/**
 * 性别配置
 */
export const PET_GENDER = {
  MALE: { label: '公', icon: '♂' },
  FEMALE: { label: '母', icon: '♀' },
} as const;

/**
 * 体型配置
 */
export const PET_SIZE = {
  SMALL: { label: '小型', desc: '10kg以下' },
  MEDIUM: { label: '中型', desc: '10-25kg' },
  LARGE: { label: '大型', desc: '25kg以上' },
} as const;
```

---

## 9. 测试实现

### 9.1 单元测试

```java
// pawfinder-user/src/test/java/com/pawfinder/user/service/AuthServiceTest.java

package com.pawfinder.user.service;

import com.pawfinder.common.exception.BusinessException;
import com.pawfinder.user.dto.LoginRequest;
import com.pawfinder.user.dto.LoginResponse;
import com.pawfinder.user.entity.User;
import com.pawfinder.user.mapper.UserMapper;
import com.pawfinder.common.util.RedisUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    
    @Mock
    private UserMapper userMapper;
    
    @Mock
    private RedisUtil redisUtil;
    
    @InjectMocks
    private AuthService authService;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void testSendCode_Success() {
        // Given
        String phone = "13800138000";
        when(redisUtil.hasKey(anyString())).thenReturn(false);
        
        // When
        authService.sendCode(phone);
        
        // Then
        verify(redisUtil, times(2)).set(anyString(), any(), anyLong(), any());
    }
    
    @Test
    void testSendCode_RateLimitExceeded() {
        // Given
        String phone = "13800138000";
        when(redisUtil.hasKey("sms:limit:" + phone)).thenReturn(true);
        
        // When & Then
        assertThrows(BusinessException.class, () -> {
            authService.sendCode(phone);
        });
    }
    
    @Test
    void testLogin_Success() {
        // Given
        LoginRequest request = new LoginRequest();
        request.setPhone("13800138000");
        request.setCode("123456");
        
        when(redisUtil.get("sms:code:" + request.getPhone()))
            .thenReturn("123456");
        
        User user = new User();
        user.setId("user-123");
        user.setPhone(request.getPhone());
        user.setRole("USER");
        user.setStatus("ACTIVE");
        when(userMapper.selectByPhone(request.getPhone())).thenReturn(user);
        
        // When
        LoginResponse response = authService.login(request);
        
        // Then
        assertNotNull(response.getToken());
        assertEquals("user-123", response.getUserId());
    }
}
```

### 9.2 接口测试

```java
// pawfinder-user/src/test/java/com/pawfinder/user/controller/AuthControllerTest.java

package com.pawfinder.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pawfinder.user.dto.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void testSendCode() throws Exception {
        mockMvc.perform(post("/api/user/v1/auth/send-code")
                .param("phone", "13800138000")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200));
    }
    
    @Test
    void testLogin() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setPhone("13800138000");
        request.setCode("123456");
        
        mockMvc.perform(post("/api/user/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200))
            .andExpect(jsonPath("$.data.token").exists());
    }
}
```

---

## 10. 部署实现

### 10.1 Docker 部署

#### 10.1.1 Dockerfile 示例（用户服务）

```dockerfile
# pawfinder-user/Dockerfile

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 复制 jar 包
COPY target/pawfinder-user-1.0.0-SNAPSHOT.jar app.jar

# 暴露端口
EXPOSE 8081

# 启动命令
ENTRYPOINT ["java", "-jar", "-Xms256m", "-Xmx512m", "app.jar"]
```

#### 10.1.2 Docker Compose

```yaml
# docker-compose.yml

version: '3.8'

services:
  # MySQL
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_USER: pawfinder
      MYSQL_PASSWORD: pawfinder123
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./init-db:/docker-entrypoint-initdb.d

  # Redis
  redis:
    image: redis:7.0-alpine
    ports:
      - "6379:6379"

  # Nacos
  nacos:
    image: nacos/nacos-server:v2.3.0
    environment:
      MODE: standalone
      SPRING_DATASOURCE_PLATFORM: mysql
      MYSQL_SERVICE_HOST: mysql
      MYSQL_SERVICE_PORT: 3306
      MYSQL_SERVICE_DB_NAME: nacos
      MYSQL_SERVICE_USER: root
      MYSQL_SERVICE_PASSWORD: root123
    ports:
      - "8848:8848"
    depends_on:
      - mysql

  # Elasticsearch
  elasticsearch:
    image: elasticsearch:8.12.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - es-data:/usr/share/elasticsearch/data

  # 用户服务
  user-service:
    build: ./pawfinder-user
    ports:
      - "8081:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/pawfinder_user
      SPRING_REDIS_HOST: redis
      SPRING_CLOUD_NACOS_DISCOVERY_SERVER_ADDR: nacos:8848
    depends_on:
      - mysql
      - redis
      - nacos

  # 网关
  gateway:
    build: ./pawfinder-gateway
    ports:
      - "8080:8080"
    environment:
      SPRING_CLOUD_NACOS_DISCOVERY_SERVER_ADDR: nacos:8848
    depends_on:
      - nacos
      - user-service

volumes:
  mysql-data:
  es-data:
```

### 10.2 启动脚本

```bash
#!/bin/bash
# scripts/start-all.sh

echo "Starting PawFinder services..."

# 启动基础服务
docker-compose up -d mysql redis nacos elasticsearch

# 等待基础服务启动
sleep 30

# 编译后端
cd pawfinder-backend
mvn clean package -DskipTests

# 启动微服务
java -jar pawfinder-user/target/pawfinder-user-1.0.0-SNAPSHOT.jar &
java -jar pawfinder-pet/target/pawfinder-pet-1.0.0-SNAPSHOT.jar &
java -jar pawfinder-adoption/target/pawfinder-adoption-1.0.0-SNAPSHOT.jar &
java -jar pawfinder-order/target/pawfinder-order-1.0.0-SNAPSHOT.jar &
java -jar pawfinder-payment/target/pawfinder-payment-1.0.0-SNAPSHOT.jar &
java -jar pawfinder-search/target/pawfinder-search-1.0.0-SNAPSHOT.jar &
java -jar pawfinder-gateway/target/pawfinder-gateway-1.0.0-SNAPSHOT.jar &

# 启动前端
cd ../frontend
pnpm install
pnpm build
pnpm start &

echo "All services started!"
```

---

## 11. 附录

### 11.1 常用命令

#### 后端命令

```bash
# 编译
mvn clean package -DskipTests

# 运行单个服务
java -jar pawfinder-user/target/pawfinder-user-1.0.0-SNAPSHOT.jar

# 运行所有服务（开发环境）
mvn spring-boot:run -pl pawfinder-user

# 查看日志
tail -f logs/pawfinder-user.log
```

#### 前端命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 启动生产服务
pnpm start

# 类型检查
pnpm ts-check

# 代码检查
pnpm lint
```

### 11.2 端口清单

| 服务 | 端口 | 说明 |
|------|------|------|
| Gateway | 8080 | API 网关 |
| User Service | 8081 | 用户服务 |
| Pet Service | 8082 | 宠物服务 |
| Adoption Service | 8083 | 领养服务 |
| Order Service | 8084 | 订单服务 |
| Payment Service | 8085 | 支付服务 |
| Search Service | 8086 | 搜索服务 |
| Nacos | 8848 | 服务注册中心 |
| MySQL | 3306 | 数据库 |
| Redis | 6379 | 缓存 |
| Elasticsearch | 9200 | 搜索引擎 |
| Sentinel | 8080 | 流量控制 |
| Seata | 7091 | 分布式事务 |

### 11.3 相关文档

| 文档 | 路径 | 说明 |
|------|------|------|
| 系统设计文档 | `/docs/SYSTEM-DESIGN.md` | 架构设计、技术选型 |
| 需求分析文档 | `/docs/需求分析.md` | 功能需求、业务流程 |
| 数据库设计文档 | `/docs/DATABASE.md` | 表结构、SQL 脚本 |
| API 接口文档 | `/docs/API-INTERFACE.md` | 前后端接口规范 |
| 用例图文档 | `/docs/USECASE.md` | 用例图、参与者 |

---

**文档版本历史**

| 版本 | 日期 | 作者 | 说明 |
|------|------|------|------|
| v1.0 | 2025-01-13 | PawFinder Team | 初始版本 |
