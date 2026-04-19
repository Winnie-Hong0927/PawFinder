#!/bin/bash
# PawFinder 后端微服务启动脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_DIR="/workspace/projects/pawfinder-backend"

# 服务端口
USER_PORT=8081
PET_PORT=8082
ADOPTION_PORT=8083
GATEWAY_PORT=8080

# 启动函数
start_service() {
    local name=$1
    local jar=$2
    local port=$3
    
    echo -e "${GREEN}Starting ${name} on port ${port}...${NC}"
    nohup java -jar "${jar}" --server.port=${port} > /app/work/logs/bypass/${name}.log 2>&1 &
    echo $! > /tmp/${name}.pid
    echo -e "${GREEN}${name} started (PID: $(cat /tmp/${name}.pid))${NC}"
}

# 检查 MySQL 和 Redis
echo -e "${YELLOW}Checking MySQL and Redis...${NC}"
if ! mysql -u root -e "SELECT 1" > /dev/null 2>&1; then
    echo -e "${RED}MySQL is not running! Please start MySQL first.${NC}"
    exit 1
fi

if ! redis-cli ping > /dev/null 2>&1; then
    echo -e "${RED}Redis is not running! Please start Redis first.${NC}"
    exit 1
fi

echo -e "${GREEN}MySQL and Redis are running.${NC}"

# 启动各服务
echo ""
echo -e "${YELLOW}Starting PawFinder Backend Services...${NC}"
echo ""

# 1. User Service
start_service "user-service" "${PROJECT_DIR}/pawfinder-user/target/pawfinder-user-1.0.0-SNAPSHOT.jar" $USER_PORT

# 等待服务启动
sleep 3

# 2. Pet Service
start_service "pet-service" "${PROJECT_DIR}/pawfinder-pet/target/pawfinder-pet-1.0.0-SNAPSHOT.jar" $PET_PORT

# 等待服务启动
sleep 3

# 3. Adoption Service
start_service "adoption-service" "${PROJECT_DIR}/pawfinder-adoption/target/pawfinder-adoption-1.0.0-SNAPSHOT.jar" $ADOPTION_PORT

# 等待服务启动
sleep 3

# 4. Gateway Service (最后启动)
start_service "gateway-service" "${PROJECT_DIR}/pawfinder-gateway/target/pawfinder-gateway-1.0.0-SNAPSHOT.jar" $GATEWAY_PORT

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All services started!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Services:"
echo "  - Gateway:    http://localhost:${GATEWAY_PORT}"
echo "  - User:       http://localhost:${USER_PORT}"
echo "  - Pet:        http://localhost:${PET_PORT}"
echo "  - Adoption:   http://localhost:${ADOPTION_PORT}"
echo ""
echo "API Docs:"
echo "  - Gateway Swagger:   http://localhost:${GATEWAY_PORT}/swagger-ui.html"
echo "  - User Swagger:      http://localhost:${USER_PORT}/swagger-ui.html"
echo "  - Pet Swagger:        http://localhost:${PET_PORT}/swagger-ui.html"
echo "  - Adoption Swagger:   http://localhost:${ADOPTION_PORT}/swagger-ui.html"
echo ""
echo "Logs: /app/work/logs/bypass/"
