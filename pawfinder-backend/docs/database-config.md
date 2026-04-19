# PawFinder 后端微服务数据库配置
# 用于本地开发环境，Nacos 配置中心将覆盖此配置

spring:
  datasource:
    # 用户服务数据库
    user:
      url: jdbc:mysql://localhost:3306/pawfinder_user?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
      username: pawfinder
      password: pawfinder123
      driver-class-name: com.mysql.cj.jdbc.Driver

    # 宠物服务数据库
    pet:
      url: jdbc:mysql://localhost:3306/pawfinder_pet?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
      username: pawfinder
      password: pawfinder123
      driver-class-name: com.mysql.cj.jdbc.Driver

    # 领养服务数据库
    adoption:
      url: jdbc:mysql://localhost:3306/pawfinder_adoption?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
      username: pawfinder
      password: pawfinder123
      driver-class-name: com.mysql.cj.jdbc.Driver

    # 订单服务数据库
    order:
      url: jdbc:mysql://localhost:3306/pawfinder_order?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
      username: pawfinder
      password: pawfinder123
      driver-class-name: com.mysql.cj.jdbc.Driver

    # 支付服务数据库
    payment:
      url: jdbc:mysql://localhost:3306/pawfinder_payment?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
      username: pawfinder
      password: pawfinder123
      driver-class-name: com.mysql.cj.jdbc.Driver

  redis:
    host: localhost
    port: 6379
    password: ""
    database: 0
    timeout: 5000
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: -1ms

# MySQL 连接配置
mysql:
  host: localhost
  port: 3306
  username: pawfinder
  password: pawfinder123

# Redis 连接配置
redis:
  host: localhost
  port: 6379
  password: ""
