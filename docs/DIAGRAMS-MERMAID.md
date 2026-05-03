# PawFinder 系统 Mermaid 图表集

> **版本**: v1.0  
> **最后更新**: 2025-01-13  
> **说明**: 本文档包含系统实现文档中所有图表的 Mermaid 代码版本，可在支持 Mermaid 的 Markdown 编辑器中渲染查看

---

## 目录

1. [系统架构图](#1-系统架构图)
2. [微服务调用关系图](#2-微服务调用关系图)
3. [用户登录时序图](#3-用户登录时序图)
4. [领养申请时序图](#4-领养申请时序图)
5. [支付流程时序图](#5-支付流程时序图)
6. [宠物领养完整流程图](#6-宠物领养完整流程图)
7. [宠物状态流转图](#7-宠物状态流转图)
8. [订单状态流转图](#8-订单状态流转图)
9. [核心实体类图](#9-核心实体类图)
10. [服务类图](#10-服务类图)
11. [数据库ER图](#11-数据库er图)
12. [Database per Service架构图](#12-database-per-service架构图)
13. [生产环境部署架构图](#13-生产环境部署架构图)
14. [负载均衡架构图](#14-负载均衡架构图)

---

## 1. 系统架构图

```mermaid
flowchart TB
    subgraph Client["用户层 (Client Layer)"]
        browser["浏览器"]
        mobile["移动端"]
        miniapp["小程序"]
        admin["管理后台"]
        openapi["开放API"]
    end

    subgraph Gateway["网关层 (Gateway Layer)"]
        gateway["API Gateway<br/>端口: 8080"]
        route["路由转发"]
        lb["负载均衡"]
        limit["限流熔断"]
        auth["鉴权过滤"]
        gateway --> route
        gateway --> lb
        gateway --> limit
        gateway --> auth
    end

    subgraph Services["服务层 (Service Layer)"]
        user["User Service<br/>端口: 8081<br/>用户管理/认证授权/机构管理"]
        pet["Pet Service<br/>端口: 8082<br/>宠物管理/状态更新/数据同步"]
        adoption["Adoption Service<br/>端口: 8083<br/>申请管理/审核流程/记录管理"]
        order["Order Service<br/>端口: 8084<br/>订单管理/状态流转/回调处理"]
        payment["Payment Service<br/>端口: 8085<br/>支付创建/回调处理/状态查询"]
        search["Search Service<br/>端口: 8086<br/>ES同步/全文搜索/聚合统计"]
    end

    subgraph Data["数据层 (Data Layer)"]
        mysql["MySQL<br/>端口: 3306<br/>用户数据/宠物数据/订单数据"]
        redis["Redis<br/>端口: 6379<br/>验证码/会话信息/缓存数据"]
        es["Elasticsearch<br/>端口: 9200<br/>宠物索引/全文搜索"]
        nacos["Nacos<br/>端口: 8848<br/>服务注册/配置管理"]
    end

    Client --> Gateway
    Gateway --> Services
    Services --> Data
```

---

## 2. 微服务调用关系图

```mermaid
flowchart LR
    gateway["Gateway<br/>(8080)"]
    
    user["User Service<br/>(8081)"]
    pet["Pet Service<br/>(8082)"]
    adoption["Adoption Service<br/>(8083)"]
    order["Order Service<br/>(8084)"]
    payment["Payment Service<br/>(8085)"]
    search["Search Service<br/>(8086)"]

    gateway --> user
    gateway --> pet
    gateway --> search

    adoption -->|"Feign Call<br/>getPetById"| pet
    adoption -->|"Feign Call<br/>getUserById"| user
    search -->|"ES Sync<br/>同步宠物数据"| pet
    order -->|"Feign Call<br/>getUserById"| user
    payment -->|"Feign Call<br/>getOrderByNo"| order
```

---

## 3. 用户登录时序图

```mermaid
sequenceDiagram
    autonumber
    participant U as 用户
    participant F as 前端
    participant US as User Service
    participant R as Redis
    participant M as MySQL

    Note over U,M: 第一阶段：发送验证码
    
    U->>F: 输入手机号
    F->>US: 请求发送验证码
    US->>US: 生成6位验证码
    US->>R: 存储验证码<br/>(key: phone, value: code, TTL: 5min)
    US-->>F: 返回成功
    F-->>U: 显示验证码已发送

    Note over U,M: 第二阶段：验证登录
    
    U->>F: 输入验证码
    F->>US: 请求验证登录
    US->>R: 获取验证码
    R-->>US: 返回验证码
    US->>US: 验证是否正确
    
    alt 验证通过
        US->>M: 查询用户
        M-->>US: 返回用户信息
        US->>US: 生成JWT Token
        US-->>F: 返回Token
        F-->>U: 登录成功
    else 验证失败
        US-->>F: 返回错误
        F-->>U: 显示验证码错误
    end
```

---

## 4. 领养申请时序图

```mermaid
sequenceDiagram
    autonumber
    participant A as 领养人
    participant F as 前端
    participant AS as Adoption Service
    participant PS as Pet Service
    participant M as MySQL
    participant S as Seata (TC)

    A->>F: 提交申请
    F->>AS: 创建领养申请
    AS->>S: 开启分布式事务
    
    AS->>PS: Feign调用 getPetById
    PS-->>AS: 返回宠物信息
    
    AS->>AS: 检查宠物状态<br/>(AVAILABLE?)
    
    alt 状态正常
        AS->>M: 创建申请记录
        AS->>PS: Feign调用 updateStatus(PENDING)
        PS->>M: 更新宠物状态
        PS-->>AS: 返回成功
        AS->>S: 提交事务
        AS-->>F: 返回成功
        F-->>A: 显示申请成功
    else 状态异常
        AS->>S: 回滚事务
        AS-->>F: 返回失败
        F-->>A: 显示申请失败
    end

    Note over A,S: 如果任何一步失败，Seata 会自动回滚所有操作，保证数据一致性
```

---

## 5. 支付流程时序图

```mermaid
sequenceDiagram
    autonumber
    participant U as 用户
    participant F as 前端
    participant PS as Payment Service
    participant OS as Order Service
    participant M as MySQL
    participant Alipay as 支付宝API

    Note over U,Alipay: 第一阶段：创建支付
    
    U->>F: 点击支付
    F->>PS: 创建支付
    PS->>OS: Feign查询订单
    OS-->>PS: 返回订单信息
    PS->>M: 创建支付流水
    PS->>Alipay: 调用支付宝API
    Alipay-->>PS: 返回支付页面URL
    PS-->>F: 返回支付链接
    F-->>U: 跳转支付页面

    Note over U,Alipay: 第二阶段：支付回调
    
    U->>Alipay: 完成支付
    Alipay->>PS: 支付回调通知
    PS->>PS: 验签
    PS->>M: 更新流水状态
    PS->>OS: Feign更新订单状态
    OS->>M: 更新订单
    OS-->>PS: 返回成功
    PS->>Alipay: 返回成功给支付宝
    PS-->>F: 支付成功
    F-->>U: 显示支付成功页面
```

---

## 6. 宠物领养完整流程图

```mermaid
flowchart TD
    start([开始]) --> browse[浏览宠物列表<br/>搜索、筛选、查看]
    browse --> select[选择心仪宠物<br/>查看详情页面]
    select --> checkStatus{宠物状态<br/>是否可领养?}
    
    checkStatus -->|否| showUnavailable[显示暂不可领养]
    checkStatus -->|是| clickApply[点击申请领养]
    
    clickApply --> checkLogin{用户是否<br/>已登录?}
    checkLogin -->|否| login[跳转登录页面<br/>手机验证码登录]
    checkLogin -->|是| fillForm[填写领养申请表<br/>联系方式、居住环境等]
    
    fillForm --> submit[提交领养申请<br/>开启分布式事务]
    submit --> updateStatus[宠物状态改为待审核<br/>PENDING]
    updateStatus --> waitReview[等待机构审核]
    
    waitReview --> reviewResult{审核结果}
    reviewResult -->|通过| createOrder[创建领养订单<br/>宠物状态改为已预定]
    reviewResult -->|拒绝| restoreAvailable[宠物恢复可领养<br/>通知用户被拒绝]
    
    createOrder --> pay[用户支付押金<br/>支付宝支付]
    pay --> payResult{支付结果}
    
    payResult -->|成功| updateOrderPaid[订单状态改为已支付<br/>通知机构安排交接]
    payResult -->|失败| retryPay[提示用户重试支付<br/>或取消订单]
    
    updateOrderPaid --> handover[线下交接宠物<br/>机构确认交接完成]
    handover --> complete[宠物状态改为已领养<br/>订单状态改为已完成<br/>生成领养记录]
    complete --> end([结束])
    
    showUnavailable --> browse
    login --> fillForm
    retryPay --> pay
    restoreAvailable --> browse
```

---

## 7. 宠物状态流转图

```mermaid
stateDiagram-v2
    [*] --> AVAILABLE: 宠物上架
    
    AVAILABLE --> PENDING: 提交领养申请
    AVAILABLE --> UNAVAILABLE: 机构下架
    
    PENDING --> RESERVED: 审核通过
    PENDING --> AVAILABLE: 审核拒绝
    
    RESERVED --> ADOPTED: 支付成功 & 交接完成
    RESERVED --> AVAILABLE: 用户取消
    
    UNAVAILABLE --> AVAILABLE: 机构重新上架
    
    ADOPTED --> [*]: 领养完成

    note right of AVAILABLE
        可领养状态
        宠物健康且可被领养
        显示"申请领养"按钮
    end note

    note right of PENDING
        待审核状态
        有领养申请待处理
        宠物仍可被浏览
    end note

    note right of RESERVED
        已预定状态
        审核通过
        等待支付和交接
    end note

    note right of ADOPTED
        已领养状态
        领养流程完成
        宠物已有新家
    end note

    note right of UNAVAILABLE
        暂不可领养
        机构主动下架
        暂停领养
    end note
```

---

## 8. 订单状态流转图

```mermaid
stateDiagram-v2
    [*] --> PENDING_PAYMENT: 创建订单
    
    PENDING_PAYMENT --> PAID: 支付成功
    PENDING_PAYMENT --> CANCELLED: 超时未支付<br/>(30分钟)
    PENDING_PAYMENT --> CANCELLED: 用户取消
    
    PAID --> COMPLETED: 机构确认交接
    
    COMPLETED --> [*]: 订单完成
    CANCELLED --> [*]: 订单取消

    note right of PENDING_PAYMENT
        待支付状态
        订单已创建
        等待用户支付
        30分钟未支付自动取消
    end note

    note right of PAID
        已支付状态
        支付成功
        等待线下交接
    end note

    note right of COMPLETED
        已完成状态
        领养流程完成
        宠物状态改为 ADOPTED
        生成领养记录
    end note

    note right of CANCELLED
        已取消状态
        超时或用户主动取消
        宠物状态恢复
    end note
```

---

## 9. 核心实体类图

```mermaid
classDiagram
    class User {
        -String id
        -String phone
        -String nickname
        -String avatar
        -UserRole role
        -UserStatus status
        -String institutionId
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
        +getId() String
        +getPhone() String
        +setPhone(String)
    }

    class Institution {
        -String id
        -String name
        -String description
        -String address
        -String contactPhone
        -String licenseNo
        -InstitutionStatus status
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
    }

    class Pet {
        -String id
        -String name
        -PetSpeciesEnum species
        -String breed
        -Integer age
        -GenderEnum gender
        -SizeEnum size
        -String color
        -PetStatusEnum status
        -String institutionId
        -String description
        -String imageUrl
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
    }

    class AdoptionApplication {
        -String id
        -String userId
        -String petId
        -String institutionId
        -ApplicationStatus status
        -String reason
        -String contactInfo
        -String housingInfo
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
    }

    class AdoptionRecord {
        -String id
        -String applicationId
        -String userId
        -String petId
        -String institutionId
        -LocalDateTime adoptedAt
        -LocalDateTime createdAt
    }

    class Order {
        -String id
        -String orderNo
        -String userId
        -String petId
        -BigDecimal amount
        -OrderStatus status
        -String paymentTransactionId
        -LocalDateTime paidAt
        -LocalDateTime completedAt
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
    }

    class PaymentTransaction {
        -String id
        -String transactionNo
        -String orderId
        -String userId
        -BigDecimal amount
        -PaymentStatus status
        -String paymentMethod
        -String alipayTradeNo
        -LocalDateTime paidAt
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
    }

    User "1" --> "*" AdoptionApplication : submits
    User "1" --> "*" Order : creates
    User "1" --> "*" PaymentTransaction : pays
    Institution "1" --> "*" Pet : manages
    Institution "1" --> "*" User : employs
    Pet "1" --> "*" AdoptionApplication : receives
    AdoptionApplication "1" --> "0..1" AdoptionRecord : results
    Order "1" --> "1" PaymentTransaction : has
```

---

## 10. 服务类图

```mermaid
classDiagram
    class AuthService {
        +sendVerificationCode(String phone) void
        +verifyCodeAndLogin(String phone, String code) LoginResult
        +generateToken(User user) String
        +validateToken(String token) UserInfo
    }

    class UserService {
        +getUserById(String id) User
        +getUserByPhone(String phone) User
        +createUser(User user) User
        +updateUser(User user) User
        +updateUserProfile(String id, UserProfile profile) void
    }

    class PetService {
        +getPetById(String id) Pet
        +listPets(PetQuery query) Page~Pet~
        +createPet(Pet pet) Pet
        +updatePet(Pet pet) Pet
        +updatePetStatus(String id, PetStatusEnum status) void
        +getApplicationCount(String petId) Integer
    }

    class AdoptionService {
        +createApplication(AdoptionApplication app) AdoptionApplication
        +getApplicationById(String id) AdoptionApplication
        +listApplications(ApplicationQuery query) Page~AdoptionApplication~
        +approveApplication(String id) void
        +rejectApplication(String id, String reason) void
        +cancelApplication(String id) void
    }

    class OrderService {
        +createOrder(Order order) Order
        +getOrderByNo(String orderNo) Order
        +getOrderById(String id) Order
        +listOrders(OrderQuery query) Page~Order~
        +updateOrderStatus(String id, OrderStatus status) void
        +cancelOrder(String id) void
    }

    class PaymentService {
        +createPayment(CreatePaymentRequest request) PaymentResult
        +handlePaymentNotify(PaymentNotify notify) void
        +queryPaymentStatus(String transactionNo) PaymentStatus
    }

    class SearchService {
        +searchPets(SearchQuery query) Page~PetDocument~
        +syncPetToES(Pet pet) void
        +deletePetFromES(String petId) void
        +aggregateByField(String field) Map
    }

    AuthService --> UserService : uses
    AdoptionService --> PetService : uses via Feign
    AdoptionService --> UserService : uses via Feign
    PaymentService --> OrderService : uses via Feign
```

---

## 11. 数据库ER图

```mermaid
erDiagram
    users ||--o{ adoption_applications : submits
    users ||--o{ orders : creates
    users ||--o{ payment_transactions : pays
    users }o--|| institutions : belongs_to
    institutions ||--o{ pets : manages
    
    pets ||--o{ adoption_applications : receives
    adoption_applications ||--o| adoption_records : results_in
    orders ||--|| payment_transactions : has

    users {
        varchar id PK "主键UUID"
        varchar phone UK "手机号"
        varchar nickname "昵称"
        varchar avatar "头像URL"
        enum role "角色"
        enum status "状态"
        varchar institution_id FK "机构ID"
        datetime created_at "创建时间"
        datetime updated_at "更新时间"
    }

    institutions {
        varchar id PK "主键UUID"
        varchar name "机构名称"
        text description "机构描述"
        varchar address "地址"
        varchar contact_phone "联系电话"
        varchar license_no UK "许可证号"
        enum status "状态"
        datetime created_at "创建时间"
        datetime updated_at "更新时间"
    }

    pets {
        varchar id PK "主键UUID"
        varchar name "宠物名称"
        enum species "物种"
        varchar breed "品种"
        int age "年龄"
        enum gender "性别"
        enum size "体型"
        varchar color "颜色"
        enum status "状态"
        varchar institution_id FK "机构ID"
        text description "描述"
        varchar image_url "图片URL"
        datetime created_at "创建时间"
        datetime updated_at "更新时间"
    }

    adoption_applications {
        varchar id PK "主键UUID"
        varchar user_id FK "用户ID"
        varchar pet_id FK "宠物ID"
        varchar institution_id FK "机构ID"
        enum status "状态"
        text reason "申请理由"
        varchar contact_info "联系方式"
        text housing_info "居住环境"
        datetime created_at "创建时间"
        datetime updated_at "更新时间"
    }

    adoption_records {
        varchar id PK "主键UUID"
        varchar application_id FK "申请ID"
        varchar user_id FK "用户ID"
        varchar pet_id FK "宠物ID"
        varchar institution_id FK "机构ID"
        datetime adopted_at "领养时间"
        datetime created_at "创建时间"
    }

    orders {
        varchar id PK "主键UUID"
        varchar order_no UK "订单号"
        varchar user_id FK "用户ID"
        varchar pet_id FK "宠物ID"
        decimal amount "金额"
        enum status "状态"
        varchar payment_transaction_id FK "支付流水ID"
        datetime paid_at "支付时间"
        datetime completed_at "完成时间"
        datetime created_at "创建时间"
        datetime updated_at "更新时间"
    }

    payment_transactions {
        varchar id PK "主键UUID"
        varchar transaction_no UK "交易流水号"
        varchar order_id FK "订单ID"
        varchar user_id FK "用户ID"
        decimal amount "金额"
        enum status "状态"
        varchar payment_method "支付方式"
        varchar alipay_trade_no "支付宝交易号"
        datetime paid_at "支付时间"
        datetime created_at "创建时间"
        datetime updated_at "更新时间"
    }
```

---

## 12. Database per Service架构图

```mermaid
flowchart TB
    subgraph Services["微服务层"]
        US["User Service<br/>(8081)"]
        PS["Pet Service<br/>(8082)"]
        AS["Adoption Service<br/>(8083)"]
        OS["Order Service<br/>(8084)"]
        PMS["Payment Service<br/>(8085)"]
    end

    subgraph Databases["数据库层 (独立数据库)"]
        subgraph UserDB["pawfinder_user"]
            user_table["users 表"]
            inst_table["institutions 表"]
        end

        subgraph PetDB["pawfinder_pet"]
            pet_table["pets 表"]
        end

        subgraph AdoptionDB["pawfinder_adoption"]
            app_table["adoption_applications 表"]
            record_table["adoption_records 表"]
        end

        subgraph OrderDB["pawfinder_order"]
            order_table["orders 表"]
        end

        subgraph PaymentDB["pawfinder_payment"]
            trans_table["payment_transactions 表"]
        end
    end

    US --> UserDB
    PS --> PetDB
    AS --> AdoptionDB
    OS --> OrderDB
    PMS --> PaymentDB

    AS -.->|"Feign"| PS
    AS -.->|"Feign"| US
    OS -.->|"Feign"| US
    PMS -.->|"Feign"| OS

    style UserDB fill:#e1f5fe
    style PetDB fill:#e8f5e9
    style AdoptionDB fill:#fff3e0
    style OrderDB fill:#fce4ec
    style PaymentDB fill:#f3e5f5
```

---

## 13. 生产环境部署架构图

```mermaid
flowchart TB
    subgraph Internet["互联网"]
        users["用户"]
    end

    subgraph Cloud["云服务商 (阿里云/腾讯云)"]
        subgraph LB["负载均衡层"]
            aliyunSLB["阿里云 SLB<br/>负载均衡器"]
        end

        subgraph K8s["Kubernetes 集群"]
            subgraph GatewayPod["Gateway Pods"]
                gw1["Gateway Pod 1"]
                gw2["Gateway Pod 2"]
                gw3["Gateway Pod N"]
            end

            subgraph UserPods["User Service Pods"]
                us1["User Pod 1"]
                us2["User Pod 2"]
                us3["User Pod N"]
            end

            subgraph PetPods["Pet Service Pods"]
                ps1["Pet Pod 1"]
                ps2["Pet Pod 2"]
                ps3["Pet Pod N"]
            end

            subgraph OtherPods["其他服务 Pods"]
                adoption["Adoption Pods"]
                order["Order Pods"]
                payment["Payment Pods"]
                search["Search Pods"]
            end
        end

        subgraph Middleware["中间件集群"]
            nacos["Nacos Cluster<br/>3节点"]
            mysql["MySQL Cluster<br/>主从复制"]
            redis["Redis Cluster<br/>哨兵模式"]
            es["Elasticsearch<br/>3节点"]
            seata["Seata Cluster<br/>TC集群"]
        end
    end

    users --> aliyunSLB
    aliyunSLB --> GatewayPod
    GatewayPod --> UserPods
    GatewayPod --> PetPods
    GatewayPod --> OtherPods
    
    UserPods --> nacos
    PetPods --> nacos
    OtherPods --> nacos
    
    UserPods --> mysql
    PetPods --> mysql
    OtherPods --> mysql
    
    UserPods --> redis
    PetPods --> redis
    OtherPods --> redis
    
    search --> es
    adoption --> seata
    order --> seata
```

---

## 14. 负载均衡架构图

```mermaid
flowchart TB
    subgraph Client["客户端"]
        frontend["前端应用"]
    end

    subgraph Gateway["Gateway (8080)"]
        routeConfig["路由配置<br/>lb://user-service"]
        lb["Spring Cloud LoadBalancer"]
    end

    subgraph Nacos["Nacos Server (8848)"]
        serviceRegistry["服务注册表<br/><br/>user-service:<br/>  - 192.168.1.101:8081<br/>  - 192.168.1.102:8081<br/>  - 192.168.1.103:8081"]
    end

    subgraph Instances["服务实例"]
        instance1["User Service<br/>Instance 1<br/>192.168.1.101:8081"]
        instance2["User Service<br/>Instance 2<br/>192.168.1.102:8081"]
        instance3["User Service<br/>Instance 3<br/>192.168.1.103:8081"]
    end

    frontend -->|"请求 /api/user/**"| Gateway
    Gateway -->|"lb://user-service"| lb
    lb -->|"1. 获取服务列表"| Nacos
    Nacos -->|"2. 返回实例列表"| lb
    lb -->|"3. 轮询选择<br/>RoundRobin"| instance1
    lb -->|"下一个请求"| instance2
    lb -->|"再下一个请求"| instance3

    instance1 -->|"注册"| Nacos
    instance2 -->|"注册"| Nacos
    instance3 -->|"注册"| Nacos
```

---

## 使用说明

### 如何渲染 Mermaid 图表

1. **VS Code**: 安装 `Markdown Preview Mermaid Support` 插件
2. **GitHub**: 直接在 Markdown 文件中使用，GitHub 原生支持
3. **Typora**: 原生支持 Mermaid 语法
4. **在线工具**: 
   - [Mermaid Live Editor](https://mermaid.live/)
   - [Mermaid Playground](https://mermaid-js.github.io/mermaid-live-editor/)

### 图表类型说明

| 图表类型 | Mermaid 语法 | 适用场景 |
|---------|-------------|---------|
| 流程图 | `flowchart` / `graph` | 业务流程、系统架构 |
| 时序图 | `sequenceDiagram` | 接口调用、请求响应流程 |
| 状态图 | `stateDiagram-v2` | 状态流转、生命周期 |
| 类图 | `classDiagram` | 类结构、实体关系 |
| ER图 | `erDiagram` | 数据库表关系 |

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2025-01-13 | 初始版本，包含14张核心图表 |
