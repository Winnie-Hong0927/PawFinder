# PawFinder 宠物领养系统 - 后端架构设计与实现文档

## 1. 项目概述

### 1.1 项目背景
PawFinder 是一款宠物领养平台，旨在连接待领养宠物与有意愿领养的用户。当前系统采用 Next.js 全栈架构，为实现更好的可扩展性、高并发支持和微服务治理，需要重构为前后端分离的分布式架构。

### 1.2 项目目标
- 实现前后端完全分离，前端专注 UI/UX，后端提供 RESTful API
- 引入微服务架构，提升系统可维护性和可扩展性
- 支持高并发场景下的流量控制与熔断降级
- 实现分布式事务管理，确保数据一致性
- 构建高效的宠物全文检索能力

### 1.3 技术选型

| 组件 | 技术栈 | 版本 | 用途 |
|------|--------|------|------|
| 服务治理 | Spring Cloud Alibaba | 2023.0.3.2 | 微服务整体解决方案 |
| 服务注册/配置 | Nacos | 2.4.3 | 服务发现与配置中心 |
| 网关 | Spring Cloud Gateway | 2023.0.3 | API 网关、路由转发 |
| 流量控制 | Sentinel | 1.8.8 | 流量控制、熔断降级 |
| 分布式事务 | Seata | 2.0.0 | AT 模式分布式事务 |
| ORM | MyBatis-Plus | 3.5.7 | 数据持久层框架 |
| 数据库 | MySQL | 8.0 | 主数据存储 |
| 搜索引擎 | Elasticsearch | 8.15 | 全文检索 |
| 服务调用 | OpenFeign | 3.1.8 | 声明式 HTTP 客户端 |
| 构建工具 | Maven | 3.9+ | 项目构建 |
| Java 版本 | JDK | 21 | 运行时环境 |

---

## 2. 系统架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              客户端层 (Frontend)                            │
│                    Next.js 15 + React 19 + TypeScript                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           网关层 (API Gateway)                              │
│                    Spring Cloud Gateway + Sentinel                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 路由转发    │ │ 流量控制    │ │ 认证授权    │ │ 请求限流    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           服务层 (Microservices)                            │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   用户服务      │  │   宠物服务      │  │   领养服务      │             │
│  │   user-service │  │  pet-service    │  │ adoption-service│             │
│  │   端口: 8081   │  │   端口: 8082   │  │   端口: 8083   │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   订单服务      │  │   支付服务      │  │   搜索服务      │             │
│  │  order-service │  │ payment-service │  │ search-service  │             │
│  │   端口: 8084   │  │   端口: 8085   │  │   端口: 8086   │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                                  │
│  │   文件服务      │  │   通知服务      │                                  │
│  │  file-service   │  │ notify-service  │                                  │
│  │   端口: 8087   │  │   端口: 8088   │                                  │
│  └─────────────────┘  └─────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                    │                    │
                    ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              数据层 (Data Layer)                             │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │     MySQL       │  │  Elasticsearch  │  │     Redis       │             │
│  │   用户/宠物     │  │    宠物索引     │  │   会话/缓存     │             │
│  │   领养/订单     │  │    全文检索     │  │   限流计数      │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────┐                                                      │
│  │     Seata       │                                                      │
│  │   事务协调器    │                                                      │
│  └─────────────────┘                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           基础设施层 (Infrastructure)                        │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                                  │
│  │     Nacos       │  │   Sentinel      │                                  │
│  │  服务注册中心   │  │   控制台        │                                  │
│  │  配置管理中心   │  │   规则配置      │                                  │
│  └─────────────────┘  └─────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 服务职责划分

#### 2.2.1 网关服务 (gateway-service)
- **职责**：统一入口，路由转发，认证授权，流量控制
- **端口**：8080
- **Sentinel 规则**：
  - 全局 QPS 限流：1000
  - 单接口限流：根据业务重要性差异化配置
  - 熔断策略：错误率 > 50% 持续 5 秒触发

#### 2.2.2 用户服务 (user-service)
- **职责**：用户注册/登录/认证，机构管理，用户信息管理
- **端口**：8081
- **数据库表**：users, institutions
- **核心功能**：
  - 手机号 + 验证码登录
  - JWT Token 发放与验证
  - 用户信息 CRUD
  - 机构（救助站）管理

#### 2.2.3 宠物服务 (pet-service)
- **职责**：宠物信息管理，宠物状态管理
- **端口**：8082
- **数据库表**：pets, pet_images
- **核心功能**：
  - 宠物 CRUD
  - 宠物状态变更（待领养/已领养/已下线）
  - 宠物图片管理

#### 2.2.4 领养服务 (adoption-service)
- **职责**：领养申请管理，申请审核流程
- **端口**：8083
- **数据库表**：adoption_applications, adoption_records
- **核心功能**：
  - 领养申请提交
  - 申请状态流转（待审核→通过/拒绝→领养成功）
  - Seata AT 模式：确保申请与状态变更一致性
- **Saga 长事务场景**：
  - 领养完成流程：更新申请状态 → 更新宠物状态 → 创建领养记录 → 发送通知

#### 2.2.5 订单服务 (order-service)
- **职责**：领养费用订单管理
- **端口**：8084
- **数据库表**：orders
- **核心功能**：
  - 订单创建
  - 支付宝支付对接
  - 支付状态回调

#### 2.2.6 支付服务 (payment-service)
- **职责**：第三方支付集成，支付流水记录
- **端口**：8085
- **数据库表**：payment_transactions
- **核心功能**：
  - 支付宝沙箱支付
  - 支付结果查询
  - 异步回调处理
  - Seata AT 模式：确保支付与订单状态一致性

#### 2.2.7 搜索服务 (search-service)
- **职责**：Elasticsearch 索引管理，宠物全文检索
- **端口**：8086
- **索引**：pet_index
- **核心功能**：
  - 宠物数据同步到 ES
  - 多维度搜索（品种、年龄、性别、体型、所在地）
  - 全文关键词检索
  - 热门搜索词推荐

#### 2.2.8 文件服务 (file-service)
- **职责**：文件上传、存储、管理
- **端口**：8087
- **存储**：对象存储（兼容 S3 协议）
- **核心功能**：
  - 宠物图片上传
  - 用户头像上传
  - 文件访问控制

#### 2.2.9 通知服务 (notify-service)
- **职责**：站内消息、短信、邮件通知
- **端口**：8088
- **核心功能**：
  - 申请状态变更通知
  - 领养成功通知
  - 系统公告推送

---

## 3. 数据库设计

### 3.1 数据库总体架构

```
pawfinder_user      - 用户服务数据库
pawfinder_pet       - 宠物服务数据库
pawfinder_adoption  - 领养服务数据库
pawfinder_order     - 订单服务数据库
pawfinder_payment   - 支付服务数据库
```

### 3.2 用户服务数据库 (pawfinder_user)

#### 3.2.1 用户表 (users)
```sql
CREATE TABLE users (
    id              VARCHAR(36) PRIMARY KEY COMMENT '用户ID',
    phone           VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    name            VARCHAR(100) NOT NULL COMMENT '用户名',
    email           VARCHAR(255) COMMENT '邮箱',
    password_hash   VARCHAR(255) COMMENT '密码哈希（第三方登录时为空）',
    role            ENUM('user', 'admin', 'institution_admin') DEFAULT 'user' COMMENT '角色',
    institution_id  VARCHAR(36) COMMENT '所属机构ID',
    avatar_url      VARCHAR(500) COMMENT '头像URL',
    bio             TEXT COMMENT '个人简介',
    address         VARCHAR(255) COMMENT '地址',
    id_card_number  VARCHAR(20) COMMENT '身份证号',
    adopter_status  ENUM('pending', 'verified', 'rejected') DEFAULT 'pending' COMMENT '领养资质状态',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at      TIMESTAMP NULL COMMENT '删除时间',
    INDEX idx_phone (phone),
    INDEX idx_role (role),
    INDEX idx_institution_id (institution_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

#### 3.2.2 机构表 (institutions)
```sql
CREATE TABLE institutions (
    id              VARCHAR(36) PRIMARY KEY COMMENT '机构ID',
    name            VARCHAR(200) NOT NULL COMMENT '机构名称',
    type            ENUM('shelter', 'rescue', 'hospital', 'other') DEFAULT 'shelter' COMMENT '机构类型',
    license_number  VARCHAR(50) COMMENT '营业执照号',
    contact_phone   VARCHAR(20) COMMENT '联系电话',
    contact_email   VARCHAR(255) COMMENT '联系邮箱',
    address         VARCHAR(500) COMMENT '详细地址',
    province        VARCHAR(50) COMMENT '省份',
    city            VARCHAR(50) COMMENT '城市',
    district        VARCHAR(50) COMMENT '区县',
    description     TEXT COMMENT '机构简介',
    logo_url        VARCHAR(500) COMMENT 'Logo URL',
    business_hours  VARCHAR(200) COMMENT '营业时间',
    status          ENUM('active', 'suspended', 'closed') DEFAULT 'active' COMMENT '状态',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at      TIMESTAMP NULL COMMENT '删除时间',
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='机构表';
```

### 3.3 宠物服务数据库 (pawfinder_pet)

#### 3.3.1 宠物表 (pets)
```sql
CREATE TABLE pets (
    id                  VARCHAR(36) PRIMARY KEY COMMENT '宠物ID',
    name                VARCHAR(100) NOT NULL COMMENT '宠物名称',
    species             ENUM('dog', 'cat', 'rabbit', 'other') NOT NULL COMMENT '物种',
    breed               VARCHAR(100) COMMENT '品种',
    age                 VARCHAR(50) COMMENT '年龄',
    gender              ENUM('male', 'female') COMMENT '性别',
    size                ENUM('small', 'medium', 'large') COMMENT '体型',
    images              JSON COMMENT '图片URL列表',
    description         TEXT COMMENT '描述',
    traits              JSON COMMENT '性格特点列表',
    health_status       VARCHAR(50) DEFAULT '健康' COMMENT '健康状况',
    vaccination_status  BOOLEAN DEFAULT FALSE COMMENT '疫苗接种状态',
    sterilization_status BOOLEAN DEFAULT FALSE COMMENT '绝育状态',
    shelter_location    VARCHAR(200) COMMENT '收容所位置',
    adoption_fee        DECIMAL(10,2) DEFAULT 0 COMMENT '领养费用',
    status              ENUM('available', 'pending', 'adopted', 'offline') DEFAULT 'available' COMMENT '状态',
    institution_id      VARCHAR(36) COMMENT '所属机构ID',
    created_by          VARCHAR(36) COMMENT '创建人ID',
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at          TIMESTAMP NULL COMMENT '删除时间',
    INDEX idx_species (species),
    INDEX idx_status (status),
    INDEX idx_institution_id (institution_id),
    INDEX idx_gender (gender),
    INDEX idx_size (size),
    FULLTEXT INDEX ft_breed_desc (breed, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物表';
```

### 3.4 领养服务数据库 (pawfinder_adoption)

#### 3.4.1 领养申请表 (adoption_applications)
```sql
CREATE TABLE adoption_applications (
    id                    VARCHAR(36) PRIMARY KEY COMMENT '申请ID',
    pet_id                VARCHAR(36) NOT NULL COMMENT '宠物ID',
    user_id               VARCHAR(36) NOT NULL COMMENT '申请人ID',
    reason                TEXT COMMENT '领养理由',
    living_condition      TEXT COMMENT '居住环境',
    experience            TEXT COMMENT '养宠经验',
    has_other_pets        BOOLEAN COMMENT '是否有其他宠物',
    other_pets_detail     TEXT COMMENT '其他宠物详情',
    documents             JSON COMMENT '证明材料文件列表',
    living_condition_images JSON COMMENT '居住环境图片',
    status                ENUM('pending', 'approved', 'rejected', 'canceled') DEFAULT 'pending' COMMENT '申请状态',
    admin_notes           TEXT COMMENT '管理员备注',
    reviewed_by           VARCHAR(36) COMMENT '审核人ID',
    reviewed_at           TIMESTAMP COMMENT '审核时间',
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_pet_id (pet_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='领养申请表';
```

#### 3.4.2 领养记录表 (adoption_records)
```sql
CREATE TABLE adoption_records (
    id                    VARCHAR(36) PRIMARY KEY COMMENT '记录ID',
    application_id        VARCHAR(36) NOT NULL COMMENT '申请ID',
    pet_id                VARCHAR(36) NOT NULL COMMENT '宠物ID',
    user_id               VARCHAR(36) NOT NULL COMMENT '领养人ID',
    adopter_name          VARCHAR(100) COMMENT '领养人姓名',
    adopter_phone         VARCHAR(20) COMMENT '领养人电话',
    adopter_address       VARCHAR(500) COMMENT '领养人地址',
    adoption_date         TIMESTAMP COMMENT '领养日期',
    contract_url          VARCHAR(500) COMMENT '领养协议URL',
    notes                 TEXT COMMENT '备注',
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_application_id (application_id),
    INDEX idx_pet_id (pet_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='领养记录表';
```

### 3.5 订单服务数据库 (pawfinder_order)

#### 3.5.1 订单表 (orders)
```sql
CREATE TABLE orders (
    id                VARCHAR(36) PRIMARY KEY COMMENT '订单ID',
    order_no          VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
    user_id           VARCHAR(36) NOT NULL COMMENT '用户ID',
    application_id    VARCHAR(36) COMMENT '关联申请ID',
    pet_id            VARCHAR(36) COMMENT '关联宠物ID',
    amount            DECIMAL(10,2) NOT NULL COMMENT '订单金额',
    status            ENUM('pending', 'paid', 'canceled', 'refunded') DEFAULT 'pending' COMMENT '订单状态',
    payment_method    VARCHAR(20) COMMENT '支付方式',
    paid_at           TIMESTAMP COMMENT '支付时间',
    expire_at         TIMESTAMP COMMENT '过期时间',
    description       VARCHAR(500) COMMENT '订单描述',
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_order_no (order_no),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_pet_id (pet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
```

### 3.6 支付服务数据库 (pawfinder_payment)

#### 3.6.1 支付流水表 (payment_transactions)
```sql
CREATE TABLE payment_transactions (
    id                  VARCHAR(36) PRIMARY KEY COMMENT '交易ID',
    transaction_no      VARCHAR(100) NOT NULL UNIQUE COMMENT '支付流水号',
    order_id            VARCHAR(36) NOT NULL COMMENT '订单ID',
    amount              DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    status              ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending' COMMENT '支付状态',
    payment_channel     VARCHAR(20) COMMENT '支付渠道（alipay/wechat）',
    channel_transaction_no VARCHAR(100) COMMENT '渠道交易号',
    pay_time            TIMESTAMP COMMENT '支付时间',
    callback_data       JSON COMMENT '回调数据',
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_transaction_no (transaction_no),
    INDEX idx_order_id (order_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付流水表';
```

---

## 4. 接口设计

### 4.1 接口规范

#### 4.1.1 统一响应格式
```json
{
    "code": 200,
    "message": "success",
    "data": {},
    "timestamp": 1713523200000,
    "requestId": "uuid"
}
```

#### 4.1.2 错误码规范
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001 | 用户不存在 |
| 1002 | 手机号已注册 |
| 2001 | 宠物不存在 |
| 2002 | 宠物已下架 |
| 3001 | 申请不存在 |
| 3002 | 申请状态不允许操作 |
| 3003 | 已提交过该宠物申请 |
| 4001 | 订单不存在 |
| 4002 | 订单已过期 |
| 5001 | 支付失败 |

### 4.2 用户服务接口 (user-service:8081)

#### 4.2.1 认证接口
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/user/v1/auth/send-code | 发送验证码 | 否 |
| POST | /api/user/v1/auth/verify-code | 验证码登录 | 否 |
| POST | /api/user/v1/auth/refresh-token | 刷新Token | 是 |
| POST | /api/user/v1/auth/logout | 登出 | 是 |

#### 4.2.2 用户接口
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|------|
| GET | /api/user/v1/users/me | 获取当前用户信息 | 是 |
| PUT | /api/user/v1/users/me | 更新当前用户信息 | 是 |
| GET | /api/user/v1/users/{id} | 获取用户详情 | 是 |

#### 4.2.3 机构接口
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|------|
| GET | /api/user/v1/institutions | 机构列表 | 否 |
| GET | /api/user/v1/institutions/{id} | 机构详情 | 否 |
| POST | /api/user/v1/institutions | 创建机构 | 管理员 |
| PUT | /api/user/v1/institutions/{id} | 更新机构 | 管理员 |

### 4.3 宠物服务接口 (pet-service:8082)

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|------|
| GET | /api/pet/v1/pets | 宠物列表（分页） | 否 |
| GET | /api/pet/v1/pets/{id} | 宠物详情 | 否 |
| POST | /api/pet/v1/pets | 创建宠物 | 机构管理员 |
| PUT | /api/pet/v1/pets/{id} | 更新宠物 | 机构管理员 |
| DELETE | /api/pet/v1/pets/{id} | 删除宠物 | 管理员 |
| PUT | /api/pet/v1/pets/{id}/status | 更新宠物状态 | 机构管理员 |

### 4.4 领养服务接口 (adoption-service:8083)

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|------|
| GET | /api/adoption/v1/applications | 申请列表 | 是 |
| GET | /api/adoption/v1/applications/{id} | 申请详情 | 是 |
| POST | /api/adoption/v1/applications | 提交申请 | 是 |
| PUT | /api/adoption/v1/applications/{id} | 更新申请 | 是 |
| DELETE | /api/adoption/v1/applications/{id} | 取消申请 | 是 |
| PUT | /api/adoption/v1/applications/{id}/review | 审核申请 | 管理员 |
| GET | /api/adoption/v1/applications/pet/{petId}/count | 宠物申请人数 | 否 |

### 4.5 订单服务接口 (order-service:8084)

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|------|
| GET | /api/order/v1/orders | 订单列表 | 是 |
| GET | /api/order/v1/orders/{id} | 订单详情 | 是 |
| POST | /api/order/v1/orders | 创建订单 | 是 |
| GET | /api/order/v1/orders/{id}/pay-url | 获取支付链接 | 是 |

### 4.6 支付服务接口 (payment-service:8085)

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|------|
| POST | /api/payment/v1/alipay/pay | 发起支付 | 是 |
| POST | /api/payment/v1/alipay/callback | 支付回调 | 否 |
| GET | /api/payment/v1/transactions/{id} | 交易详情 | 是 |

### 4.7 搜索服务接口 (search-service:8086)

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|------|
| GET | /api/search/v1/pets | 宠物全文检索 | 否 |
| GET | /api/search/v1/pets/suggestions | 搜索建议 | 否 |
| POST | /api/search/v1/pets/sync | 同步宠物数据 | 管理员 |

---

## 5. 服务间调用设计 (OpenFeign)

### 5.1 调用链路

#### 5.1.1 领养申请流程
```
Frontend → Gateway → Adoption Service
                        │
                        ├──→ User Service (验证用户、获取用户信息)
                        │
                        ├──→ Pet Service (验证宠物、获取宠物信息)
                        │
                        └──→ (Seata AT) 写入申请记录
```

#### 5.1.2 审核通过流程 (Saga 长事务)
```
Frontend → Gateway → Adoption Service
                        │
                        ├──→ 开启 Saga 事务
                        │
                        ├──→ 更新申请状态为 approved
                        │
                        ├──→ 更新宠物状态为 adopted (Pet Service)
                        │
                        ├──→ 创建领养记录
                        │
                        ├──→ 发送通知 (Notify Service)
                        │
                        └──→ Saga 事务完成
```

#### 5.1.3 支付流程
```
Frontend → Gateway → Order Service
                        │
                        ├──→ 创建订单
                        │
                        └──→ 调用 Payment Service

Frontend → Gateway → Payment Service
                        │
                        ├──→ 调用 Alipay API
                        │
                        └──→ (Seata AT) 更新订单状态
```

### 5.2 OpenFeign 客户端定义

#### 5.2.1 UserClient
```java
@FeignClient(name = "user-service", fallbackFactory = UserClientFallbackFactory.class)
public interface UserClient {
    
    @GetMapping("/api/user/v1/users/{id}")
    Result<UserVO> getUserById(@PathVariable("id") String id);
    
    @GetMapping("/api/user/v1/users/me")
    Result<UserVO> getCurrentUser(@RequestHeader("Authorization") String token);
}
```

#### 5.2.2 PetClient
```java
@FeignClient(name = "pet-service", fallbackFactory = PetClientFallbackFactory.class)
public interface PetClient {
    
    @GetMapping("/api/pet/v1/pets/{id}")
    Result<PetVO> getPetById(@PathVariable("id") String id);
    
    @PutMapping("/api/pet/v1/pets/{id}/status")
    Result<Void> updatePetStatus(@PathVariable("id") String id, @RequestBody PetStatusUpdateDTO dto);
}
```

---

## 6. 分布式事务设计

### 6.1 Seata AT 模式应用场景

#### 6.1.1 领养申请提交
- **涉及服务**：Adoption Service
- **涉及表**：adoption_applications
- **分支事务**：写入申请记录

#### 6.1.2 支付成功回调
- **涉及服务**：Payment Service, Order Service
- **涉及表**：payment_transactions, orders
- **分支事务**：
  1. Payment Service 更新交易状态
  2. Order Service 更新订单状态

#### 6.1.3 审核通过后领养完成
- **涉及服务**：Adoption Service, Pet Service, Notify Service
- **Seata 无法覆盖**，使用 Saga 模式

### 6.2 Saga 长事务应用场景

#### 6.2.1 领养完成流程
```
State 1: UpdateApplicationApproved
  ├─ Service: Adoption Service
  ├─ Compensation: UpdateApplicationRollback
  └─ Next: UpdatePetStatus

State 2: UpdatePetStatus
  ├─ Service: Pet Service (OpenFeign)
  ├─ Compensation: RestorePetStatus
  └─ Next: CreateAdoptionRecord

State 3: CreateAdoptionRecord
  ├─ Service: Adoption Service
  ├─ Compensation: DeleteAdoptionRecord
  └─ Next: SendNotification

State 4: SendNotification
  ├─ Service: Notify Service (OpenFeign)
  └─ Compensation: (无，本地补偿)
```

---

## 7. Elasticsearch 搜索设计

### 7.1 宠物索引 Mapping

```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "name": { 
        "type": "text",
        "analyzer": "ik_max_word",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "species": { "type": "keyword" },
      "breed": { 
        "type": "text",
        "analyzer": "ik_max_word",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "age": { "type": "keyword" },
      "gender": { "type": "keyword" },
      "size": { "type": "keyword" },
      "description": { 
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "traits": { "type": "keyword" },
      "health_status": { "type": "keyword" },
      "vaccination_status": { "type": "boolean" },
      "sterilization_status": { "type": "boolean" },
      "shelter_location": { "type": "text" },
      "adoption_fee": { "type": "float" },
      "status": { "type": "keyword" },
      "institution_id": { "type": "keyword" },
      "institution_name": { "type": "text" },
      "created_at": { "type": "date" },
      "updated_at": { "type": "date" }
    }
  }
}
```

### 7.2 搜索功能

#### 7.2.1 多条件组合搜索
```json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "status": "available" } },
        { "term": { "species": "dog" } }
      ],
      "should": [
        { "match": { "name": "金毛" } },
        { "match": { "breed": "金毛" } },
        { "match": { "description": "金毛" } }
      ],
      "filter": [
        { "range": { "adoption_fee": { "lte": 500 } } },
        { "term": { "gender": "male" } }
      ]
    }
  }
}
```

#### 7.2.2 热门搜索
- 记录每日搜索关键词
- 返回 Top N 热门词

---

## 8. 网关与流量控制

### 8.1 网关路由配置

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 200

        - id: pet-service
          uri: lb://pet-service
          predicates:
            - Path=/api/pet/**
          filters:
            - StripPrefix=1

        - id: adoption-service
          uri: lb://adoption-service
          predicates:
            - Path=/api/adoption/**
          filters:
            - StripPrefix=1

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/order/**
          filters:
            - StripPrefix=1

        - id: payment-service
          uri: lb://payment-service
          predicates:
            - Path=/api/payment/**
          filters:
            - StripPrefix=1

        - id: search-service
          uri: lb://search-service
          predicates:
            - Path=/api/search/**
          filters:
            - StripPrefix=1
```

### 8.2 Sentinel 规则配置

```json
// 网关流控规则
[
  {
    "resource": "user-service",
    "count": 1000,
    "intervalSec": 1
  },
  {
    "resource": "pet-service",
    "count": 2000,
    "intervalSec": 1
  },
  {
    "resource": "adoption-service",
    "count": 500,
    "intervalSec": 1
  }
]

// 熔断规则
[
  {
    "resource": "payment-service",
    "grade": 1,
    "count": 50,
    "timeWindow": 10
  }
]
```

---

## 9. 项目结构

```
pawfinder-backend/
├── pom.xml                          # 父 POM
├── config.yaml                      # Nacos 配置
│
├── pawfinder-common/                # 公共模块
│   ├── pom.xml
│   └── src/main/java/
│       └── com/pawfinder/common/
│           ├── constant/            # 常量定义
│           ├── exception/           # 异常定义
│           ├── result/             # 统一响应
│           └── util/               # 工具类
│
├── pawfinder-gateway/               # 网关服务
│   ├── pom.xml
│   └── src/main/java/
│       └── com/pawfinder/gateway/
│           ├── config/             # 网关配置
│           ├── filter/             # 网关过滤器
│           └── SentinelConfig.java
│
├── pawfinder-user/                  # 用户服务
│   ├── pom.xml
│   └── src/main/java/
│       └── com/pawfinder/user/
│           ├── controller/
│           ├── service/
│           ├── mapper/
│           ├── entity/
│           ├── dto/
│           ├── feign/              # OpenFeign 客户端
│           └── UserApplication.java
│
├── pawfinder-pet/                   # 宠物服务
│   ├── pom.xml
│   └── src/main/java/
│       └── com/pawfinder/pet/
│           ├── controller/
│           ├── service/
│           ├── mapper/
│           ├── entity/
│           ├── dto/
│           └── PetApplication.java
│
├── pawfinder-adoption/              # 领养服务
│   ├── pom.xml
│   └── src/main/java/
│       └── com/pawfinder/adoption/
│           ├── controller/
│           ├── service/
│           ├── mapper/
│           ├── entity/
│           ├── dto/
│           ├── saga/               # Saga 编排
│           └── AdoptionApplication.java
│
├── pawfinder-order/                 # 订单服务
│   ├── pom.xml
│   └── src/main/java/
│       └── com/pawfinder/order/
│           ├── controller/
│           ├── service/
│           ├── mapper/
│           ├── entity/
│           └── OrderApplication.java
│
├── pawfinder-payment/               # 支付服务
│   ├── pom.xml
│   └── src/main/java/
│       └── com/pawfinder/payment/
│           ├── controller/
│           ├── service/
│           ├── mapper/
│           ├── entity/
│           ├── alipay/             # 支付宝集成
│           └── PaymentApplication.java
│
├── pawfinder-search/                # 搜索服务
│   ├── pom.xml
│   └── src/main/java/
│       └── com/pawfinder/search/
│           ├── controller/
│           ├── service/
│           ├── repository/         # ES Repository
│           ├── document/           # ES 文档
│           └── SearchApplication.java
│
├── pawfinder-file/                  # 文件服务
│   ├── pom.xml
│   └── src/main/java/
│       └── com/pawfinder/file/
│           ├── controller/
│           ├── service/
│           └── FileApplication.java
│
└── pawfinder-notify/                # 通知服务
    ├── pom.xml
    └── src/main/java/
        └── com/pawfinder/notify/
            ├── controller/
            ├── service/
            └── NotifyApplication.java
```

---

## 10. 环境准备

### 10.1 中间件版本要求

| 中间件 | 版本 | 内存 | 说明 |
|--------|------|------|------|
| MySQL | 8.0+ | 2GB+ | 5 个数据库 |
| Redis | 7.0+ | 1GB+ | 缓存+限流 |
| Nacos | 2.4.3 | 1GB+ | 服务发现+配置中心 |
| Seata Server | 2.0.0 | 2GB+ | 分布式事务协调 |
| Elasticsearch | 8.15 | 4GB+ | 全文搜索引擎 |
| Sentinel Dashboard | 1.8.8 | 1GB+ | 流量控制台 |

### 10.2 Nacos 配置中心配置

#### 10.2.1 公共配置
```yaml
spring:
  datasource:
    url: jdbc:mysql://${mysql.host}:3306/${db.name}?useUnicode=true&characterEncoding=utf8
    username: ${mysql.username}
    password: ${mysql.password}
  redis:
    host: ${redis.host}
    port: ${redis.port}
```

#### 10.2.2 服务配置隔离
- 每个服务独立 namespace
- 共享配置使用 shared-configs

---

## 11. 部署架构

### 11.1 开发环境
- 本地启动所有中间件
- 每个服务独立进程
- 前端通过网关访问后端

### 11.2 生产环境
```
                    ┌──────────────┐
                    │   Nginx      │
                    │  负载均衡    │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │ Gateway │       │ Gateway │       │ Gateway │
   │  Cluster│       │  Cluster│       │  Cluster│
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │ Service │       │ Service │       │ Service │
   │  Node 1 │       │  Node 2 │       │  Node 3 │
   └─────────┘       └─────────┘       └─────────┘
```

---

## 12. 开发规范

### 12.1 代码规范
- 遵循阿里 Java 开发规范
- 使用 Lombok 简化代码
- 统一使用 @Slf4j 日志
- 接口需编写 Swagger 注解

### 12.2 Git 分支规范
```
main          - 主分支（生产环境）
develop       - 开发分支
feature/*     - 功能分支
fix/*         - 修复分支
release/*     - 发布分支
```

### 12.3 接口版本控制
- URL 路径包含版本号：/api/{service}/v1/...
- 不同版本独立维护

---

## 13. 实施计划

### Phase 1: 基础设施搭建（1-2周）
- 搭建开发环境（MySQL、Redis、Nacos、ES、Seata、Sentinel）
- 创建项目脚手架
- 实现公共模块

### Phase 2: 核心服务开发（3-4周）
- 用户服务 + 认证
- 宠物服务 + 基础 CRUD
- 搜索服务 + ES 索引

### Phase 3: 业务服务开发（3-4周）
- 领养服务 + Saga 编排
- 订单服务
- 支付服务 + 支付宝集成

### Phase 4: 网关与治理（1-2周）
- 网关配置
- Sentinel 流量控制
- 接口文档

### Phase 5: 联调与测试（2-3周）
- 服务间联调
- 分布式事务测试
- 性能测试

### Phase 6: 上线与优化（1-2周）
- 生产环境部署
- 监控配置
- 应急预案

---

## 14. 风险与对策

| 风险 | 影响 | 对策 |
|------|------|------|
| ES 数据同步延迟 | 搜索结果不及时 | 使用 Canal 实时同步 |
| Seata 高可用 | 单点故障 | 部署 Seata Cluster |
| 服务雪崩 | 级联失败 | Sentinel 熔断降级 |
| 数据一致性 | 分布式事务回滚 | Saga 补偿机制 |
| 支付宝回调失败 | 订单状态不一致 | 定时任务对账 |

---

## 15. 附录

### 15.1 第三方依赖版本
```xml
<spring-boot.version>3.3.5</spring-boot.version>
<spring-cloud.version>2023.0.3.2</spring-cloud.version>
<spring-cloud-alibaba.version>2023.0.3.2</spring-cloud-alibaba.version>
<mybatis-plus.version>3.5.7</mybatis-plus.version>
<seata.version>2.0.0</seata.version>
<sentinel.version>1.8.8</sentinel.version>
<elasticsearch.version>8.15.0</elasticsearch.version>
```

### 15.2 参考文档
- Spring Cloud Alibaba: https://spring-cloud-alibaba-group.github.io/github-pages/2023.0.3.2/en-us/index.html
- Seata: https://seata.apache.org/zh-cn/
- Sentinel: https://sentinelguard.io/zh-cn/
- Nacos: https://nacos.io/zh-cn/docs/quick-start.html
- Elasticsearch: https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html
