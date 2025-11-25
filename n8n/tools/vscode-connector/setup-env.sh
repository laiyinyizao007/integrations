#!/bin/bash

# n8n VSCode Connector - 环境变量设置脚本
# 用于快速设置环境变量配置

echo "🔧 n8n VSCode Connector - 环境变量设置"
echo "========================================"

# 检查是否已存在.env文件
if [ -f ".env" ]; then
    echo "⚠️  .env 文件已存在！"
    read -p "是否要覆盖现有的 .env 文件？(y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 操作取消"
        exit 1
    fi
fi

# 复制模板
cp .env.example .env
echo "✅ 已创建 .env 文件"

# 提示用户编辑
echo ""
echo "📝 请编辑 .env 文件，设置您的配置："
echo "   N8N_BASE_URL=https://your-huggingface-space.hf.space"
echo "   N8N_API_KEY=your-api-key-here  # 如果需要"
echo ""
echo "🖊️  正在打开 .env 文件进行编辑..."

# 尝试使用默认编辑器打开文件
if command -v code &> /dev/null; then
    code .env
elif command -v nano &> /dev/null; then
    nano .env
elif command -v vim &> /dev/null; then
    vim .env
else
    echo "⚠️  请手动编辑 .env 文件"
fi

echo ""
echo "🎉 设置完成！"
echo "   重新启动VSCode以应用新的环境变量配置。"
