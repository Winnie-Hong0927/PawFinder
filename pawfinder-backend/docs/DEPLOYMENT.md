# PawFinder 微服务部署指南

## 前置要求

### 基础环境
- JDK 17+
- Maven 3.8+
- MySQL 8.0+
- Redis 7.0+

### 中间件服务

| 服务 | 版本 | 端口 | 用途 |
|------|------|------|------|
| Nacos Server | 2.3.x | 8848 | 服务注册与配置中心 |
| Sentinel Dashboard | 1.8.x | 8858 | 流量控制监控面板 |
| Seata Server | 2.0.x | 8091 | 分布式事务协调器 |
| Elasticsearch | 8.x | 9200 | 全文检索引擎 |

## 一、安装 Nacos

### 1. 下载并启动 Nacos

```bash
# 下载 Nacos
wget https://github.com/alibaba/nacos/releases/download/2.3.2/nacos-server-2.3.2.tar.gz
tar -xzf nacos-server-2.3.2.tar.gz
cd nacos/bin

# 单机模式启动
sh startup.sh -m standalone
```

### 2. 访问控制台

- 地址: http://localhost:8848/nacos
- 默认账号: nacos
- 默认密码: nacos

### 3. 创建命名空间

在 Nacos 控制台创建命名空间:
- `pawfinder` - 用于 PawFinder 微服务

### 4. 创建配置文件

在 `pawfinder` 命名空间下创建以下配置:

#### database.yaml (共享数据库配置)
```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/${spring.application.name}?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: pawfinder
    password: pawfinder123
```

#### redis.yaml (共享 Redis 配置)
```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      database: 0
      timeout: 10000ms
```

## 二、安装 Sentinel Dashboard

### 1. 下载并启动 Sentinel

```bash
# 下载 Sentinel Dashboard
wget https://github.com/alibaba/Sentinel/releases/download/1.8.7/sentinel-dashboard-1.8.7.jar

# 启动
java -Dserver.port=8858 -Dcsp.sentinel.dashboard.server=localhost:8858 -jar sentinel-dashboard-1.8.7.jar
```

### 2. 访问控制台

- 地址: http://localhost:8858
- 默认账号: sentinel
- 默认密码: sentinel

### 3. 配置流控规则

在 Sentinel 控制台为各 API 分组配置流控规则:

| API 分组 | QPS 阈值 | 说明 |
|----------|----------|------|
| auth_api_group | 100 | 认证服务 |
| pet_api_group | 50 | 宠物服务 |
| adoption_api_group | 30 | 领养服务 |
| order_api_group | 20 | 订单服务 |
| payment_api_group | 10 | 支付服务 |
| search_api_group | 100 | 搜索服务 |

## 三、安装 Seata Server

### 1. 下载并配置 Seata

```bash
# 下载 Seata
wget https://github.com/seata/seata/releases/download/v2.0.0/seata-server-2.0.0.tar.gz
tar -xzf seata-server-2.0.0.tar.gz
cd seata
```

### 2. 配置 Seata (conf/application.yml)

```yaml
server:
  port: 8091

spring:
  application:
    name: seata-server

logging:
  config: classpath:logback-spring.xml
  file:
    path: ${user.home}/logs/seata

seata:
  config:
    type: nacos
    nacos:
      server-addr: localhost:8848
      namespace: ""
      group: SEATA_GROUP
      username: nacos
      password: nacos
  registry:
    type: nacos
    nacos:
      application: seata-server
      server-addr: localhost:8848
      namespace: ""
      group: SEATA_GROUP
      username: nacos
      password: nacos
  store:
    mode: db
    db:
      datasource: druid
      db-type: mysql
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/seata?useUnicode=true&characterEncoding=utf-8
      user: root
      password: 
```

### 3. 创建 Seata 数据库

```sql
CREATE DATABASE IF NOT EXISTS seata;

-- 创建 Seata 表（参考 Seata 官方文档）
USE seata;
-- 创建 lock_table, branch_table, global_table 等表
```

### 4. 启动 Seata

```bash
cd seata/bin
sh seata-server.sh
```

## 四、安装 Elasticsearch

### 1. 使用 Docker 安装 ES

```bash
# 拉取镜像
docker pull elasticsearch:8.11.0

# 启动 ES
docker run -d --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  elasticsearch:8.11.0
```

### 2. 验证安装

```bash
curl http://localhost:9200
```

### 3. 创建宠物索引

```bash
curl -X PUT "http://localhost:9200/pet_index" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "name": { "type": "text", "analyzer": "ik_max_word" },
      "species": { "type": "keyword" },
      "breed": { "type": "text", "analyzer": "ik_max_word" },
      "age": { "type": "keyword" },
      "gender": { "type": "keyword" },
      "size": { "type": "keyword" },
      "description": { "type": "text", "analyzer": "ik_max_word" },
      "status": { "type": "keyword" },
      "institutionId": { "type": "keyword" },
      "createdAt": { "type": "date" }
    }
  }
}
'
```

## 五、启动微服务

### 1. 编译打包

```bash
cd /workspace/projects/pawfinder-backend
mvn clean package -DskipTests
```

### 2. 按顺序启动服务

```bash
# 使用启动脚本
./start.sh

# 或手动启动
# 1. 用户服务
java -jar pawfinder-user/target/pawfinder-user-1.0.0-SNAPSHOT.jar &

# 2. 宠物服务
java -jar pawfinder-pet/target/pawfinder-pet-1.0.0-SNAPSHOT.jar &

# 3. 领养服务
java -jar pawfinder-adoption/target/pawfinder-adoption-1.0.0-SNAPSHOT.jar &

# 4. 订单服务
java -jar pawfinder-order/target/pawfinder-order-1.0.0-SNAPSHOT.jar &

# 5. 支付服务
java -jar pawfinder-payment/target/pawfinder-payment-1.0.0-SNAPSHOT.jar &

# 6. 搜索服务
java -jar pawfinder-search/target/pawfinder-search-1.0.0-SNAPSHOT.jar &

# 7. 网关服务
java -jar pawfinder-gateway/target/pawfinder-gateway-1.0.0-SNAPSHOT.jar &
```

### 3. 验证服务注册

访问 Nacos 控制台，查看服务列表中是否包含:
- user-service
- pet-service
- adoption-service
- order-service
- payment-service
- search-service
- gateway-service

## 六、服务端口汇总

| 服务 | 端口 | 说明 |
|------|------|------|
| gateway-service | 8080 | API 网关 |
| user-service | 8081 | 用户服务 |
| pet-service | 8082 | 宠物服务 |
| adoption-service | 8083 | 领养服务 |
| order-service | 8084 | 订单服务 |
| payment-service | 8085 | 支付服务 |
| search-service | 8086 | 搜索服务 |
| Nacos | 8848 | 注册中心 |
| Sentinel | 8858 | 流控面板 |
| Seata | 8091 | 分布式事务 |
| Elasticsearch | 9200 | 搜索引擎 |

## 七、常见问题

### 1. 服务注册失败
- 检查 Nacos 是否启动
- 检查 namespace 配置是否正确

### 2. Sentinel 规则不生效
- 检查 Sentinel Dashboard 是否启动
- 检查服务是否正确连接到 Sentinel

### 3. 分布式事务失败
- 检查 Seata Server 是否启动
- 检查数据库 undo_log 表是否创建

### 4. Elasticsearch 连接失败
- 检查 ES 是否启动
- 检查端口是否正确
