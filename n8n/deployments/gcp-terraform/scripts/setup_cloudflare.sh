#!/bin/bash
# ========================================
# Cloudflare Tunnel 设置脚本
# 用途: 配置 Cloudflare Tunnel 以提供 SSL 加密访问
# ========================================

set -e  # 遇到错误立即退出

echo "=========================================="
echo "配置 Cloudflare Tunnel"
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

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 从环境变量或默认值获取配置
N8N_HOSTNAME="${N8N_HOSTNAME:-n8n.example.com}"
STATIC_IP="${STATIC_IP:-}"

# 格式化主机名（替换 . 为 -）
FORMATTED_HOSTNAME=$(echo $N8N_HOSTNAME | tr '.' '-')

echo ""
print_info "配置信息:"
echo "  域名: $N8N_HOSTNAME"
echo "  Tunnel 名称: $FORMATTED_HOSTNAME"
if [ -n "$STATIC_IP" ]; then
    echo "  静态 IP: $STATIC_IP"
fi
echo ""

# 1. 添加 Cloudflare GPG 密钥
print_info "添加 Cloudflare GPG 密钥..."
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
print_success "Cloudflare GPG 密钥已添加"

# 2. 添加 Cloudflare 仓库
print_info "添加 Cloudflare 仓库..."
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared jammy main' | \
    sudo tee /etc/apt/sources.list.d/cloudflared.list
print_success "Cloudflare 仓库已添加"

# 3. 安装 cloudflared
print_info "安装 cloudflared..."
sudo apt-get update && sudo apt-get install -y cloudflared
print_success "cloudflared 已安装"

# 4. 登录到 Cloudflare
print_warning "需要进行 Cloudflare 登录授权"
echo ""
echo "=========================================="
echo "重要: 下一步将打开浏览器进行授权"
echo "=========================================="
echo "1. 会显示一个 URL，请复制并在浏览器中打开"
echo "2. 选择你要使用的域名"
echo "3. 点击 'Authorize' 授权"
echo "4. 完成后返回终端继续"
echo "=========================================="
echo ""
read -p "准备好了吗？按 Enter 继续..."

sudo cloudflared tunnel login
print_success "Cloudflare 登录成功"

# 5. 创建 Tunnel
print_info "创建 Cloudflare Tunnel: $FORMATTED_HOSTNAME"
if sudo cloudflared tunnel create $FORMATTED_HOSTNAME; then
    print_success "Tunnel 已创建"
else
    print_warning "Tunnel 可能已存在，继续..."
fi

# 6. 配置路由（如果提供了静态 IP）
if [ -n "$STATIC_IP" ]; then
    print_info "配置 IP 路由..."
    if sudo cloudflared tunnel route ip add ${STATIC_IP}/32 $FORMATTED_HOSTNAME 2>/dev/null; then
        print_success "IP 路由已配置"
    else
        print_warning "IP 路由可能已存在，继续..."
    fi
fi

# 7. 配置 DNS
print_info "配置 DNS 记录..."
if sudo cloudflared tunnel route dns $FORMATTED_HOSTNAME $N8N_HOSTNAME; then
    print_success "DNS 记录已创建"
else
    print_warning "DNS 记录可能已存在，继续..."
fi

# 8. 获取 Tunnel ID
print_info "获取 Tunnel ID..."
TUNNEL_ID=$(sudo cloudflared tunnel info $FORMATTED_HOSTNAME 2>/dev/null | grep -oP 'Your tunnel \K([a-z0-9-]+)' | head -1)

if [ -z "$TUNNEL_ID" ]; then
    # 备用方法：从 .cloudflared 目录查找
    TUNNEL_ID=$(sudo find /root/.cloudflared -name "*.json" -type f | grep -v "cert.pem" | head -1 | xargs basename | sed 's/.json//')
fi

if [ -z "$TUNNEL_ID" ]; then
    print_error "无法获取 Tunnel ID"
    echo "请手动检查: sudo cloudflared tunnel list"
    exit 1
fi

print_success "Tunnel ID: $TUNNEL_ID"

# 9. 创建配置文件
print_info "创建 Cloudflare 配置文件..."
sudo mkdir -p /etc/cloudflared

sudo tee /etc/cloudflared/config.yml > /dev/null <<EOF
# Cloudflare Tunnel 配置文件
tunnel: $FORMATTED_HOSTNAME
credentials-file: /root/.cloudflared/${TUNNEL_ID}.json

# 协议配置
protocol: quic

# 日志配置
logfile: /var/log/cloudflared.log
loglevel: info
transport-loglevel: info

# 入口规则
ingress:
  # n8n 服务
  - hostname: $N8N_HOSTNAME
    service: http://localhost:5678
  
  # 捕获所有其他请求
  - service: http_status:404
EOF

print_success "配置文件已创建: /etc/cloudflared/config.yml"

# 10. 安装系统服务
print_info "安装 Cloudflare 系统服务..."
sudo cloudflared service install
print_success "系统服务已安装"

# 11. 启动服务
print_info "启动 cloudflared 服务..."
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
print_success "cloudflared 服务已启动"

# 12. 检查服务状态
sleep 3
print_info "检查服务状态..."
if sudo systemctl is-active --quiet cloudflared; then
    print_success "cloudflared 服务运行正常"
else
    print_warning "cloudflared 服务可能未正常启动"
    echo "检查状态: sudo systemctl status cloudflared"
    echo "检查日志: sudo journalctl -u cloudflared -f"
fi

# 13. 显示完成信息
echo ""
echo "=========================================="
echo "Cloudflare Tunnel 配置完成！"
echo "=========================================="
echo ""
print_success "配置信息:"
echo "  Tunnel 名称: $FORMATTED_HOSTNAME"
echo "  Tunnel ID: $TUNNEL_ID"
echo "  访问地址: https://$N8N_HOSTNAME"
echo ""
print_info "有用的命令:"
echo "  查看 tunnel 列表: sudo cloudflared tunnel list"
echo "  查看服务状态: sudo systemctl status cloudflared"
echo "  查看日志: sudo journalctl -u cloudflared -f"
echo "  重启服务: sudo systemctl restart cloudflared"
echo ""
print_warning "注意:"
echo "  - DNS 传播可能需要几分钟时间"
echo "  - 首次访问 n8n 时需要设置管理员账号"
echo "  - 确保 n8n 服务正在运行: sudo docker ps"
echo ""
echo "=========================================="
echo "现在可以访问: https://$N8N_HOSTNAME"
echo "=========================================="
