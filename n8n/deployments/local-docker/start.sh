#!/bin/bash

# Averivendell n8n 启动脚本
# 用于简化 n8n Docker 容器的启动和管理

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "🚀 Averivendell n8n Docker 部署"
echo "================================="

# 检查 Docker 是否可用
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装或不在 PATH 中"
    echo "请安装 Docker Desktop 并启用 WSL 2 集成"
    exit 1
fi

# 检查 Docker Compose 是否可用
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose 不可用"
    echo "请确保 Docker Desktop 正在运行"
    exit 1
fi

echo "✅ Docker 环境检查通过"

# 检查端口是否被占用
if lsof -Pi :5678 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  端口 5678 已被占用"
    echo "请停止占用该端口的服务，或修改 docker-compose.yml 中的端口映射"
    exit 1
fi

echo "✅ 端口 5678 可用"

# 创建数据目录（如果不存在）
if [ ! -d "n8n_data" ]; then
    echo "📁 创建数据目录..."
    mkdir -p n8n_data
fi

# 启动服务
echo "🐳 启动 n8n 容器..."
docker compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
if docker compose ps | grep -q "Up"; then
    echo "✅ n8n 服务启动成功！"
    echo ""
    echo "🌐 访问地址: http://localhost:5678"
    echo "👤 用户名: admin"
    echo "🔑 密码: avery_n8n_2025"
    echo ""
    echo "📊 查看状态: docker compose ps"
    echo "📝 查看日志: docker compose logs -f n8n"
    echo "🛑 停止服务: docker compose down"
else
    echo "❌ 服务启动失败"
    echo "查看日志: docker compose logs n8n"
    exit 1
fi
