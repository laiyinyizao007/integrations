#!/bin/bash
# n8n ngrok URL 更新脚本
# 自动获取 ngrok URL 并更新 n8n 配置

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  n8n Ngrok URL 配置更新工具"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查 .env 文件是否存在
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ 错误: .env 文件不存在"
    echo "请先运行初始化脚本"
    exit 1
fi

# 方法1: 尝试从 ngrok API 获取
echo "🔍 尝试从 ngrok API 获取 URL..."
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | jq -r '.tunnels[0].public_url // empty' 2>/dev/null || echo "")

if [ -z "$NGROK_URL" ]; then
    echo "⚠️  无法自动获取 ngrok URL"
    echo ""
    echo "请手动执行以下步骤："
    echo "1. 在新终端运行: ./start-ngrok.sh 5678"
    echo "2. 或访问: http://localhost:4040"
    echo "3. 获取 HTTPS URL 后，运行此脚本并输入 URL"
    echo ""
    read -p "请输入 ngrok URL (或按 Enter 跳过): " MANUAL_URL
    
    if [ -n "$MANUAL_URL" ]; then
        NGROK_URL="$MANUAL_URL"
    else
        echo "❌ 未提供 URL，退出"
        exit 1
    fi
fi

echo "✅ 获取到 ngrok URL: $NGROK_URL"

# 更新 .env 文件
echo ""
echo "📝 更新 .env 文件..."

# 备份原文件
cp "$ENV_FILE" "${ENV_FILE}.backup"
echo "✅ 已备份到: ${ENV_FILE}.backup"

# 更新 WEBHOOK_URL
sed -i "s|WEBHOOK_URL=.*|WEBHOOK_URL=${NGROK_URL}/|g" "$ENV_FILE"
echo "✅ 已更新 WEBHOOK_URL=${NGROK_URL}/"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  配置更新完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 下一步操作："
echo "1. 重启 n8n 服务使配置生效:"
echo "   cd $SCRIPT_DIR"
echo "   docker compose down"
echo "   docker compose up -d"
echo ""
echo "2. 或使用快速重启脚本:"
echo "   ./restart-n8n.sh"
echo ""
echo "3. 访问 n8n:"
echo "   ${NGROK_URL}"
echo ""
