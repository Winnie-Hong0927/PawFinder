# PawFinder 前后端接口文档 v2.0

## 架构概述

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────────────────────┐
│   前端页面   │ ──► │  Next.js    │ ──► │        后端微服务               │
│  (React)    │     │  API Routes │     │                                 │
└─────────────┘     │  (代理层)    │     │  ┌─────────┐  ┌─────────────┐  │
                    └─────────────┘     │  │ Gateway │  │ User Svc    │  │
                          │             │  │  (8080) │  │ (8081)      │  │
                          ▼             │  └────┬────┘  └─────────────┘  │
                    ┌─────────────┐     │       │                        │
                    │ 统一响应格式 │     │       ▼                        │
                    │ {code,     │     │  ┌─────────────┐               │
                    │  message,  │     │  │ Pet Svc     │               │
                    │  data}     │     │  │ (8082)      │               │
                    └─────────────┘     │  └─────────────┘               │
                                        │  ┌─────────────┐               │
                                        │  │ Adoption Svc│               │
                                        │  │ (8083)      │               │
                                        │  └─────────────┘               │
                                        │  ┌─────────────┐               │
                                        │  │ Order Svc   │               │
                                        │  │ (8084)      │               │
                                        │  └─────────────┘               │
                                        │  ┌─────────────┐               │
                                        │  │ Payment Svc │               │
                                        │  │ (8085)      │               │
                                        │  └─────────────┘               │
                                        │  ┌─────────────┐               │
                                        │  │ Search Svc  │               │
                                        │  │ (8086)      │               │
                                        │  └─────────────┘               │
                                        └─────────────────────────────────┘
```

## API 配置

### 前端配置文件
**文件**: `frontend/src/lib/api-config.ts`

```typescript
export const API_CONFIG = {
  gateway: process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080',
  services: {
    user: '/api/user',
    pet: '/api/pet',
    adoption: '/api/adoption',
    order: '/api/order',
    payment: '/api/payment',
    search: '/api/search',
  },
  version: 'v1',
};
```

### 后端网关路由
| 服务 | 网关路径 | 后端服务 |
|------|----------|----------|
| 用户服务 | `/api/user/**` | localhost:8081 |
| 宠物服务 | `/api/pet/**` | localhost:8082 |
| 领养服务 | `/api/adoption/**` | localhost:8083 |
| 订单服务 | `/api/order/**` | localhost:8084 |
| 支付服务 | `/api/payment/**` | localhost:8085 |
| 搜索服务 | `/api/search/**` | localhost:8086 |

---

## 接口列表

### 1. 认证模块 (Auth)

#### 1.1 发送验证码
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/auth/send-code` |
| **后端接口** | `POST /api/user/v1/auth/send-code` |
| **后端服务** | User Service (8081) |

**请求参数**:
```json
{
  "phone": "13800138000"
}
```

**后端响应**:
```json
{
  "code": 200,
  "message": "验证码已发送",
  "data": "123456"
}
```

---

#### 1.2 验证码登录
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/auth/verify-code` |
| **后端接口** | `POST /api/user/v1/auth/verify-code` |
| **后端服务** | User Service (8081) |

**请求参数**:
```json
{
  "phone": "13800138000",
  "code": "123456",
  "name": "张三"
}
```

**后端响应**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "userId": "uuid-xxx",
    "user": {
      "id": "uuid-xxx",
      "phone": "13800138000",
      "name": "张三",
      "role": "user"
    }
  }
}
```

---

#### 1.3 获取当前用户信息
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/auth/me` |
| **后端接口** | `GET /api/user/v1/auth/me` |
| **后端服务** | User Service (8081) |
| **认证** | 需要 `Authorization: Bearer <token>` |

---

#### 1.4 更新当前用户信息
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/auth/me` |
| **后端接口** | `POST /api/user/v1/auth/update/me` |
| **后端服务** | User Service (8081) |
| **认证** | 需要 `Authorization: Bearer <token>` |

---

### 2. 用户模块 (User)

#### 2.1 获取用户详情
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/users/{userId}` |
| **后端接口** | `GET /api/user/v1/users/{userId}` |
| **后端服务** | User Service (8081) |

---

#### 2.2 根据手机号获取用户
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/users/phone/{phone}` |
| **后端接口** | `GET /api/user/v1/users/phone/{phone}` |
| **后端服务** | User Service (8081) |

---

### 3. 机构模块 (Institution)

#### 3.1 获取机构列表
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/institutions` |
| **后端接口** | `GET /api/user/v1/institutions` |
| **后端服务** | User Service (8081) |

**请求参数** (Query String):
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| size | number | 否 | 每页数量，默认 10 |
| keyword | string | 否 | 搜索关键词 |

---

#### 3.2 获取机构详情
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/institutions/{id}` |
| **后端接口** | `GET /api/user/v1/institutions/{id}` |
| **后端服务** | User Service (8081) |

---

#### 3.3 创建机构
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/institutions` |
| **后端接口** | `POST /api/user/v1/institutions` |
| **后端服务** | User Service (8081) |

---

#### 3.4 更新机构
| 项目 | 说明 |
|------|------|
| **前端调用** | `PUT /api/institutions/{id}` |
| **后端接口** | `PUT /api/user/v1/institutions/{id}` |
| **后端服务** | User Service (8081) |

---

### 4. 宠物模块 (Pet)

#### 4.1 获取宠物列表
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/pets` |
| **后端接口** | `GET /api/pet/v1/pets` |
| **后端服务** | Pet Service (8082) |

**请求参数** (Query String):
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| size | number | 否 | 每页数量，默认 10 |
| species | string | 否 | 物种: dog/cat/rabbit/other |
| gender | string | 否 | 性别: male/female |
| sizeParam | string | 否 | 体型: small/medium/large |
| status | string | 否 | 状态: available/pending/adopted/offline |
| keyword | string | 否 | 搜索关键词 |

---

#### 4.2 获取宠物详情
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/pets/{id}` |
| **后端接口** | `GET /api/pet/v1/pets/{id}` |
| **后端服务** | Pet Service (8082) |

---

#### 4.3 创建宠物
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/pets` |
| **后端接口** | `POST /api/pet/v1/pets` |
| **后端服务** | Pet Service (8082) |
| **认证** | 需要 `Authorization: Bearer <token>` |

---

#### 4.4 更新宠物
| 项目 | 说明 |
|------|------|
| **前端调用** | `PUT /api/pets/{id}` |
| **后端接口** | `POST /api/pet/v1/pets/update/{id}` |
| **后端服务** | Pet Service (8082) |
| **认证** | 需要 `Authorization: Bearer <token>` |

> **注意**: 后端更新接口是 POST 而不是 PUT

---

#### 4.5 更新宠物状态
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/pets/{id}` (body: {status: "xxx"}) |
| **后端接口** | `POST /api/pet/v1/pets/status/{id}` |
| **后端服务** | Pet Service (8082) |
| **认证** | 需要 `Authorization: Bearer <token>` |

---

#### 4.6 删除宠物
| 项目 | 说明 |
|------|------|
| **前端调用** | `DELETE /api/pets/{id}` |
| **后端接口** | `POST /api/pet/v1/pets/delete/{id}` |
| **后端服务** | Pet Service (8082) |
| **认证** | 需要 `Authorization: Bearer <token>` |

> **注意**: 后端删除接口是 POST 而不是 DELETE

---

#### 4.7 获取宠物申请人数
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/pets/{id}/applications-count` |
| **后端接口** | `GET /api/pet/v1/pets/{id}/application-count` |
| **后端服务** | Pet Service (8082) |

---

### 5. 领养模块 (Adoption)

#### 5.1 获取申请列表（管理员）
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/applications` |
| **后端接口** | `GET /api/adoption/v1/applications` |
| **后端服务** | Adoption Service (8083) |

**请求参数** (Query String):
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| size | number | 否 | 每页数量，默认 10 |
| status | string | 否 | 状态: pending/approved/rejected/cancelled |
| petId | string | 否 | 宠物ID |
| userId | string | 否 | 用户ID |

---

#### 5.2 获取我的申请列表
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/applications?my=true` |
| **后端接口** | `GET /api/adoption/v1/applications/my` |
| **后端服务** | Adoption Service (8083) |
| **认证** | 需要 `Authorization: Bearer <token>` |

---

#### 5.3 获取申请详情
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/applications/{id}` |
| **后端接口** | `GET /api/adoption/v1/applications/{id}` |
| **后端服务** | Adoption Service (8083) |

---

#### 5.4 提交领养申请
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/applications` 或 `POST /api/adoptions/apply` |
| **后端接口** | `POST /api/adoption/v1/applications` |
| **后端服务** | Adoption Service (8083) |
| **认证** | 需要 `Authorization: Bearer <token>` |

**请求参数**:
```json
{
  "petId": "pet-xxx",
  "reason": "领养理由",
  "livingCondition": "居住条件",
  "livingConditionImages": ["url1", "url2"],
  "experience": "养宠经验",
  "hasOtherPets": true,
  "otherPetsDetail": "其他宠物详情",
  "documents": ["doc1", "doc2"]
}
```

---

#### 5.5 审核申请
| 项目 | 说明 |
|------|------|
| **前端调用** | `PATCH /api/applications/{id}` |
| **后端接口** | `POST /api/adoption/v1/applications/{id}/review` |
| **后端服务** | Adoption Service (8083) |
| **认证** | 需要 `Authorization: Bearer <token>` |

**请求参数**:
```json
{
  "status": "approved",
  "adminNotes": "审核备注"
}
```

> **注意**: 后端审核接口是 POST 而不是 PATCH

---

#### 5.6 取消申请
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/applications/{id}` (body: {action: "cancel"}) |
| **后端接口** | `POST /api/adoption/v1/applications/cancel/{id}` |
| **后端服务** | Adoption Service (8083) |
| **认证** | 需要 `Authorization: Bearer <token>` |

---

### 6. 订单模块 (Order)

#### 6.1 创建订单
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/orders` |
| **后端接口** | `POST /api/order/v1/orders` |
| **后端服务** | Order Service (8084) |
| **认证** | 需要 `Authorization: Bearer <token>` |

**请求参数**:
```json
{
  "applicationId": "app-xxx",
  "petId": "pet-xxx",
  "amount": 100.00,
  "description": "领养费用"
}
```

---

#### 6.2 获取用户订单列表
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/orders` |
| **后端接口** | `GET /api/order/v1/orders` |
| **后端服务** | Order Service (8084) |
| **认证** | 需要 `Authorization: Bearer <token>` |

---

#### 6.3 获取所有订单（管理员）
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/orders?all=true` |
| **后端接口** | `GET /api/order/v1/all` |
| **后端服务** | Order Service (8084) |

---

#### 6.4 获取订单详情
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/orders/{orderNo}` |
| **后端接口** | `GET /api/order/v1/orders/{orderNo}` |
| **后端服务** | Order Service (8084) |

---

#### 6.5 取消订单
| 项目 | 说明 |
|------|------|
| **前端调用** | `DELETE /api/orders/{orderNo}` |
| **后端接口** | `POST /api/order/v1/orders/{orderNo}/cancel` |
| **后端服务** | Order Service (8084) |
| **认证** | 需要 `Authorization: Bearer <token>` |

---

### 7. 支付模块 (Payment)

#### 7.1 创建支付
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/payment` |
| **后端接口** | `POST /api/payment/v1/create` |
| **后端服务** | Payment Service (8085) |

**请求参数**:
```json
{
  "orderId": "order-xxx",
  "amount": 100.00
}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "payForm": "<form>...</form>"
  }
}
```

---

#### 7.2 支付回调
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/payment/notify` |
| **后端接口** | `POST /api/payment/v1/callback` |
| **后端服务** | Payment Service (8085) |

> **注意**: 生产环境中，支付宝直接回调后端服务

---

#### 7.3 查询支付状态
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/payment/query?transactionNo=xxx` |
| **后端接口** | `GET /api/payment/v1/status/{transactionNo}` |
| **后端服务** | Payment Service (8085) |

---

### 8. 搜索模块 (Search)

#### 8.1 搜索宠物
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/search/pets` |
| **后端接口** | `GET /api/search/v1/pets` |
| **后端服务** | Search Service (8086) |

**请求参数** (Query String):
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| species | string | 否 | 物种 |
| gender | string | 否 | 性别 |
| size | string | 否 | 体型 |
| status | string | 否 | 状态，默认 AVAILABLE |
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 12 |

---

#### 8.2 同步宠物数据到 ES
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/search/sync` |
| **后端接口** | `POST /api/search/v1/sync` |
| **后端服务** | Search Service (8086) |

---

## 统一响应格式

### 后端响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": 1234567890
}
```

### 前端响应格式
```json
{
  "success": true,
  "message": "success",
  "data": { ... }
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

### 常见错误码
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/登录过期 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 接口对照表

| 前端路由 | 后端接口 | HTTP方法 |
|---------|---------|---------|
| `/api/auth/send-code` | `/api/user/v1/auth/send-code` | POST |
| `/api/auth/verify-code` | `/api/user/v1/auth/verify-code` | POST |
| `/api/auth/me` | `/api/user/v1/auth/me` | GET |
| `/api/auth/me` | `/api/user/v1/auth/update/me` | POST |
| `/api/institutions` | `/api/user/v1/institutions` | GET/POST |
| `/api/institutions/{id}` | `/api/user/v1/institutions/{id}` | GET/PUT |
| `/api/pets` | `/api/pet/v1/pets` | GET/POST |
| `/api/pets/{id}` | `/api/pet/v1/pets/{id}` | GET |
| `/api/pets/{id}` | `/api/pet/v1/pets/update/{id}` | PUT |
| `/api/pets/{id}` | `/api/pet/v1/pets/delete/{id}` | DELETE |
| `/api/pets/{id}/applications-count` | `/api/pet/v1/pets/{id}/application-count` | GET |
| `/api/applications` | `/api/adoption/v1/applications` | GET/POST |
| `/api/applications?my=true` | `/api/adoption/v1/applications/my` | GET |
| `/api/applications/{id}` | `/api/adoption/v1/applications/{id}` | GET |
| `/api/applications/{id}` | `/api/adoption/v1/applications/{id}/review` | PATCH |
| `/api/orders` | `/api/order/v1/orders` | GET/POST |
| `/api/orders/{orderNo}` | `/api/order/v1/orders/{orderNo}` | GET |
| `/api/orders/{orderNo}` | `/api/order/v1/orders/{orderNo}/cancel` | DELETE |
| `/api/payment` | `/api/payment/v1/create` | POST |
| `/api/payment/query` | `/api/payment/v1/status/{transactionNo}` | GET |
