#!/bin/bash
# PawFinder 后端微服务停止脚本

echo "Stopping PawFinder Backend Services..."

# 停止各服务
for service in user-service pet-service adoption-service gateway-service; do
    if [ -f "/tmp/${service}.pid" ]; then
        pid=$(cat /tmp/${service}.pid)
        if ps -p $pid > /dev/null 2>&1; then
            kill $pid
            rm /tmp/${service}.pid
            echo "Stopped $service (PID: $pid)"
        else
            echo "$service not running"
            rm /tmp/${service}.pid
        fi
    else
        echo "$service not found"
    fi
done

echo "All services stopped."
