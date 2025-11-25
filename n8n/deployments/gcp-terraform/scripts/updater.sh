#!/bin/bash
# ========================================
# n8n 系统更新脚本
# 用途: 更新 Docker、n8n、FastAPI 和 Cloudflare Tunnel
# ========================================

set -e  # 遇到错误立即退出

echo "=========================================="
echo "开始更新系统组件"
echo "=========================================="

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${YELLOW}→${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# FastAPI 镜像
FASTAPI_IMAGE="${FASTAPI_IMAGE:-tiangolo/uvicorn-gunicorn-fastapi:python3.11}"

# 1. 更新系统包索引
print_info "更新系统包索引..."
sudo apt update
print_success "系统包索引已更新"

# 2. 升级 Docker 和 Cloudflared
print_info "升级 Docker 和 Cloudflared..."
sudo apt upgrade -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin \
    cloudflared
print_success "Docker 和 Cloudflared 已升级"

# 3. 拉取最新的 n8n 基础镜像
print_info "拉取最新的 n8n 镜像..."
sudo docker pull n8nio/n8n:latest
print_success "n8n 镜像已更新"

# 4. 拉取最新的 FastAPI 镜像
print_info "拉取最新的 FastAPI 镜像..."
sudo docker pull $FASTAPI_IMAGE
print_success "FastAPI 镜像已更新"

# 5. 重新构建自定义 n8n 镜像
print_info "重新构建自定义 n8n 镜像..."
cd /opt
sudo docker build -t custom-n8n:latest .
print_success "自定义 n8n 镜像已重新构建"

# 6. 停止当前服务
print_info "停止当前 Docker Compose 服务..."
sudo docker compose stop
print_success "服务已停止"

# 7. 删除旧容器（保留数据）
print_info "删除旧容器（数据已保留在卷中）..."
sudo docker compose rm -f
print_success "旧容器已删除"

# 8. 启动更新后的服务
print_info "启动更新后的服务..."
sudo docker compose up -d --build
print_success "服务已启动"

# 9. 等待服务启动
print_info "等待服务启动..."
sleep 10

# 10. 显示运行状态
print_info "检查服务状态..."
echo ""
sudo docker compose ps
echo ""

# 11. 清理未使用的镜像
print_info "清理未使用的 Docker 镜像..."
sudo docker image prune -f
print_success "未使用的镜像已清理"

# 12. 显示完成信息
echo ""
echo "=========================================="
echo "系统更新完成！"
echo "=========================================="
echo ""
print_success "已更新的组件:"
echo "  - Docker 及相关插件"
echo "  - Cloudflare Tunnel"
echo "  - n8n (最新版本)"
echo "  - FastAPI (最新版本)"
echo ""
print_info "服务状态:"
sudo systemctl status docker-compose.service --no-pager | head -10
echo ""
print_info "有用的命令:"
echo "  查看容器日志: sudo docker compose logs -f"
echo "  重启服务: sudo systemctl restart docker-compose.service"
echo "  检查 n8n: sudo docker logs -f \$(sudo docker ps -q -f name=n8n)"
echo ""
echo "=========================================="
