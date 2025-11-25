#!/bin/bash
# n8n 快速重启脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔄 重启 n8n 服务..."
cd "$SCRIPT_DIR"

# 停止服务
echo "⏸️  停止 n8n..."
docker compose down

# 等待停止完成
sleep 2

# 启动服务
echo "🚀 启动 n8n..."
docker compose up -d

# 等待启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查状态
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker compose ps
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ n8n 已重启"
echo "📋 访问地址:"
echo "   本地: http://localhost:5678"

# 尝试显示 ngrok URL
if [ -f .env ]; then
    WEBHOOK_URL=$(grep "^WEBHOOK_URL=" .env | cut -d'=' -f2)
    if [ -n "$WEBHOOK_URL" ] && [ "$WEBHOOK_URL" != "https://YOUR_NGROK_URL_HERE/" ]; then
        echo "   外部: $WEBHOOK_URL"
    fi
fi

echo ""
echo "📝 查看日志:"
echo "   docker compose logs -f n8n"
echo ""
