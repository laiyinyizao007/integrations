#!/bin/bash
# ========================================
# n8n 服务器安装脚本
# 用途: 在 Ubuntu 22.04 上安装 Docker 和 n8n
# ========================================

set -e  # 遇到错误立即退出

echo "=========================================="
echo "开始安装 Docker 和 n8n"
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

# 1. 添加 Docker 官方 GPG 密钥
print_info "添加 Docker 官方 GPG 密钥..."
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
print_success "Docker GPG 密钥已添加"

# 2. 添加 Docker 仓库到 Apt 源
print_info "添加 Docker 仓库..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
print_success "Docker 仓库已添加"

# 3. 更新 apt 仓库
print_info "更新软件包列表..."
sudo apt-get update
print_success "软件包列表已更新"

# 4. 安装 Docker
print_info "安装 Docker..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
print_success "Docker 已安装"

# 5. 启动并启用 Docker 服务
print_info "启动 Docker 服务..."
sudo systemctl start docker
sudo systemctl enable docker
print_success "Docker 服务已启动并设置为开机自启"

# 6. 拉取 FastAPI Docker 镜像
print_info "拉取 FastAPI Docker 镜像..."
FASTAPI_IMAGE="${FASTAPI_IMAGE:-tiangolo/uvicorn-gunicorn-fastapi:python3.11}"
sudo docker pull $FASTAPI_IMAGE
print_success "FastAPI 镜像已拉取"

# 7. 切换到工作目录
print_info "切换到工作目录..."
cd /opt
print_success "已切换到 /opt"

# 8. 构建自定义 n8n 镜像
print_info "构建自定义 n8n 镜像（包含 socket.io 支持）..."
sudo docker build -t custom-n8n:latest .
print_success "自定义 n8n 镜像已构建"

# 9. 启动 Docker Compose
print_info "启动 Docker Compose 服务..."
sudo docker compose up -d
print_success "Docker Compose 服务已启动"

# 10. 启用 Docker Compose 系统服务
print_info "启用 Docker Compose 系统服务..."
sudo systemctl enable docker-compose.service
print_success "Docker Compose 系统服务已启用"

# 11. 创建 n8n 数据目录
print_info "创建 n8n 数据目录..."
sudo mkdir -p /home/${USER}/n8n-local-files
sudo chown -R ${USER}:${USER} /home/${USER}/n8n-local-files
print_success "n8n 数据目录已创建"

# 12. 创建 Docker 卷
print_info "创建 Docker 卷..."
sudo docker volume create n8n_data
print_success "Docker 卷已创建"

# 13. 显示安装信息
echo ""
echo "=========================================="
echo "安装完成！"
echo "=========================================="
echo ""
print_success "Docker 版本:"
docker --version
echo ""
print_success "Docker Compose 版本:"
docker compose version
echo ""
print_success "运行中的容器:"
sudo docker ps
echo ""
echo "=========================================="
echo "下一步操作:"
echo "=========================================="
echo "1. 配置 Cloudflare Tunnel 以获取 SSL:"
echo "   sudo sh /opt/setup_cloudflare.sh"
echo ""
echo "2. 检查 n8n 日志:"
echo "   sudo docker logs -f \$(sudo docker ps -q -f name=n8n)"
echo ""
echo "3. 访问 n8n (配置 Cloudflare 后):"
echo "   https://YOUR_DOMAIN.COM"
echo "=========================================="
