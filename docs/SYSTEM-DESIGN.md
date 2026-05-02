# PawFinder 宠物领养系统 - 系统设计文档

> **版本**: v1.0  
> **更新日期**: 2025-01-13  
> **作者**: PawFinder 开发团队

---

## 目录

1. [系统概述](#1-系统概述)
2. [系统架构设计](#2-系统架构设计)
3. [技术选型](#3-技术选型)
4. [微服务设计](#4-微服务设计)
5. [数据库设计](#5-数据库设计)
6. [接口设计](#6-接口设计)
7. [前端设计](#7-前端设计)
8. [安全设计](#8-安全设计)
9. [性能设计](#9-性能设计)
10. [部署设计](#10-部署设计)
11. [监控与运维](#11-监控与运维)
12. [附录](#附录)

---

## 1. 系统概述

### 1.1 项目背景

PawFinder 是一款宠物领养平台，旨在连接待领养宠物与有意愿领养的用户。系统采用前后端分离架构，后端使用 Spring Cloud Alibaba 微服务架构，提供高可用、可扩展的服务能力。

### 1.2 系统目标

| 目标 | 说明 |
|------|------|
| 高可用 | 服务可用性 ≥ 99.9% |
| 高性能 | 接口平均响应时间 < 200ms |
| 可扩展 | 支持水平扩展，无状态服务设计 |
| 安全性 | 数据加密传输，权限精细控制 |
| 易维护 | 模块化设计，职责清晰 |

### 1.3 系统范围

**核心功能模块**：
- 用户管理：注册、登录、个人信息管理
- 宠物管理：宠物信息 CRUD、状态管理
- 领养申请：申请提交、审核流程
- 订单支付：订单创建、支付宝支付
- 机构管理：救助站信息管理
- 搜索服务：宠物全文检索

### 1.4 用户角色

| 角色 | 权限说明 |
|------|----------|
| 游客 | 浏览宠物列表、查看宠物详情、搜索宠物 |
| 普通用户 | 提交领养申请、查看申请状态、管理个人信息 |
| 机构用户 | 管理机构宠物、审核领养申请 |
| 管理员 | 系统管理、用户管理、数据统计 |

---

## 2. 系统架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              客户端层 (Client Layer)                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │   Web 浏览器     │  │   移动端 H5     │  │   小程序        │                 │
│  │  (Next.js SSR)  │  │  (响应式设计)   │  │   (未来规划)    │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              网关层 (Gateway Layer)                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                     Spring Cloud Gateway (8080)                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │   │
│  │  │路由转发  │ │ 负载均衡 │ │ 限流熔断 │ │ 认证鉴权 │ │ 日志追踪 │      │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           服务层 (Service Layer)                                  │
│                                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   用户服务       │  │   宠物服务       │  │   领养服务       │                  │
│  │  user-service   │  │  pet-service    │  │adoption-service │                  │
│  │   (8081)        │  │   (8082)        │  │   (8083)        │                  │
│  │                 │  │                 │  │                 │                  │
│  │ - 用户注册登录   │  │ - 宠物 CRUD     │  │ - 申请提交      │                  │
│  │ - JWT 认证      │  │ - 状态管理      │  │ - 审核流程      │                  │
│  │ - 机构管理      │  │ - 图片管理      │  │ - 领养记录      │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│                                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   订单服务       │  │   支付服务       │  │   搜索服务       │                  │
│  │  order-service  │  │payment-service  │  │ search-service  │                  │
│  │   (8084)        │  │   (8085)        │  │   (8086)        │                  │
│  │                 │  │                 │  │                 │                  │
│  │ - 订单创建      │  │ - 支付宝集成    │  │ - ES 索引管理   │                  │
│  │ - 状态管理      │  │ - 支付回调      │  │ - 全文检索      │                  │
│  │ - 订单查询      │  │ - 流水记录      │  │ - 数据同步      │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        公共模块 (pawfinder-common)                       │   │
│  │  - 统一响应格式  - 全局异常处理  - JWT 工具类  - Redis 工具类  - 分页工具  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                    │                    │                    │
                    ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              数据层 (Data Layer)                                  │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           MySQL 8.0 集群                                 │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │   │
│  │  │pawfinder_user│ │pawfinder_pet │ │pawfinder_    │ │pawfinder_    │    │   │
│  │  │              │ │              │ │  adoption    │ │   order      │    │   │
│  │  │ - users      │ │ - pets       │ │ - adoption_  │ │ - orders     │    │   │
│  │  │ - institutions│ │              │ │ applications │ │              │    │   │
│  │  │              │ │              │ │ - adoption_  │ │              │    │   │
│  │  │              │ │              │ │   records    │ │              │    │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    │   │
│  │  ┌──────────────┐                                                      │   │
│  │  │pawfinder_    │                                                      │   │
│  │  │  payment     │                                                      │   │
│  │  │ - payment_   │                                                      │   │
│  │  │ transactions │                                                      │   │
│  │  └──────────────┘                                                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐                              │
│  │   Elasticsearch     │  │       Redis         │                              │
│  │     (8.12.0)        │  │       (7.0)         │                              │
│  │                     │  │                     │                              │
│  │ - pets 索引         │  │ - 会话缓存          │                              │
│  │ - 全文检索          │  │ - 验证码缓存        │                              │
│  │ - 聚合分析          │  │ - 接口限流计数      │                              │
│  └─────────────────────┘  └─────────────────────┘                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           基础设施层 (Infrastructure Layer)                       │
│                                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐    │
│  │       Nacos         │  │      Sentinel       │  │       Seata         │    │
│  │    (2.4.3)          │  │     (1.8.8)         │  │     (2.0.0)         │    │
│  │                     │  │                     │  │                     │    │
│  │ - 服务注册发现      │  │ - 流量控制          │  │ - 分布式事务        │    │
│  │ - 配置中心          │  │ - 熔断降级          │  │ - AT 模式           │    │
│  │ - 命名空间隔离      │  │ - 实时监控          │  │ - TCC 模式          │    │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 架构分层说明

| 层级 | 职责 | 技术实现 |
|------|------|----------|
| 客户端层 | 用户界面展示、交互处理 | Next.js 15、React 19、TypeScript |
| 网关层 | 路由转发、认证鉴权、限流熔断 | Spring Cloud Gateway、Sentinel |
| 服务层 | 业务逻辑处理、数据操作 | Spring Boot 3.2、MyBatis-Plus |
| 数据层 | 数据持久化、缓存、检索 | MySQL、Redis、Elasticsearch |
| 基础设施层 | 服务治理、配置管理 | Nacos、Sentinel、Seata |

### 2.3 调用关系图

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              前端调用链路                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   Next.js Frontend                                                        │
│        │                                                                  │
│        ├─── 网关模式 ──→ Gateway(8080) ──→ 各微服务(8081-8086)           │
│        │                                                                  │
│        └─── 直连模式 ──→ 直接调用各微服务                                  │
│                           │                                               │
│                           ├─── user-service:8081                          │
│                           ├─── pet-service:8082                           │
│                           ├─── adoption-service:8083                      │
│                           ├─── order-service:8084                         │
│                           ├─── payment-service:8085                       │
│                           └─── search-service:8086                        │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                              服务间调用链路                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   adoption-service ──OpenFeign──→ pet-service                            │
│        │                                                                  │
│        │                     获取宠物信息                                  │
│        │                     更新宠物状态                                  │
│        │                     获取申请数量                                  │
│        │                                                                  │
│        └──OpenFeign──→ user-service                                       │
│                              获取用户信息                                  │
│                              获取机构信息                                  │
│                                                                           │
│   payment-service ──OpenFeign──→ order-service                           │
│                                   更新订单状态                             │
│                                                                           │
│   search-service ──OpenFeign──→ pet-service                              │
│                                  同步宠物数据                              │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 技术选型

### 3.1 后端技术栈

| 分类 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **核心框架** | Spring Boot | 3.2.5 | 应用开发框架 |
| **微服务框架** | Spring Cloud Alibaba | 2023.0.3.2 | 微服务整体解决方案 |
| **服务注册** | Nacos | 2.4.3 | 服务发现与配置中心 |
| **API 网关** | Spring Cloud Gateway | 2023.0.3 | 路由转发、限流熔断 |
| **流量控制** | Sentinel | 1.8.8 | 流量控制、熔断降级 |
| **分布式事务** | Seata | 2.0.0 | AT 模式分布式事务 |
| **服务调用** | OpenFeign | 3.1.8 | 声明式 HTTP 客户端 |
| **负载均衡** | Spring Cloud LoadBalancer | 4.0.3 | 客户端负载均衡 |
| **ORM 框架** | MyBatis-Plus | 3.5.7 | 数据持久层框架 |
| **数据库** | MySQL | 8.0 | 关系型数据库 |
| **缓存** | Redis | 7.0 | 分布式缓存 |
| **搜索引擎** | Elasticsearch | 8.12.0 | 全文检索引擎 |
| **连接池** | HikariCP | 5.0.1 | 数据库连接池 |
| **JSON 处理** | Jackson | 2.15.0 | JSON 序列化 |
| **日志框架** | SLF4J + Logback | 1.4.11 + 1.4.11 | 日志记录 |
| **构建工具** | Maven | 3.9+ | 项目构建管理 |
| **JDK 版本** | OpenJDK | 17 | Java 运行时环境 |

### 3.2 前端技术栈

| 分类 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **核心框架** | Next.js | 15.0.0 | React 全栈框架 |
| **UI 框架** | React | 19.0.0 | 用户界面库 |
| **开发语言** | TypeScript | 5.0.0 | 类型安全的 JavaScript |
| **样式方案** | Tailwind CSS | 4.0.0 | 原子化 CSS 框架 |
| **UI 组件** | shadcn/ui | latest | 基于 Radix UI 的组件库 |
| **状态管理** | React Context | 19.0.0 | 全局状态管理 |
| **HTTP 客户端** | fetch API | - | 原生 HTTP 请求 |
| **表单处理** | React Hook Form | 7.x | 表单状态管理 |
| **数据验证** | Zod | 3.x | 运行时类型验证 |

### 3.3 开发工具

| 工具 | 用途 |
|------|------|
| IntelliJ IDEA | 后端开发 IDE |
| VS Code | 前端开发 IDE |
| Navicat | 数据库管理 |
| Redis Desktop Manager | Redis 可视化 |
| Postman | API 测试 |
| Git | 版本控制 |
| GitHub | 代码托管 |

---

## 4. 微服务设计

### 4.1 服务清单

| 服务名 | 端口 | 数据库 | 核心职责 |
|--------|------|--------|----------|
| pawfinder-gateway | 8080 | - | API 网关、路由转发 |
| pawfinder-user | 8081 | pawfinder_user | 用户认证、用户管理、机构管理 |
| pawfinder-pet | 8082 | pawfinder_pet | 宠物信息管理 |
| pawfinder-adoption | 8083 | pawfinder_adoption | 领养申请、审核流程 |
| pawfinder-order | 8084 | pawfinder_order | 订单创建、状态管理 |
| pawfinder-payment | 8085 | pawfinder_payment | 支付集成、流水记录 |
| pawfinder-search | 8086 | Elasticsearch | 全文检索、数据同步 |
| pawfinder-common | - | - | 公共模块、工具类 |

### 4.2 服务详细设计

#### 4.2.1 网关服务 (pawfinder-gateway)

**端口**: 8080

**职责**:
- 统一入口，路由转发
- 认证授权（JWT 验证）
- 限流熔断（Sentinel）
- 请求日志

**路由配置**:
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
        - id: pet-service
          uri: lb://pet-service
          predicates:
            - Path=/api/pet/**
        - id: adoption-service
          uri: lb://adoption-service
          predicates:
            - Path=/api/adoption/**
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/order/**
        - id: payment-service
          uri: lb://payment-service
          predicates:
            - Path=/api/payment/**
        - id: search-service
          uri: lb://search-service
          predicates:
            - Path=/api/search/**
```

**限流配置**:
```java
// 全局 QPS 限流：1000
// 单接口限流：根据业务差异化配置
// 熔断策略：错误率 > 50% 持续 5 秒触发
```

---

#### 4.2.2 用户服务 (pawfinder-user)

**端口**: 8081

**数据库**: pawfinder_user

**实体类**:
- `User`: 用户信息
- `Institution`: 机构信息

**Controller**:
- `AuthController`: 认证相关接口
  - POST `/api/user/v1/auth/send-code` - 发送验证码
  - POST `/api/user/v1/auth/verify-code` - 验证码登录
  - POST `/api/user/v1/auth/logout` - 退出登录
  
- `UserController`: 用户管理接口
  - GET `/api/user/v1/users/{userId}` - 获取用户信息
  - PUT `/api/user/v1/users/{userId}` - 更新用户信息
  
- `InstitutionController`: 机构管理接口
  - GET `/api/institution/v1/institutions` - 机构列表
  - GET `/api/institution/v1/institutions/{id}` - 机构详情
  - POST `/api/institution/v1/institutions` - 创建机构
  - PUT `/api/institution/v1/institutions/{id}` - 更新机构

**Service**:
- `AuthService`: 认证业务逻辑
  - `sendVerificationCode()`: 发送验证码
  - `verifyCodeAndLogin()`: 验证码登录
  - `logout()`: 退出登录
  
- `UserService`: 用户业务逻辑
  - `getUserById()`: 获取用户
  - `updateUser()`: 更新用户
  
- `InstitutionService`: 机构业务逻辑
  - `list()`: 机构列表
  - `getById()`: 获取详情
  - `create()`: 创建机构
  - `update()`: 更新机构

**核心流程 - 验证码登录**:
```
1. 用户输入手机号
2. 前端调用 /auth/send-code
3. 后端生成 6 位验证码
4. 验证码存入 Redis (key: sms:code:{phone}, TTL: 5min)
5. 调用短信服务发送验证码
6. 用户输入验证码
7. 前端调用 /auth/verify-code
8. 后端验证 Redis 中的验证码
9. 验证通过，查询/创建用户
10. 生成 JWT Token
11. 返回 Token 和用户信息
```

---

#### 4.2.3 宠物服务 (pawfinder-pet)

**端口**: 8082

**数据库**: pawfinder_pet

**实体类**:
- `Pet`: 宠物信息

**枚举类**:
- `PetStatusEnum`: 宠物状态 (AVAILABLE, ADOPTED, UNAVAILABLE)
- `PetSpeciesEnum`: 物种 (DOG, CAT, OTHER)
- `GenderEnum`: 性别 (MALE, FEMALE)
- `SizeEnum`: 体型 (SMALL, MEDIUM, LARGE)

**Controller**:
- `PetController`: 宠物管理接口
  - GET `/api/pet/v1/pets` - 宠物列表（分页）
  - GET `/api/pet/v1/pets/{id}` - 宠物详情
  - POST `/api/pet/v1/pets` - 创建宠物
  - PUT `/api/pet/v1/pets/{id}` - 更新宠物
  - DELETE `/api/pet/v1/pets/{id}` - 删除宠物
  - PUT `/api/pet/v1/pets/status/{id}` - 更新状态
  - GET `/api/pet/v1/pets/{id}/application-count` - 获取申请数量

**Service**:
- `PetService`: 宠物业务逻辑
  - `list()`: 分页查询
  - `getById()`: 获取详情
  - `create()`: 创建宠物
  - `update()`: 更新宠物
  - `delete()`: 删除宠物（软删除）
  - `updateStatus()`: 更新状态
  - `getApplicationCount()`: 获取申请数量

**宠物状态流转**:
```
AVAILABLE (可领养)
    │
    ├── 用户提交申请 ──→ PENDING (审核中)
    │                        │
    │                        ├── 审核通过 ──→ ADOPTED (已领养)
    │                        │
    │                        └── 审核拒绝 ──→ AVAILABLE (可领养)
    │
    └── 机构下线 ──→ UNAVAILABLE (已下线)
                           │
                           └── 重新上线 ──→ AVAILABLE (可领养)
```

---

#### 4.2.4 领养服务 (pawfinder-adoption)

**端口**: 8083

**数据库**: pawfinder_adoption

**实体类**:
- `AdoptionApplication`: 领养申请
- `AdoptionRecord`: 领养记录

**Feign Client**:
- `UserClient`: 调用用户服务
  - `getUserById()`: 获取用户信息
  - `getInstitutionById()`: 获取机构信息
  
- `PetClient`: 调用宠物服务
  - `getPetById()`: 获取宠物信息
  - `updatePetStatus()`: 更新宠物状态
  - `getApplicationCount()`: 获取申请数量

**Controller**:
- `AdoptionController`: 领养申请接口
  - POST `/api/adoption/v1/applications` - 提交申请
  - GET `/api/adoption/v1/applications` - 申请列表
  - GET `/api/adoption/v1/applications/{id}` - 申请详情
  - PUT `/api/adoption/v1/applications/{id}` - 更新申请
  - POST `/api/adoption/v1/applications/{id}/approve` - 审核通过
  - POST `/api/adoption/v1/applications/{id}/reject` - 审核拒绝
  - POST `/api/adoption/v1/applications/{id}/cancel` - 取消申请

**Service**:
- `AdoptionService`: 领养业务逻辑
  - `submitApplication()`: 提交申请
  - `listApplications()`: 申请列表
  - `getApplicationById()`: 申请详情
  - `approveApplication()`: 审核通过
  - `rejectApplication()`: 审核拒绝
  - `cancelApplication()`: 取消申请

**申请状态流转**:
```
PENDING (待审核)
    │
    ├── 审核通过 ──→ APPROVED (已通过) ──→ 创建领养记录
    │                                        │
    │                                        └── 更新宠物状态为 ADOPTED
    │
    ├── 审核拒绝 ──→ REJECTED (已拒绝)
    │
    └── 用户取消 ──→ CANCELED (已取消)
```

**分布式事务（Seata AT 模式）**:
```java
@GlobalTransactional
public void approveApplication(String applicationId, String adminNotes) {
    // 1. 更新申请状态
    application.setStatus("APPROVED");
    applicationMapper.updateById(application);
    
    // 2. 创建领养记录
    AdoptionRecord record = new AdoptionRecord();
    record.setApplicationId(applicationId);
    recordMapper.insert(record);
    
    // 3. 调用宠物服务更新状态（Feign）
    petClient.updatePetStatus(application.getPetId(), "ADOPTED");
}
```

---

#### 4.2.5 订单服务 (pawfinder-order)

**端口**: 8084

**数据库**: pawfinder_order

**实体类**:
- `Order`: 订单信息
- `OrderStatus`: 订单状态枚举
- `OrderCreateRequest`: 创建订单请求

**Controller**:
- `OrderController`: 订单管理接口
  - POST `/api/order/v1/orders` - 创建订单
  - GET `/api/order/v1/orders` - 订单列表
  - GET `/api/order/v1/orders/{orderNo}` - 订单详情
  - POST `/api/order/v1/orders/{orderNo}/cancel` - 取消订单
  - PUT `/api/order/v1/orders/{orderNo}/status` - 更新状态

**Service**:
- `OrderService`: 订单业务逻辑
  - `createOrder()`: 创建订单
  - `listOrders()`: 订单列表
  - `getByOrderNo()`: 订单详情
  - `cancelOrder()`: 取消订单
  - `updateStatus()`: 更新状态

**订单状态流转**:
```
PENDING (待支付)
    │
    ├── 支付成功 ──→ PAID (已支付)
    │
    ├── 用户取消 ──→ CANCELED (已取消)
    │
    └── 超时未支付 ──→ EXPIRED (已过期)
```

**订单号生成规则**:
```
格式: PF + 年月日时分秒 + 6位随机数
示例: PF20250113143052123456
```

---

#### 4.2.6 支付服务 (pawfinder-payment)

**端口**: 8085

**数据库**: pawfinder_payment

**实体类**:
- `PaymentTransaction`: 支付流水

**Feign Client**:
- `OrderClient`: 调用订单服务
  - `getOrderByOrderNo()`: 获取订单信息
  - `updateOrderStatus()`: 更新订单状态

**Controller**:
- `PaymentController`: 支付接口
  - POST `/api/payment/v1/pay` - 发起支付
  - POST `/api/payment/v1/notify` - 支付回调
  - GET `/api/payment/v1/query/{orderNo}` - 查询支付状态

**Service**:
- `PaymentService`: 支付业务逻辑
  - `createPayment()`: 创建支付
  - `handleNotify()`: 处理回调
  - `queryPayment()`: 查询支付状态

**支付宝集成**:
```java
// 沙箱环境配置
alipay:
  app-id: ${ALIPAY_APP_ID}
  private-key: ${ALIPAY_PRIVATE_KEY}
  public-key: ${ALIPAY_PUBLIC_KEY}
  gateway: https://openapi.alipaydev.com/gateway.do
  notify-url: ${API_BASE_URL}/api/payment/v1/notify
  return-url: ${FRONTEND_URL}/payment/result
```

**支付流程**:
```
1. 用户点击支付
2. 前端调用 /pay 接口
3. 后端创建支付流水
4. 调用支付宝 SDK 生成支付链接
5. 前端跳转到支付宝支付页面
6. 用户完成支付
7. 支付宝回调 /notify 接口
8. 后端验证签名，更新支付状态
9. 调用订单服务更新订单状态
10. 返回成功响应
```

---

#### 4.2.7 搜索服务 (pawfinder-search)

**端口**: 8086

**数据存储**: Elasticsearch

**实体类**:
- `PetDocument`: ES 文档实体

**Controller**:
- `SearchController`: 搜索接口
  - GET `/api/search/v1/pets` - 搜索宠物
  - POST `/api/search/v1/sync` - 同步数据

**Service**:
- `SearchService`: 搜索业务逻辑
  - `search()`: 搜索宠物
  - `syncFromDatabase()`: 从数据库同步数据

**ES 索引结构**:
```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "name": { 
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "species": { "type": "keyword" },
      "breed": { 
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "gender": { "type": "keyword" },
      "size": { "type": "keyword" },
      "age": { "type": "keyword" },
      "status": { "type": "keyword" },
      "city": { "type": "keyword" },
      "description": { 
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "adoptionFee": { "type": "double" },
      "createdAt": { "type": "date" }
    }
  }
}
```

**搜索功能**:
- 关键词搜索（名称、品种、描述）
- 多条件筛选（物种、性别、体型、年龄、城市）
- 结果排序（时间、费用）
- 分页查询

---

#### 4.2.8 公共模块 (pawfinder-common)

**职责**: 提供公共组件和工具类

**包含内容**:

| 类/组件 | 说明 |
|---------|------|
| `Result<T>` | 统一响应格式 |
| `PageResult<T>` | 分页响应格式 |
| `GlobalExceptionHandler` | 全局异常处理 |
| `JwtUtil` | JWT 工具类 |
| `RedisUtil` | Redis 工具类 |
| `SnowflakeIdGenerator` | 雪花算法 ID 生成器 |

**统一响应格式**:
```java
public class Result<T> {
    private Integer code;      // 状态码
    private String message;    // 消息
    private T data;            // 数据
    private Long timestamp;    // 时间戳
    private String requestId;  // 请求ID
}
```

**全局异常处理**:
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusinessException(BusinessException e) {
        return Result.fail(e.getCode(), e.getMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public Result<?> handleException(Exception e) {
        log.error("系统异常", e);
        return Result.fail(500, "系统异常");
    }
}
```

---

## 5. 数据库设计

### 5.1 数据库架构

采用 **Database per Service** 模式，每个微服务拥有独立数据库。

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MySQL 数据库集群                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │pawfinder_user│  │pawfinder_pet │  │pawfinder_    │              │
│  │              │  │              │ │  adoption    │              │
│  │ - users      │  │ - pets       │  │ - adoption_  │              │
│  │ - institutions│ │              │  │   applications│             │
│  │              │  │              │  │ - adoption_  │              │
│  │              │  │              │  │   records    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐                                 │
│  │pawfinder_    │  │pawfinder_    │                                 │
│  │   order      │  │  payment     │                                 │
│  │              │  │              │                                 │
│  │ - orders     │  │ - payment_   │                                 │
│  │              │  │ transactions │                                 │
│  └──────────────┘  └──────────────┘                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 表结构设计

详细表结构设计请参考 [DATABASE.md](./DATABASE.md)。

### 5.3 数据库分配

| 数据库 | 服务 | 表 |
|--------|------|-----|
| pawfinder_user | user-service | users, institutions |
| pawfinder_pet | pet-service | pets |
| pawfinder_adoption | adoption-service | adoption_applications, adoption_records |
| pawfinder_order | order-service | orders |
| pawfinder_payment | payment-service | payment_transactions |

### 5.4 跨服务数据访问

采用 **OpenFeign** 进行服务间调用，避免跨库 JOIN：

```java
// adoption-service 调用 pet-service
@FeignClient(name = "pet-service", fallbackFactory = PetClientFallbackFactory.class)
public interface PetClient {
    @GetMapping("/api/pet/v1/pets/{id}")
    Result<PetDTO> getPetById(@PathVariable("id") String id);
    
    @PutMapping("/api/pet/v1/pets/{id}/status")
    Result<Void> updatePetStatus(@PathVariable("id") String id, 
                                  @RequestParam("status") String status);
}
```

### 5.5 Redis 缓存设计

| Key 模式 | 类型 | TTL | 说明 |
|----------|------|-----|------|
| `sms:code:{phone}` | String | 5min | 验证码缓存 |
| `user:info:{userId}` | Hash | 30min | 用户信息缓存 |
| `pet:info:{petId}` | Hash | 10min | 宠物信息缓存 |
| `session:{sessionId}` | Hash | 24h | 会话信息 |
| `rate:limit:{ip}:{api}` | String | 1s | 接口限流计数 |

---

## 6. 接口设计

### 6.1 接口规范

详细接口设计请参考 [API-INTERFACE.md](./API-INTERFACE.md)。

### 6.2 统一响应格式

**成功响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": { ... },
    "timestamp": 1736784000000,
    "requestId": "uuid-xxxx-xxxx"
}
```

**失败响应**:
```json
{
    "code": 400,
    "message": "参数错误",
    "data": null,
    "timestamp": 1736784000000,
    "requestId": "uuid-xxxx-xxxx"
}
```

### 6.3 错误码规范

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未授权 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001 | 用户不存在 |
| 1002 | 验证码错误 |
| 2001 | 宠物不存在 |
| 2002 | 宠物状态异常 |
| 3001 | 申请不存在 |
| 3002 | 申请状态异常 |

### 6.4 分页参数

```json
{
    "pageNum": 1,
    "pageSize": 10
}
```

**分页响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [...],
        "total": 100,
        "pageNum": 1,
        "pageSize": 10,
        "pages": 10
    }
}
```

---

## 7. 前端设计

### 7.1 项目结构

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首页
│   │   ├── layout.tsx         # 根布局
│   │   ├── pets/              # 宠物页面
│   │   │   ├── page.tsx       # 宠物列表
│   │   │   └── [id]/          # 宠物详情
│   │   ├── auth/              # 认证页面
│   │   ├── admin/             # 管理后台
│   │   ├── dashboard/         # 用户中心
│   │   └── api/               # API 路由（代理层）
│   ├── components/            # 组件
│   │   ├── layout/            # 布局组件
│   │   ├── pet/               # 宠物相关组件
│   │   ├── auth/              # 认证相关组件
│   │   ├── chat/              # 聊天组件
│   │   └── ui/                # UI 组件（shadcn/ui）
│   ├── contexts/              # React Context
│   ├── hooks/                 # 自定义 Hooks
│   ├── lib/                   # 工具库
│   └── storage/               # 本地存储
├── public/                    # 静态资源
└── package.json
```

### 7.2 页面清单

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 宠物展示、搜索入口 |
| `/pets` | 宠物列表 | 分页、筛选、搜索 |
| `/pets/[id]` | 宠物详情 | 详情、申请领养 |
| `/auth/login` | 登录页 | 手机验证码登录 |
| `/dashboard` | 用户中心 | 个人信息、申请记录 |
| `/admin` | 管理后台 | 宠物管理、申请审核 |
| `/institutions` | 机构列表 | 救助站列表 |
| `/about` | 关于我们 | 项目介绍 |
| `/faq` | 常见问题 | FAQ |

### 7.3 API 配置

```typescript
// src/lib/api-config.ts

const USE_GATEWAY = process.env.NEXT_PUBLIC_USE_GATEWAY === 'true';

const SERVICE_PORTS = {
  user: 8081,
  pet: 8082,
  adoption: 8083,
  order: 8084,
  payment: 8085,
  search: 8086,
};

export const getApiUrl = (service: string, endpoint: string) => {
  if (USE_GATEWAY) {
    return `http://localhost:8080/api/${service}/v1${endpoint}`;
  }
  const port = SERVICE_PORTS[service];
  return `http://localhost:${port}/api/${service}/v1${endpoint}`;
};
```

### 7.4 状态管理

使用 React Context 进行全局状态管理：

```typescript
// 认证上下文
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// 用户上下文
interface UserContextType {
  profile: UserProfile | null;
  applications: AdoptionApplication[];
  refreshProfile: () => Promise<void>;
}
```

---

## 8. 安全设计

### 8.1 认证授权

**JWT 认证流程**:
```
1. 用户登录成功
2. 服务端生成 JWT Token
3. Token 返回给客户端
4. 客户端存储 Token（Cookie/LocalStorage）
5. 后续请求携带 Token
6. 网关/服务验证 Token
7. 解析用户信息
8. 放行请求
```

**JWT 结构**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "xxx",
    "role": "user",
    "exp": 1736784000
  },
  "signature": "xxx"
}
```

### 8.2 权限控制

| 角色 | 权限 |
|------|------|
| user | 查看宠物、提交申请、管理个人信息 |
| institution | 管理机构宠物、审核申请 |
| admin | 系统管理、用户管理、数据统计 |

### 8.3 数据安全

| 安全措施 | 说明 |
|----------|------|
| HTTPS | 全站 HTTPS 加密传输 |
| 密码加密 | BCrypt 哈希存储 |
| SQL 注入防护 | MyBatis-Plus 参数化查询 |
| XSS 防护 | React 自动转义 + CSP |
| CSRF 防护 | SameSite Cookie + Token 验证 |
| 敏感数据脱敏 | 日志脱敏、接口脱敏 |

### 8.4 接口安全

| 措施 | 说明 |
|------|------|
| 限流 | Sentinel 接口限流 |
| 熔断 | 错误率过高自动熔断 |
| 参数校验 | JSR-303 参数验证 |
| 签名验证 | 支付回调签名验证 |

---

## 9. 性能设计

### 9.1 性能目标

| 指标 | 目标值 |
|------|--------|
| 接口平均响应时间 | < 200ms |
| 接口 P99 响应时间 | < 500ms |
| 并发用户数 | 1000+ |
| 系统可用性 | ≥ 99.9% |

### 9.2 缓存策略

**缓存层次**:
```
┌─────────────────┐
│   浏览器缓存     │  静态资源 CDN 缓存
└────────┬────────┘
         │
┌────────▼────────┐
│   CDN 缓存       │  图片、JS、CSS
└────────┬────────┘
         │
┌────────▼────────┐
│   Redis 缓存     │  热点数据缓存
└────────┬────────┘
         │
┌────────▼────────┐
│   MySQL 数据库   │  持久化存储
└─────────────────┘
```

**缓存策略**:
| 数据类型 | 缓存时间 | 更新策略 |
|----------|----------|----------|
| 验证码 | 5 分钟 | 过期自动删除 |
| 用户信息 | 30 分钟 | 写时更新 |
| 宠物信息 | 10 分钟 | 写时失效 |
| 宠物列表 | 1 分钟 | 定时刷新 |

### 9.3 数据库优化

| 优化措施 | 说明 |
|----------|------|
| 索引设计 | 高频查询字段建立索引 |
| 分页查询 | 使用游标分页避免深分页 |
| 连接池 | HikariCP 连接池配置 |
| 读写分离 | 主从复制，读写分离（规划中） |
| 分库分表 | 按业务拆分数据库（已实现） |

### 9.4 前端优化

| 优化措施 | 说明 |
|----------|------|
| SSR | Next.js 服务端渲染 |
| 代码分割 | 动态导入，按需加载 |
| 图片优化 | WebP 格式，懒加载 |
| 缓存策略 | 静态资源长期缓存 |
| CDN 加速 | 静态资源 CDN 分发 |

---

## 10. 部署设计

### 10.1 部署架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                           负载均衡层                                  │
│                          Nginx / SLB                                  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           应用服务层                                  │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │  Gateway    │  │  Gateway    │  │  Gateway    │   (多实例)        │
│  │  (8080)     │  │  (8080)     │  │  (8080)     │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ User-Svc    │  │ Pet-Svc     │  │Adoption-Svc │   (多实例)        │
│  │ (8081)      │  │ (8082)      │  │ (8083)      │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ Order-Svc   │  │Payment-Svc  │  │ Search-Svc  │   (多实例)        │
│  │ (8084)      │  │ (8085)      │  │ (8086)      │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                       │
│  ┌─────────────┐                                                     │
│  │  Frontend   │   Next.js SSR                                      │
│  │  (3000)     │                                                     │
│  └─────────────┘                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           数据存储层                                  │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ MySQL 主从   │  │ Redis 集群  │  │ ES 集群     │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           基础设施层                                  │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ Nacos 集群  │  │Sentinel 控制台│ │ Seata 集群  │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 环境配置

| 环境 | 说明 | 域名 |
|------|------|------|
| 开发环境 | 本地开发 | localhost |
| 测试环境 | 集成测试 | test.pawfinder.com |
| 预发环境 | 预发布验证 | staging.pawfinder.com |
| 生产环境 | 正式环境 | www.pawfinder.com |

### 10.3 容器化部署（规划中）

```yaml
# docker-compose.yml
version: '3.8'
services:
  gateway:
    build: ./pawfinder-gateway
    ports:
      - "8080:8080"
    depends_on:
      - nacos
      
  user-service:
    build: ./pawfinder-user
    ports:
      - "8081:8081"
    depends_on:
      - nacos
      - mysql
      - redis
```

---

## 11. 监控与运维

### 11.1 监控体系

```
┌─────────────────────────────────────────────────────────────────────┐
│                           监控告警体系                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ 应用监控     │  │ 基础设施监控 │  │ 业务监控    │                  │
│  │             │  │             │  │             │                  │
│  │ - 接口性能   │  │ - CPU/内存   │  │ - 注册量    │                  │
│  │ - 错误率    │  │ - 磁盘/网络  │  │ - 领养量    │                  │
│  │ - QPS       │  │ - 数据库连接 │  │ - 支付量    │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ 日志收集     │  │ 链路追踪    │  │ 告警通知    │                  │
│  │             │  │             │  │             │                  │
│  │ - ELK Stack │  │ - SkyWalking│  │ - 钉钉/邮件 │                  │
│  │ - 集中存储   │  │ - 调用链路  │  │ - 短信通知  │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.2 关键指标

| 指标类型 | 指标名称 | 阈值 | 告警级别 |
|----------|----------|------|----------|
| 应用指标 | 接口错误率 | > 1% | Warning |
| 应用指标 | 接口错误率 | > 5% | Critical |
| 应用指标 | 接口响应时间 | > 500ms | Warning |
| 应用指标 | 接口响应时间 | > 2s | Critical |
| 基础指标 | CPU 使用率 | > 80% | Warning |
| 基础指标 | 内存使用率 | > 85% | Warning |
| 基础指标 | 磁盘使用率 | > 90% | Critical |

### 11.3 日志规范

**日志级别**:
| 级别 | 使用场景 |
|------|----------|
| DEBUG | 调试信息（生产环境关闭） |
| INFO | 关键业务流程 |
| WARN | 潜在问题、降级处理 |
| ERROR | 错误异常、需要关注 |

**日志格式**:
```
[时间] [级别] [TraceId] [类名] - 日志内容
```

---

## 附录

### A. 项目目录结构

```
PawFinder/
├── docs/                          # 项目文档
│   ├── 需求分析.md                 # 需求分析文档
│   ├── API-INTERFACE.md           # 接口文档
│   ├── DATABASE.md                # 数据库文档
│   └── USECASE.md                 # 用例图文档
│
├── frontend/                      # 前端项目
│   ├── src/
│   │   ├── app/                   # 页面
│   │   ├── components/            # 组件
│   │   ├── contexts/              # 上下文
│   │   ├── hooks/                 # Hooks
│   │   ├── lib/                   # 工具库
│   │   └── storage/               # 存储
│   ├── public/                    # 静态资源
│   └── package.json
│
├── pawfinder-backend/             # 后端项目
│   ├── pawfinder-gateway/         # 网关服务
│   ├── pawfinder-user/            # 用户服务
│   ├── pawfinder-pet/             # 宠物服务
│   ├── pawfinder-adoption/        # 领养服务
│   ├── pawfinder-order/           # 订单服务
│   ├── pawfinder-payment/         # 支付服务
│   ├── pawfinder-search/          # 搜索服务
│   ├── pawfinder-common/          # 公共模块
│   └── pom.xml
│
└── README.md
```

### B. 相关文档

| 文档 | 路径 | 说明 |
|------|------|------|
| 架构设计 | pawfinder-backend/docs/ARCHITECTURE.md | 后端架构详细设计 |
| 接口文档 | docs/API-INTERFACE.md | 前后端接口规范 |
| 数据库设计 | docs/DATABASE.md | 数据库表结构设计 |
| 需求分析 | docs/需求分析.md | 功能需求分析 |
| 用例图 | docs/USECASE.md | 系统用例图 |
| 部署文档 | pawfinder-backend/docs/DEPLOYMENT.md | 部署指南 |

### C. 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0 | 2025-01-13 | 初始版本，完整系统设计文档 |

---

> **文档维护**: 本文档随系统迭代持续更新，如有疑问请联系开发团队。
