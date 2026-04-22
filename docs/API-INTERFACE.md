# PawFinder 前后端接口文档

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
                    │ {success,   │     │  ┌─────────────┐               │
                    │  data/error}│     │  │ Pet Svc     │               │
                    └─────────────┘     │  │ (8082)      │               │
                                        │  └─────────────┘               │
                                        │  ┌─────────────┐               │
                                        │  │ Adoption Svc│               │
                                        │  │ (8083)      │               │
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

---

## 接口列表

### 1. 认证模块 (Auth)

#### 1.1 发送验证码
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/auth/send-code` |
| **后端接口** | `POST http://localhost:8080/api/user/v1/auth/send-code` |
| **后端服务** | User Service (8081) |

**请求参数**:
```json
{
  "phone": "13800138000",
  "type": "login"  // 可选，默认 login
}
```

**后端响应**:
```json
{
  "code": 200,
  "message": "验证码已发送",
  "data": "123456",  // 验证码（仅开发环境返回）
  "timestamp": 1234567890
}
```

**前端响应**:
```json
{
  "success": true,
  "message": "验证码已发送",
  "debug_code": "123456"  // 仅开发环境
}
```

---

#### 1.2 验证码登录
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/auth/verify-code` |
| **后端接口** | `POST http://localhost:8080/api/user/v1/auth/verify-code` |
| **后端服务** | User Service (8081) |

**请求参数**:
```json
{
  "phone": "13800138000",
  "code": "123456",
  "name": "张三"  // 可选，首次登录时设置用户名
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

**前端响应** (同时设置 `token` Cookie):
```json
{
  "success": true,
  "message": "登录成功",
  "user": {
    "id": "uuid-xxx",
    "phone": "13800138000",
    "name": "张三",
    "role": "user"
  }
}
```

---

#### 1.3 获取当前用户
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/auth/me` |
| **后端接口** | `GET http://localhost:8080/api/user/v1/users/me` |
| **后端服务** | User Service (8081) |
| **认证** | 需要 `Authorization: Bearer <token>` |

**后端响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "uuid-xxx",
    "phone": "13800138000",
    "name": "张三",
    "role": "user",
    "institutionId": "inst-xxx"
  }
}
```

---

### 2. 宠物模块 (Pet)

#### 2.1 获取宠物列表
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/pets` |
| **后端接口** | `GET http://localhost:8080/api/pet/v1/pets` |
| **后端服务** | Pet Service (8082) |

**请求参数** (Query String):
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| species | string | 否 | 物种: dog/cat/rabbit/other |
| size | string | 否 | 体型: small/medium/large |
| status | string | 否 | 状态: available/pending/adopted/offline，默认 available |
| institutionId | string | 否 | 机构ID |
| page/current | number | 否 | 页码，默认 1 |
| limit/size | number | 否 | 每页数量，默认 12 |

**后端响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": "pet-xxx",
        "name": "旺财",
        "species": "dog",
        "breed": "金毛",
        "age": "2岁",
        "gender": "male",
        "status": "available",
        "images": ["url1", "url2"],
        "institutionId": "inst-xxx"
      }
    ],
    "total": 100,
    "current": 1,
    "size": 12,
    "pages": 9
  }
}
```

**前端响应**:
```json
{
  "success": true,
  "pets": [...],
  "total": 100,
  "page": 1,
  "limit": 12,
  "pages": 9
}
```

---

#### 2.2 获取宠物详情
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/pets/[id]` |
| **后端接口** | `GET http://localhost:8080/api/pet/v1/pets/{id}` |
| **后端服务** | Pet Service (8082) |

**后端响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "pet-xxx",
    "name": "旺财",
    "species": "dog",
    "breed": "金毛",
    "age": "2岁",
    "gender": "male",
    "size": "large",
    "images": ["url1", "url2"],
    "description": "性格温顺...",
    "traits": ["友善", "活泼"],
    "healthStatus": "健康",
    "vaccinationStatus": true,
    "sterilizationStatus": true,
    "shelterLocation": "上海市浦东新区",
    "adoptionFee": 0,
    "status": "available",
    "institutionId": "inst-xxx",
    "institutionName": "上海浦东救助中心"
  }
}
```

---

#### 2.3 创建宠物
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/pets` |
| **后端接口** | `POST http://localhost:8080/api/pet/v1/pets` |
| **后端服务** | Pet Service (8082) |
| **认证** | 需要管理员权限 |

**请求参数**:
```json
{
  "name": "旺财",
  "species": "dog",
  "breed": "金毛",
  "age": "2岁",
  "gender": "male",
  "size": "large",
  "images": ["url1", "url2"],
  "description": "性格温顺...",
  "institutionId": "inst-xxx"
}
```

---

#### 2.4 更新宠物状态
| 项目 | 说明 |
|------|------|
| **前端调用** | `PATCH /api/pets/[id]` |
| **后端接口** | `PATCH http://localhost:8080/api/pet/v1/pets/{id}/status` |
| **后端服务** | Pet Service (8082) |

**请求参数**:
```json
{
  "status": "adopted"
}
```

---

#### 2.5 获取宠物申请人数
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/pets/[id]/applications-count` |
| **后端接口** | `GET http://localhost:8080/api/adoption/v1/applications/pet/{petId}/count` |
| **后端服务** | Adoption Service (8083) |

**响应**:
```json
{
  "code": 200,
  "data": {
    "count": 5
  }
}
```

---

### 3. 领养申请模块 (Application)

#### 3.1 获取申请列表
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/applications` |
| **后端接口** | `GET http://localhost:8080/api/adoption/v1/applications` |
| **后端服务** | Adoption Service (8083) |

**请求参数** (Query String):
| 参数 | 类型 | 说明 |
|------|------|------|
| my | boolean | 获取我的申请 |
| pending | boolean | 获取待审核申请（管理员） |
| status | string | 筛选状态 |
| pet_id | string | 筛选宠物 |
| user_id | string | 筛选用户 |
| page | number | 页码 |
| size | number | 每页数量 |

**后端路由**:
- `my=true` → `/api/adoption/v1/applications/my`
- `pending=true` → `/api/adoption/v1/applications/pending`
- 其他 → `/api/adoption/v1/applications`

---

#### 3.2 创建领养申请
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/applications` |
| **后端接口** | `POST http://localhost:8080/api/adoption/v1/applications` |
| **后端服务** | Adoption Service (8083) |
| **认证** | 需要登录 |

**请求参数**:
```json
{
  "petId": "pet-xxx",
  "reason": "我很喜欢这只狗狗...",
  "livingCondition": "住在小区，有独立住房...",
  "experience": "之前养过狗...",
  "hasOtherPets": false,
  "otherPetsDetail": "",
  "livingConditionImages": ["url1", "url2"]
}
```

---

#### 3.3 获取申请详情
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/applications/[id]` |
| **后端接口** | `GET http://localhost:8080/api/adoption/v1/applications/{id}` |
| **后端服务** | Adoption Service (8083) |

---

#### 3.4 审核申请
| 项目 | 说明 |
|------|------|
| **前端调用** | `PATCH /api/applications/[id]` |
| **后端接口** | `PATCH http://localhost:8080/api/adoption/v1/applications/{id}/review` |
| **后端服务** | Adoption Service (8083) |
| **认证** | 需要管理员权限 |

**请求参数**:
```json
{
  "status": "approved",  // approved 或 rejected
  "adminNotes": "审核通过"
}
```

---

### 4. 领养记录模块 (Adoption)

#### 4.1 获取我的领养记录
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/adoptions` |
| **后端接口** | `GET http://localhost:8080/api/adoption/v1/adoptions/my` |
| **后端服务** | Adoption Service (8083) |
| **认证** | 需要登录 |

---

### 5. 机构模块 (Institution)

#### 5.1 获取机构列表
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/institutions` |
| **后端接口** | `GET http://localhost:8080/api/user/v1/institutions` |
| **后端服务** | User Service (8081) |

---

#### 5.2 获取机构详情
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/institutions/[id]` |
| **后端接口** | `GET http://localhost:8080/api/user/v1/institutions/{id}` |
| **后端服务** | User Service (8081) |

---

#### 5.3 创建机构
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/institutions` |
| **后端接口** | `POST http://localhost:8080/api/user/v1/institutions` |
| **后端服务** | User Service (8081) |
| **认证** | 需要管理员权限 |

---

### 6. 其他模块

#### 6.1 视频 API
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET /api/videos` |
| **后端接口** | 待实现 |

#### 6.2 捐赠 API
| 项目 | 说明 |
|------|------|
| **前端调用** | `GET/POST /api/donations` |
| **后端接口** | 待实现 |

#### 6.3 聊天推荐 API
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/chat/recommend` |
| **后端接口** | `POST http://localhost:8080/api/pet/v1/pets` (复用宠物列表接口) |

#### 6.4 支付 API
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/payment` |
| **说明** | 支付宝签名，无需后端 |

#### 6.5 文件上传 API
| 项目 | 说明 |
|------|------|
| **前端调用** | `POST /api/upload` |
| **说明** | S3 存储，无需后端数据库 |

---

## 后端响应格式

### 统一响应结构
```typescript
interface ApiResponse<T> {
  code: number;       // 200 成功，其他为错误码
  message: string;    // 响应消息
  data: T;            // 响应数据
  timestamp: number;  // 时间戳
}
```

### 分页响应结构
```typescript
interface PageResponse<T> {
  records: T[];       // 数据列表
  total: number;      // 总记录数
  current: number;    // 当前页
  size: number;       // 每页大小
  pages: number;      // 总页数
}
```

### 错误码
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 前端代理层代码示例

### 基本请求方法
```typescript
// frontend/src/app/api/pets/route.ts
async function requestBackend<T>(
  url: string,
  options: RequestInit = {},
  request: NextRequest
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 传递认证信息
  const cookieHeader = request.headers.get("cookie") || "";
  if (cookieHeader.includes('token=')) {
    const match = cookieHeader.match(/token=([^;]+)/);
    if (match) {
      headers['Authorization'] = `Bearer ${match[1]}`;
    }
  }

  const response = await fetch(url, { ...options, headers });
  return response.json();
}
```

### 调用示例
```typescript
// 获取宠物列表
export async function GET(request: NextRequest) {
  const result = await requestBackend<ApiResponse<PageResponse<Pet>>>(
    API_ENDPOINTS.pets,
    { method: 'GET' },
    request
  );

  if (result.code !== 200) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    pets: result.data.records,
    total: result.data.total,
  });
}
```

---

## API 端点配置

**文件**: `frontend/src/lib/api-config.ts`

```typescript
export const API_ENDPOINTS = {
  // Auth
  sendCode: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/auth/send-code`,
  verifyCode: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/auth/verify-code`,
  
  // User
  userInfo: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/users/me`,
  updateUser: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/users/me`,
  
  // Institution
  institutions: `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/institutions`,
  institutionById: (id: string) => 
    `${API_CONFIG.gateway}${API_CONFIG.services.user}/v1/institutions/${id}`,
  
  // Pet
  pets: `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets`,
  petById: (id: string) => 
    `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets/${id}`,
  petStatus: (id: string) => 
    `${API_CONFIG.gateway}${API_CONFIG.services.pet}/v1/pets/${id}/status`,
  petApplicationCount: (petId: string) => 
    `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/pet/${petId}/count`,
  
  // Adoption
  applications: `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications`,
  applicationById: (id: string) => 
    `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/${id}`,
  myApplications: `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/my`,
  pendingApplications: `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/pending`,
  applicationReview: (id: string) => 
    `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/applications/${id}/review`,
  myAdoptions: `${API_CONFIG.gateway}${API_CONFIG.services.adoption}/v1/adoptions/my`,
};
```

---

## 服务端口汇总

| 服务 | 端口 | 说明 |
|------|------|------|
| Frontend | 5000 | Next.js 开发服务器 |
| Gateway | 8080 | Spring Cloud Gateway |
| User Service | 8081 | 用户、认证、机构 |
| Pet Service | 8082 | 宠物管理 |
| Adoption Service | 8083 | 领养申请、记录 |
| MySQL | 3306 | 数据库 |
| Redis | 6379 | 缓存、会话 |
