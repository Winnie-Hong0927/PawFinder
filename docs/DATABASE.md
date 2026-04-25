# PawFinder 数据库设计文档

> 本文档包含 PawFinder 宠物领养系统的所有数据库表结构、建表 SQL 以及项目中使用的增删改查 SQL。

---

## 目录

1. [数据库概述](#1-数据库概述)
2. [表结构设计](#2-表结构设计)
   - [users 用户表](#21-users-用户表)
   - [institutions 机构表](#22-institutions-机构表)
   - [pets 宠物表](#23-pets-宠物表)
   - [adoption_applications 领养申请表](#24-adoption_applications-领养申请表)
   - [adoption_records 领养记录表](#25-adoption_records-领养记录表)
   - [orders 订单表](#26-orders-订单表)
   - [payment_transactions 支付流水表](#27-payment_transactions-支付流水表)
3. [建表 SQL 脚本](#3-建表-sql-脚本)
4. [增删改查 SQL 汇总](#4-增删改查-sql-汇总)
5. [索引设计](#5-索引设计)
6. [Elasticsearch 索引设计](#6-elasticsearch-索引设计)

---

## 1. 数据库概述

| 项目 | 说明 |
|------|------|
| 数据库类型 | MySQL 8.0 |
| 字符集 | utf8mb4 |
| 排序规则 | utf8mb4_unicode_ci |
| 主键策略 | 雪花算法生成的分布式 ID (字符串类型) |
| ORM 框架 | MyBatis-Plus |
| 缓存 | Redis 7.0 |

---

## 2. 表结构设计

### 2.1 users 用户表

**表名**: `users`

**所属服务**: pawfinder-user (用户服务)

**字段说明**:

| 字段名 | 类型 | 是否可空 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| id | VARCHAR(32) | NO | - | 主键，雪花算法 ID |
| phone | VARCHAR(20) | YES | NULL | 手机号 |
| name | VARCHAR(100) | YES | NULL | 用户昵称 |
| email | VARCHAR(100) | YES | NULL | 邮箱 |
| password_hash | VARCHAR(255) | YES | NULL | 密码哈希 |
| role | VARCHAR(20) | YES | 'user' | 角色: user, admin, institution |
| institution_id | VARCHAR(32) | YES | NULL | 关联机构 ID |
| avatar_url | VARCHAR(500) | YES | NULL | 头像 URL |
| bio | TEXT | YES | NULL | 个人简介 |
| address | VARCHAR(500) | YES | NULL | 地址 |
| id_card_number | VARCHAR(20) | YES | NULL | 身份证号 |
| adopter_status | VARCHAR(20) | YES | 'pending' | 领养人状态: pending, verified, rejected |
| created_at | DATETIME | YES | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | YES | CURRENT_TIMESTAMP | 更新时间 |
| deleted_at | DATETIME | YES | NULL | 软删除时间 |

**业务逻辑**:
- 用户可通过手机号 + 验证码登录/注册
- 角色分为普通用户、管理员、机构用户
- 领养人状态用于审核领养资格

---

### 2.2 institutions 机构表

**表名**: `institutions`

**所属服务**: pawfinder-user (用户服务)

**字段说明**:

| 字段名 | 类型 | 是否可空 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| id | VARCHAR(32) | NO | - | 主键，雪花算法 ID |
| name | VARCHAR(200) | NO | - | 机构名称 |
| type | VARCHAR(50) | YES | 'shelter' | 类型: shelter(救助站), rescue(救援队), individual(个人救助) |
| license_number | VARCHAR(100) | YES | NULL | 营业执照号 |
| contact_phone | VARCHAR(20) | YES | NULL | 联系电话 |
| contact_email | VARCHAR(100) | YES | NULL | 联系邮箱 |
| address | VARCHAR(500) | YES | NULL | 详细地址 |
| province | VARCHAR(50) | YES | NULL | 省份 |
| city | VARCHAR(50) | YES | NULL | 城市 |
| district | VARCHAR(50) | YES | NULL | 区县 |
| description | TEXT | YES | NULL | 机构介绍 |
| logo_url | VARCHAR(500) | YES | NULL | 机构 Logo |
| business_hours | VARCHAR(100) | YES | NULL | 营业时间 |
| status | VARCHAR(20) | YES | 'active' | 状态: active, inactive, suspended |
| created_at | DATETIME | YES | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | YES | CURRENT_TIMESTAMP | 更新时间 |
| deleted_at | DATETIME | YES | NULL | 软删除时间 |

---

### 2.3 pets 宠物表

**表名**: `pets`

**所属服务**: pawfinder-pet (宠物服务)

**字段说明**:

| 字段名 | 类型 | 是否可空 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| id | VARCHAR(32) | NO | - | 主键，雪花算法 ID |
| name | VARCHAR(100) | YES | NULL | 宠物名字 |
| species | VARCHAR(20) | YES | NULL | 物种: cat, dog, other |
| breed | VARCHAR(100) | YES | NULL | 品种 |
| age | VARCHAR(50) | YES | NULL | 年龄描述 |
| gender | VARCHAR(10) | YES | NULL | 性别: male, female, unknown |
| size | VARCHAR(20) | YES | NULL | 体型: small, medium, large |
| images | TEXT | YES | NULL | 图片 JSON 数组 |
| description | TEXT | YES | NULL | 详细描述 |
| traits | TEXT | YES | NULL | 特点标签 JSON 数组 |
| health_status | VARCHAR(100) | YES | '健康' | 健康状态 |
| vaccination_status | TINYINT(1) | YES | 0 | 是否已接种疫苗 |
| sterilization_status | TINYINT(1) | YES | 0 | 是否已绝育 |
| shelter_location | VARCHAR(200) | YES | NULL | 收容地点 |
| adoption_fee | DECIMAL(10,2) | YES | 0.00 | 领养费用 |
| status | VARCHAR(20) | YES | 'available' | 状态: available, pending, adopted, unavailable |
| institution_id | VARCHAR(32) | YES | NULL | 所属机构 ID |
| created_by | VARCHAR(32) | YES | NULL | 创建人 ID |
| created_at | DATETIME | YES | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | YES | CURRENT_TIMESTAMP | 更新时间 |
| deleted_at | DATETIME | YES | NULL | 软删除时间 |

---

### 2.4 adoption_applications 领养申请表

**表名**: `adoption_applications`

**所属服务**: pawfinder-adoption (领养服务)

**字段说明**:

| 字段名 | 类型 | 是否可空 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| id | VARCHAR(32) | NO | - | 主键，雪花算法 ID |
| pet_id | VARCHAR(32) | NO | - | 申请领养的宠物 ID |
| user_id | VARCHAR(32) | NO | - | 申请人 ID |
| reason | TEXT | YES | NULL | 领养原因 |
| living_condition | TEXT | YES | NULL | 居住条件描述 |
| experience | TEXT | YES | NULL | 养宠经验 |
| has_other_pets | TINYINT(1) | YES | 0 | 是否有其他宠物 |
| other_pets_detail | TEXT | YES | NULL | 其他宠物详情 |
| documents | TEXT | YES | NULL | 证明材料 JSON 数组 |
| living_condition_images | TEXT | YES | NULL | 居住环境图片 JSON 数组 |
| status | VARCHAR(20) | YES | 'pending' | 状态: pending, approved, rejected, canceled |
| admin_notes | TEXT | YES | NULL | 审核备注 |
| reviewed_by | VARCHAR(32) | YES | NULL | 审核人 ID |
| reviewed_at | DATETIME | YES | NULL | 审核时间 |
| created_at | DATETIME | YES | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | YES | CURRENT_TIMESTAMP | 更新时间 |

---

### 2.5 adoption_records 领养记录表

**表名**: `adoption_records`

**所属服务**: pawfinder-adoption (领养服务)

**字段说明**:

| 字段名 | 类型 | 是否可空 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| id | VARCHAR(32) | NO | - | 主键，雪花算法 ID |
| application_id | VARCHAR(32) | NO | - | 关联的申请 ID |
| pet_id | VARCHAR(32) | NO | - | 领养的宠物 ID |
| user_id | VARCHAR(32) | NO | - | 领养人 ID |
| adopter_name | VARCHAR(100) | YES | NULL | 领养人姓名 |
| adopter_phone | VARCHAR(20) | YES | NULL | 领养人电话 |
| adopter_address | VARCHAR(500) | YES | NULL | 领养人地址 |
| adoption_date | DATETIME | YES | NULL | 领养日期 |
| contract_url | VARCHAR(500) | YES | NULL | 领养合同 URL |
| notes | TEXT | YES | NULL | 备注 |
| created_at | DATETIME | YES | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | YES | CURRENT_TIMESTAMP | 更新时间 |

---

### 2.6 orders 订单表

**表名**: `orders`

**所属服务**: pawfinder-order (订单服务)

**字段说明**:

| 字段名 | 类型 | 是否可空 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| id | VARCHAR(32) | NO | - | 主键，UUID |
| order_no | VARCHAR(50) | NO | - | 订单号，唯一 |
| user_id | VARCHAR(32) | NO | - | 用户 ID |
| application_id | VARCHAR(32) | YES | NULL | 关联申请 ID |
| pet_id | VARCHAR(32) | YES | NULL | 关联宠物 ID |
| amount | DECIMAL(10,2) | YES | 0.00 | 订单金额 |
| status | VARCHAR(20) | YES | 'pending' | 状态: pending, paid, canceled, refunded |
| payment_method | VARCHAR(20) | YES | NULL | 支付方式: alipay |
| paid_at | DATETIME | YES | NULL | 支付时间 |
| expire_at | DATETIME | YES | NULL | 过期时间 |
| description | VARCHAR(500) | YES | NULL | 订单描述 |
| created_at | DATETIME | YES | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | YES | CURRENT_TIMESTAMP | 更新时间 |
| deleted_at | DATETIME | YES | NULL | 软删除时间 |

---

### 2.7 payment_transactions 支付流水表

**表名**: `payment_transactions`

**所属服务**: pawfinder-payment (支付服务)

**字段说明**:

| 字段名 | 类型 | 是否可空 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| id | VARCHAR(32) | NO | - | 主键，UUID |
| transaction_no | VARCHAR(50) | NO | - | 支付流水号，唯一 |
| order_id | VARCHAR(32) | NO | - | 关联订单 ID |
| amount | DECIMAL(10,2) | YES | 0.00 | 支付金额 |
| status | VARCHAR(20) | YES | 'pending' | 状态: pending, success, failed, refunded |
| payment_channel | VARCHAR(20) | YES | 'alipay' | 支付渠道 |
| channel_transaction_no | VARCHAR(100) | YES | NULL | 渠道交易号 |
| pay_time | DATETIME | YES | NULL | 支付时间 |
| callback_data | TEXT | YES | NULL | 回调数据 JSON |
| created_at | DATETIME | YES | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | YES | CURRENT_TIMESTAMP | 更新时间 |

---

## 3. 建表 SQL 脚本

```sql
-- =============================================
-- PawFinder 数据库初始化脚本
-- 数据库: MySQL 8.0
-- 字符集: utf8mb4
-- =============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS pawfinder 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE pawfinder;

-- =============================================
-- 1. users 用户表
-- =============================================
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(32) NOT NULL COMMENT '主键，雪花算法ID',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `name` VARCHAR(100) DEFAULT NULL COMMENT '用户昵称',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `password_hash` VARCHAR(255) DEFAULT NULL COMMENT '密码哈希',
    `role` VARCHAR(20) DEFAULT 'user' COMMENT '角色: user, admin, institution',
    `institution_id` VARCHAR(32) DEFAULT NULL COMMENT '关联机构ID',
    `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
    `bio` TEXT DEFAULT NULL COMMENT '个人简介',
    `address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
    `id_card_number` VARCHAR(20) DEFAULT NULL COMMENT '身份证号',
    `adopter_status` VARCHAR(20) DEFAULT 'pending' COMMENT '领养人状态: pending, verified, rejected',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` DATETIME DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_phone` (`phone`),
    KEY `idx_institution_id` (`institution_id`),
    KEY `idx_role` (`role`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =============================================
-- 2. institutions 机构表
-- =============================================
CREATE TABLE IF NOT EXISTS `institutions` (
    `id` VARCHAR(32) NOT NULL COMMENT '主键，雪花算法ID',
    `name` VARCHAR(200) NOT NULL COMMENT '机构名称',
    `type` VARCHAR(50) DEFAULT 'shelter' COMMENT '类型: shelter, rescue, individual',
    `license_number` VARCHAR(100) DEFAULT NULL COMMENT '营业执照号',
    `contact_phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
    `contact_email` VARCHAR(100) DEFAULT NULL COMMENT '联系邮箱',
    `address` VARCHAR(500) DEFAULT NULL COMMENT '详细地址',
    `province` VARCHAR(50) DEFAULT NULL COMMENT '省份',
    `city` VARCHAR(50) DEFAULT NULL COMMENT '城市',
    `district` VARCHAR(50) DEFAULT NULL COMMENT '区县',
    `description` TEXT DEFAULT NULL COMMENT '机构介绍',
    `logo_url` VARCHAR(500) DEFAULT NULL COMMENT '机构Logo',
    `business_hours` VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
    `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态: active, inactive, suspended',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` DATETIME DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_name` (`name`),
    KEY `idx_status` (`status`),
    KEY `idx_city` (`city`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='机构表';

-- =============================================
-- 3. pets 宠物表
-- =============================================
CREATE TABLE IF NOT EXISTS `pets` (
    `id` VARCHAR(32) NOT NULL COMMENT '主键，雪花算法ID',
    `name` VARCHAR(100) DEFAULT NULL COMMENT '宠物名字',
    `species` VARCHAR(20) DEFAULT NULL COMMENT '物种: cat, dog, other',
    `breed` VARCHAR(100) DEFAULT NULL COMMENT '品种',
    `age` VARCHAR(50) DEFAULT NULL COMMENT '年龄描述',
    `gender` VARCHAR(10) DEFAULT NULL COMMENT '性别: male, female, unknown',
    `size` VARCHAR(20) DEFAULT NULL COMMENT '体型: small, medium, large',
    `images` TEXT DEFAULT NULL COMMENT '图片JSON数组',
    `description` TEXT DEFAULT NULL COMMENT '详细描述',
    `traits` TEXT DEFAULT NULL COMMENT '特点标签JSON数组',
    `health_status` VARCHAR(100) DEFAULT '健康' COMMENT '健康状态',
    `vaccination_status` TINYINT(1) DEFAULT 0 COMMENT '是否已接种疫苗',
    `sterilization_status` TINYINT(1) DEFAULT 0 COMMENT '是否已绝育',
    `shelter_location` VARCHAR(200) DEFAULT NULL COMMENT '收容地点',
    `adoption_fee` DECIMAL(10,2) DEFAULT 0.00 COMMENT '领养费用',
    `status` VARCHAR(20) DEFAULT 'available' COMMENT '状态: available, pending, adopted, unavailable',
    `institution_id` VARCHAR(32) DEFAULT NULL COMMENT '所属机构ID',
    `created_by` VARCHAR(32) DEFAULT NULL COMMENT '创建人ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` DATETIME DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    KEY `idx_species` (`species`),
    KEY `idx_status` (`status`),
    KEY `idx_gender` (`gender`),
    KEY `idx_size` (`size`),
    KEY `idx_institution_id` (`institution_id`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='宠物表';

-- =============================================
-- 4. adoption_applications 领养申请表
-- =============================================
CREATE TABLE IF NOT EXISTS `adoption_applications` (
    `id` VARCHAR(32) NOT NULL COMMENT '主键，雪花算法ID',
    `pet_id` VARCHAR(32) NOT NULL COMMENT '申请领养的宠物ID',
    `user_id` VARCHAR(32) NOT NULL COMMENT '申请人ID',
    `reason` TEXT DEFAULT NULL COMMENT '领养原因',
    `living_condition` TEXT DEFAULT NULL COMMENT '居住条件描述',
    `experience` TEXT DEFAULT NULL COMMENT '养宠经验',
    `has_other_pets` TINYINT(1) DEFAULT 0 COMMENT '是否有其他宠物',
    `other_pets_detail` TEXT DEFAULT NULL COMMENT '其他宠物详情',
    `documents` TEXT DEFAULT NULL COMMENT '证明材料JSON数组',
    `living_condition_images` TEXT DEFAULT NULL COMMENT '居住环境图片JSON数组',
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending, approved, rejected, canceled',
    `admin_notes` TEXT DEFAULT NULL COMMENT '审核备注',
    `reviewed_by` VARCHAR(32) DEFAULT NULL COMMENT '审核人ID',
    `reviewed_at` DATETIME DEFAULT NULL COMMENT '审核时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_pet_id` (`pet_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='领养申请表';

-- =============================================
-- 5. adoption_records 领养记录表
-- =============================================
CREATE TABLE IF NOT EXISTS `adoption_records` (
    `id` VARCHAR(32) NOT NULL COMMENT '主键，雪花算法ID',
    `application_id` VARCHAR(32) NOT NULL COMMENT '关联的申请ID',
    `pet_id` VARCHAR(32) NOT NULL COMMENT '领养的宠物ID',
    `user_id` VARCHAR(32) NOT NULL COMMENT '领养人ID',
    `adopter_name` VARCHAR(100) DEFAULT NULL COMMENT '领养人姓名',
    `adopter_phone` VARCHAR(20) DEFAULT NULL COMMENT '领养人电话',
    `adopter_address` VARCHAR(500) DEFAULT NULL COMMENT '领养人地址',
    `adoption_date` DATETIME DEFAULT NULL COMMENT '领养日期',
    `contract_url` VARCHAR(500) DEFAULT NULL COMMENT '领养合同URL',
    `notes` TEXT DEFAULT NULL COMMENT '备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_application_id` (`application_id`),
    KEY `idx_pet_id` (`pet_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_adoption_date` (`adoption_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='领养记录表';

-- =============================================
-- 6. orders 订单表
-- =============================================
CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(32) NOT NULL COMMENT '主键，UUID',
    `order_no` VARCHAR(50) NOT NULL COMMENT '订单号',
    `user_id` VARCHAR(32) NOT NULL COMMENT '用户ID',
    `application_id` VARCHAR(32) DEFAULT NULL COMMENT '关联申请ID',
    `pet_id` VARCHAR(32) DEFAULT NULL COMMENT '关联宠物ID',
    `amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '订单金额',
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending, paid, canceled, refunded',
    `payment_method` VARCHAR(20) DEFAULT NULL COMMENT '支付方式',
    `paid_at` DATETIME DEFAULT NULL COMMENT '支付时间',
    `expire_at` DATETIME DEFAULT NULL COMMENT '过期时间',
    `description` VARCHAR(500) DEFAULT NULL COMMENT '订单描述',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` DATETIME DEFAULT NULL COMMENT '软删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_order_no` (`order_no`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`),
    KEY `idx_application_id` (`application_id`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- =============================================
-- 7. payment_transactions 支付流水表
-- =============================================
CREATE TABLE IF NOT EXISTS `payment_transactions` (
    `id` VARCHAR(32) NOT NULL COMMENT '主键，UUID',
    `transaction_no` VARCHAR(50) NOT NULL COMMENT '支付流水号',
    `order_id` VARCHAR(32) NOT NULL COMMENT '关联订单ID',
    `amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '支付金额',
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending, success, failed, refunded',
    `payment_channel` VARCHAR(20) DEFAULT 'alipay' COMMENT '支付渠道',
    `channel_transaction_no` VARCHAR(100) DEFAULT NULL COMMENT '渠道交易号',
    `pay_time` DATETIME DEFAULT NULL COMMENT '支付时间',
    `callback_data` TEXT DEFAULT NULL COMMENT '回调数据JSON',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_transaction_no` (`transaction_no`),
    KEY `idx_order_id` (`order_id`),
    KEY `idx_status` (`status`),
    KEY `idx_pay_time` (`pay_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付流水表';
```

---

## 4. 增删改查 SQL 汇总

> 项目使用 MyBatis-Plus，大部分 SQL 由框架自动生成。以下列出各服务中实际使用的关键 SQL 操作。

### 4.1 用户服务 (pawfinder-user)

#### 用户表 (users)

```sql
-- =============================================
-- 查询操作
-- =============================================

-- 根据手机号查询用户
SELECT * FROM users WHERE phone = ? AND deleted_at IS NULL;

-- 根据 ID 查询用户
SELECT * FROM users WHERE id = ? AND deleted_at IS NULL;

-- =============================================
-- 插入操作
-- =============================================

-- 创建新用户
INSERT INTO users (id, phone, name, role, adopter_status, created_at, updated_at)
VALUES (?, ?, ?, 'user', 'pending', NOW(), NOW());

-- =============================================
-- 更新操作
-- =============================================

-- 更新用户信息
UPDATE users SET 
    name = ?, 
    email = ?, 
    avatar_url = ?, 
    bio = ?, 
    address = ?, 
    id_card_number = ?,
    updated_at = NOW()
WHERE id = ? AND deleted_at IS NULL;

-- =============================================
-- 删除操作
-- =============================================

-- 软删除用户
UPDATE users SET deleted_at = NOW() WHERE id = ?;
```

#### 机构表 (institutions)

```sql
-- =============================================
-- 查询操作
-- =============================================

-- 根据 ID 查询机构
SELECT * FROM institutions WHERE id = ? AND deleted_at IS NULL;

-- 分页查询机构列表
SELECT * FROM institutions 
WHERE status = 'active' 
  AND deleted_at IS NULL
  AND (name LIKE ? OR address LIKE ?)
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- 查询机构总数
SELECT COUNT(*) FROM institutions 
WHERE status = 'active' 
  AND deleted_at IS NULL
  AND (name LIKE ? OR address LIKE ?);

-- 检查机构名称是否存在
SELECT COUNT(*) FROM institutions 
WHERE name = ? AND deleted_at IS NULL;

-- =============================================
-- 插入操作
-- =============================================

-- 创建机构
INSERT INTO institutions (
    id, name, type, license_number, contact_phone, contact_email,
    address, province, city, district, description, logo_url,
    business_hours, status, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW());

-- =============================================
-- 更新操作
-- =============================================

-- 更新机构信息
UPDATE institutions SET 
    name = ?, type = ?, license_number = ?, contact_phone = ?,
    contact_email = ?, address = ?, province = ?, city = ?,
    district = ?, description = ?, logo_url = ?, business_hours = ?,
    updated_at = NOW()
WHERE id = ? AND deleted_at IS NULL;
```

### 4.2 宠物服务 (pawfinder-pet)

#### 宠物表 (pets)

```sql
-- =============================================
-- 查询操作
-- =============================================

-- 根据 ID 查询宠物
SELECT * FROM pets WHERE id = ? AND deleted_at IS NULL;

-- 分页查询宠物列表（带筛选条件）
SELECT * FROM pets 
WHERE status = ? 
  AND deleted_at IS NULL
  AND (? IS NULL OR species = ?)
  AND (? IS NULL OR gender = ?)
  AND (? IS NULL OR size = ?)
  AND (? IS NULL OR name LIKE ? OR breed LIKE ? OR description LIKE ?)
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- 查询所有可领养宠物（用于 ES 同步）
SELECT * FROM pets 
WHERE status = 'available' AND deleted_at IS NULL
ORDER BY created_at DESC;

-- =============================================
-- 插入操作
-- =============================================

-- 创建宠物
INSERT INTO pets (
    id, name, species, breed, age, gender, size, images, description,
    traits, health_status, vaccination_status, sterilization_status,
    shelter_location, adoption_fee, status, institution_id, created_by,
    created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', ?, ?, NOW(), NOW());

-- =============================================
-- 更新操作
-- =============================================

-- 更新宠物信息
UPDATE pets SET 
    name = ?, species = ?, breed = ?, age = ?, gender = ?, size = ?,
    images = ?, description = ?, traits = ?, health_status = ?,
    vaccination_status = ?, sterilization_status = ?, shelter_location = ?,
    adoption_fee = ?, updated_at = NOW()
WHERE id = ? AND deleted_at IS NULL;

-- 更新宠物状态（领养审核通过后）
UPDATE pets SET status = 'adopted', updated_at = NOW() 
WHERE id = ? AND deleted_at IS NULL;

-- =============================================
-- 删除操作
-- =============================================

-- 软删除宠物
UPDATE pets SET deleted_at = NOW() WHERE id = ?;
```

### 4.3 领养服务 (pawfinder-adoption)

#### 领养申请表 (adoption_applications)

```sql
-- =============================================
-- 查询操作
-- =============================================

-- 根据 ID 查询申请
SELECT * FROM adoption_applications WHERE id = ?;

-- 查询宠物的待审核申请数量
SELECT COUNT(*) FROM adoption_applications 
WHERE pet_id = ? AND status = 'pending';

-- 查询用户的申请列表（分页）
SELECT * FROM adoption_applications 
WHERE user_id = ? 
  AND (? IS NULL OR status = ?)
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- 查询所有申请列表（管理员，分页）
SELECT * FROM adoption_applications 
WHERE (? IS NULL OR status = ?)
  AND (? IS NULL OR pet_id = ?)
  AND (? IS NULL OR user_id = ?)
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- 检查用户是否已申请过该宠物
SELECT COUNT(*) FROM adoption_applications 
WHERE pet_id = ? AND user_id = ? AND status != 'canceled';

-- =============================================
-- 插入操作
-- =============================================

-- 创建领养申请
INSERT INTO adoption_applications (
    id, pet_id, user_id, reason, living_condition, experience,
    has_other_pets, other_pets_detail, documents, living_condition_images,
    status, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW());

-- =============================================
-- 更新操作
-- =============================================

-- 审核申请
UPDATE adoption_applications SET 
    status = ?, 
    reviewed_by = ?, 
    reviewed_at = NOW(),
    admin_notes = ?,
    updated_at = NOW()
WHERE id = ?;

-- 取消申请
UPDATE adoption_applications SET status = 'canceled', updated_at = NOW() 
WHERE id = ? AND user_id = ?;
```

#### 领养记录表 (adoption_records)

```sql
-- =============================================
-- 插入操作
-- =============================================

-- 创建领养记录（审核通过后）
INSERT INTO adoption_records (
    id, application_id, pet_id, user_id, adopter_name, adopter_phone,
    adopter_address, adoption_date, contract_url, notes,
    created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, NOW(), NOW());

-- =============================================
-- 查询操作
-- =============================================

-- 根据 ID 查询领养记录
SELECT * FROM adoption_records WHERE id = ?;

-- 查询用户的领养记录
SELECT * FROM adoption_records WHERE user_id = ? ORDER BY adoption_date DESC;
```

### 4.4 订单服务 (pawfinder-order)

#### 订单表 (orders)

```sql
-- =============================================
-- 查询操作
-- =============================================

-- 根据订单号查询
SELECT * FROM orders WHERE order_no = ? AND deleted_at IS NULL;

-- 查询用户订单列表（分页）
SELECT * FROM orders 
WHERE user_id = ? AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- =============================================
-- 插入操作
-- =============================================

-- 创建订单
INSERT INTO orders (
    id, order_no, user_id, application_id, pet_id, amount,
    status, description, expire_at, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, DATE_ADD(NOW(), INTERVAL 24 HOUR), NOW(), NOW());

-- =============================================
-- 更新操作
-- =============================================

-- 更新订单状态
UPDATE orders SET 
    status = ?,
    paid_at = IF(? = 'paid', NOW(), paid_at),
    updated_at = NOW()
WHERE order_no = ? AND deleted_at IS NULL;

-- 取消订单
UPDATE orders SET status = 'canceled', updated_at = NOW() 
WHERE order_no = ? AND user_id = ? AND status = 'pending' AND deleted_at IS NULL;

-- =============================================
-- 删除操作
-- =============================================

-- 软删除订单
UPDATE orders SET deleted_at = NOW() WHERE id = ?;
```

### 4.5 支付服务 (pawfinder-payment)

#### 支付流水表 (payment_transactions)

```sql
-- =============================================
-- 查询操作
-- =============================================

-- 根据流水号查询
SELECT * FROM payment_transactions WHERE transaction_no = ?;

-- 根据订单 ID 查询
SELECT * FROM payment_transactions WHERE order_id = ?;

-- =============================================
-- 插入操作
-- =============================================

-- 创建支付流水
INSERT INTO payment_transactions (
    id, transaction_no, order_id, amount, status, payment_channel,
    created_at, updated_at
) VALUES (?, ?, ?, ?, 'pending', 'alipay', NOW(), NOW());

-- =============================================
-- 更新操作
-- =============================================

-- 更新支付状态（支付成功）
UPDATE payment_transactions SET 
    status = 'success',
    channel_transaction_no = ?,
    pay_time = NOW(),
    callback_data = ?,
    updated_at = NOW()
WHERE transaction_no = ? AND status = 'pending';

-- 支付失败
UPDATE payment_transactions SET 
    status = 'failed',
    callback_data = ?,
    updated_at = NOW()
WHERE transaction_no = ?;

-- 退款
UPDATE payment_transactions SET 
    status = 'refunded',
    updated_at = NOW()
WHERE transaction_no = ?;
```

---

## 5. 索引设计

### 5.1 主键索引

所有表均使用雪花算法生成的分布式 ID 作为主键，保证全局唯一性。

### 5.2 唯一索引

| 表名 | 索引名 | 字段 | 说明 |
|------|--------|------|------|
| users | uk_phone | phone | 手机号唯一 |
| institutions | uk_name | name | 机构名称唯一 |
| orders | uk_order_no | order_no | 订单号唯一 |
| payment_transactions | uk_transaction_no | transaction_no | 流水号唯一 |
| adoption_records | uk_application_id | application_id | 申请 ID 唯一 |

### 5.3 普通索引

| 表名 | 索引名 | 字段 | 说明 |
|------|--------|------|------|
| users | idx_institution_id | institution_id | 机构关联查询 |
| users | idx_role | role | 角色筛选 |
| institutions | idx_status | status | 状态筛选 |
| institutions | idx_city | city | 城市筛选 |
| pets | idx_species | species | 物种筛选 |
| pets | idx_status | status | 状态筛选 |
| pets | idx_gender | gender | 性别筛选 |
| pets | idx_size | size | 体型筛选 |
| pets | idx_institution_id | institution_id | 机构关联 |
| adoption_applications | idx_pet_id | pet_id | 宠物关联 |
| adoption_applications | idx_user_id | user_id | 用户关联 |
| adoption_applications | idx_status | status | 状态筛选 |
| orders | idx_user_id | user_id | 用户订单查询 |
| orders | idx_status | status | 状态筛选 |
| payment_transactions | idx_order_id | order_id | 订单关联 |

---

## 6. Elasticsearch 索引设计

### 6.1 宠物索引 (pets)

用于全文检索和复杂筛选。

```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "name": { 
        "type": "text", 
        "analyzer": "ik_max_word",
        "search_analyzer": "ik_smart"
      },
      "species": { "type": "keyword" },
      "breed": { 
        "type": "text", 
        "analyzer": "ik_max_word",
        "search_analyzer": "ik_smart"
      },
      "gender": { "type": "keyword" },
      "size": { "type": "keyword" },
      "status": { "type": "keyword" },
      "description": { 
        "type": "text", 
        "analyzer": "ik_max_word",
        "search_analyzer": "ik_smart"
      },
      "institutionId": { "type": "keyword" },
      "shelterLocation": { "type": "text" },
      "images": { "type": "text" },
      "adoptionFee": { "type": "scaled_float", "scaling_factor": 100 },
      "healthStatus": { "type": "keyword" },
      "vaccinationStatus": { "type": "boolean" },
      "sterilizationStatus": { "type": "boolean" },
      "createdAt": { "type": "date" },
      "updatedAt": { "type": "date" }
    }
  }
}
```

---

## 附录：Redis 缓存 Key 设计

| Key 模式 | 类型 | TTL | 说明 |
|----------|------|-----|------|
| `sms:code:{phone}` | String | 5 分钟 | 短信验证码 |
| `pet:application:count:{petId}` | String | 1 小时 | 宠物申请数量缓存 |
| `user:info:{userId}` | Hash | 30 分钟 | 用户信息缓存 |
| `pet:detail:{petId}` | Hash | 10 分钟 | 宠物详情缓存 |
| `institution:detail:{id}` | Hash | 30 分钟 | 机构详情缓存 |

---

> 文档版本: v1.0  
> 更新时间: 2025-04-22  
> 维护者: PawFinder 开发团队
