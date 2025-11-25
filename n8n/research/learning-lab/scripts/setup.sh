#!/bin/bash

# n8n学习项目环境设置脚本
# 用于快速配置和启动n8n学习环境

set -e

echo "🚀 n8n学习项目环境设置"
echo "=========================="

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
N8N_DIR="$PROJECT_ROOT/../Averivendell_n8n"
CONNECTOR_DIR="$PROJECT_ROOT/../n8n-vscode-connector"

echo "📁 项目路径: $PROJECT_ROOT"
echo "📁 n8n路径: $N8N_DIR"
echo "📁 扩展路径: $CONNECTOR_DIR"
echo ""

# 检查依赖
check_dependencies() {
    echo "🔍 检查依赖..."

    # 检查Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker 未安装，请先安装 Docker"
        exit 1
    fi

    # 检查Docker Compose
    if ! command -v docker &> /dev/null && docker compose version &> /dev/null; then
        echo "❌ Docker Compose 未安装"
        exit 1
    fi

    # 检查Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装"
        exit 1
    fi

    # 检查npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm 未安装"
        exit 1
    fi

    echo "✅ 依赖检查通过"
}

# 启动n8n服务
start_n8n() {
    echo "🐳 启动 n8n 服务..."

    if [ ! -d "$N8N_DIR" ]; then
        echo "❌ 找不到 Averivendell_n8n 目录: $N8N_DIR"
        echo "请确保项目结构正确"
        exit 1
    fi

    cd "$N8N_DIR"

    # 检查是否已经在运行
    if docker compose ps | grep -q "Up"; then
        echo "ℹ️  n8n 服务已在运行"
    else
        echo "📦 启动 Docker 容器..."
        ./start.sh

        # 等待服务启动
        echo "⏳ 等待 n8n 服务启动..."
        sleep 10

        # 验证服务状态
        if curl -s http://localhost:5678 > /dev/null; then
            echo "✅ n8n 服务启动成功"
            echo "🌐 访问地址: http://localhost:5678"
            echo "👤 用户名: admin"
            echo "🔑 密码: avery_n8n_2025"
        else
            echo "❌ n8n 服务启动失败"
            echo "请检查 Docker 日志: docker compose logs"
            exit 1
        fi
    fi
}

# 构建VSCode扩展
build_vscode_extension() {
    echo "🔧 构建 VSCode 扩展..."

    if [ ! -d "$CONNECTOR_DIR" ]; then
        echo "❌ 找不到 n8n-vscode-connector 目录: $CONNECTOR_DIR"
        echo "请确保项目结构正确"
        exit 1
    fi

    cd "$CONNECTOR_DIR"

    # 安装依赖
    echo "📦 安装扩展依赖..."
    npm install

    # 编译扩展
    echo "⚙️  编译扩展..."
    npm run compile

    # 检查编译结果
    if [ -f "n8n-vscode-connector-1.0.0.vsix" ]; then
        echo "✅ 扩展编译成功"
    else
        echo "❌ 扩展编译失败"
        exit 1
    fi
}

# 配置环境变量
setup_environment() {
    echo "⚙️  配置环境变量..."

    # 为VSCode扩展创建.env文件
    if [ ! -f "$CONNECTOR_DIR/.env" ]; then
        cat > "$CONNECTOR_DIR/.env" << EOF
# n8n VSCode Connector 环境配置
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=
N8N_TIMEOUT=30000
EOF
        echo "✅ 创建了 $CONNECTOR_DIR/.env 文件"
    else
        echo "ℹ️  $CONNECTOR_DIR/.env 文件已存在"
    fi

    # 创建项目级别的环境变量模板
    if [ ! -f "$PROJECT_ROOT/.env.example" ]; then
        cat > "$PROJECT_ROOT/.env.example" << EOF
# n8n学习项目环境变量模板
# 复制此文件为 .env 并填写实际值

# n8n实例配置
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=

# Telegram Bot配置 (用于机器人示例)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# GitHub API配置 (用于API集成示例)
GITHUB_TOKEN=your_github_token_here

# 其他服务配置
SLACK_WEBHOOK_URL=your_slack_webhook_url
DISCORD_WEBHOOK_URL=your_discord_webhook_url
EOF
        echo "✅ 创建了 $PROJECT_ROOT/.env.example 文件"
    fi
}

# 验证设置
verify_setup() {
    echo "🔍 验证设置..."

    # 检查n8n服务
    if curl -s http://localhost:5678/rest/workflows > /dev/null; then
        echo "✅ n8n API 可访问"
    else
        echo "❌ n8n API 不可访问"
        return 1
    fi

    # 检查扩展文件
    if [ -f "$CONNECTOR_DIR/n8n-vscode-connector-1.0.0.vsix" ]; then
        echo "✅ VSCode 扩展已编译"
    else
        echo "❌ VSCode 扩展未编译"
        return 1
    fi

    # 检查环境变量
    if [ -f "$CONNECTOR_DIR/.env" ]; then
        echo "✅ 环境变量已配置"
    else
        echo "❌ 环境变量未配置"
        return 1
    fi

    echo "🎉 所有验证通过！"
    return 0
}

# 显示使用指南
show_guide() {
    echo ""
    echo "🎯 设置完成！接下来做什么："
    echo "================================"
    echo ""
    echo "1. 🚀 启动学习之旅"
    echo "   阅读: docs/getting-started.md"
    echo ""
    echo "2. 🔧 安装VSCode扩展"
    echo "   code --install-extension $CONNECTOR_DIR/n8n-vscode-connector-1.0.0.vsix"
    echo ""
    echo "3. 🌐 访问n8n界面"
    echo "   打开浏览器访问: http://localhost:5678"
    echo "   用户名: admin"
    echo "   密码: avery_n8n_2025"
    echo ""
    echo "4. 📚 导入示例工作流"
    echo "   ./scripts/import-workflows.sh"
    echo ""
    echo "5. 🎨 在VSCode中预览n8n"
    echo "   打开 n8n-preview.html → 右键 → Open with Live Server"
    echo ""
    echo "📖 更多信息请查看 README.md"
}

# 主函数
main() {
    echo "开始设置 n8n 学习环境..."
    echo ""

    check_dependencies
    echo ""

    start_n8n
    echo ""

    build_vscode_extension
    echo ""

    setup_environment
    echo ""

    if verify_setup; then
        show_guide
        echo ""
        echo "🎊 n8n学习环境设置完成！"
        echo "开始您的自动化之旅吧！🚀"
    else
        echo ""
        echo "❌ 设置过程中出现问题，请检查上述错误信息"
        exit 1
    fi
}

# 检查是否直接运行脚本
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
