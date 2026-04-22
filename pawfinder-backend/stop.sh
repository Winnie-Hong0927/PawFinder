#!/bin/bash
# PawFinder 后端微服务停止脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 停止函数
stop_service() {
    local name=$1
    local pid_file="/tmp/${name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${YELLOW}Stopping ${name} (PID: ${pid})...${NC}"
            kill "$pid"
            rm -f "$pid_file"
            echo -e "${GREEN}${name} stopped.${NC}"
        else
            echo -e "${YELLOW}${name} is not running.${NC}"
            rm -f "$pid_file"
        fi
    else
        echo -e "${YELLOW}${name} PID file not found.${NC}"
    fi
}

# 额外清理进程
cleanup_processes() {
    echo -e "${YELLOW}Cleaning up any remaining processes...${NC}"
    pkill -f "pawfinder-gateway" 2>/dev/null
    pkill -f "pawfinder-user" 2>/dev/null
    pkill -f "pawfinder-pet" 2>/dev/null
    pkill -f "pawfinder-adoption" 2>/dev/null
    pkill -f "pawfinder-order" 2>/dev/null
    pkill -f "pawfinder-payment" 2>/dev/null
    pkill -f "pawfinder-search" 2>/dev/null
    rm -f /tmp/*-service.pid
    echo -e "${GREEN}Cleanup complete.${NC}"
}

echo -e "${YELLOW}Stopping PawFinder Backend Services...${NC}"
echo ""

# 按相反顺序停止
stop_service "gateway-service"
stop_service "search-service"
stop_service "payment-service"
stop_service "order-service"
stop_service "adoption-service"
stop_service "pet-service"
stop_service "user-service"

# 清理
echo ""
cleanup_processes

echo ""
echo -e "${GREEN}All services stopped.${NC}"
