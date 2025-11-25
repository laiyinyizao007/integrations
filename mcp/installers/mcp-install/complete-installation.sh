#!/bin/bash

################################################################################
# MCP 安装完成脚本
# 此脚本将完成 Node.js 安装并验证所有配置
################################################################################

echo "============================================"
echo "  MCP 安装完成向导"
echo "============================================"
echo ""

# 步骤 1: 加载 NVM
echo "步骤 1: 加载 NVM..."
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh"
    echo "✓ NVM 已加载"
else
    echo "✗ NVM 未找到，请先运行 setup-mcp-linux.sh"
    exit 1
fi

echo ""

# 步骤 2: 检查 Node.js
echo "步骤 2: 检查 Node.js 安装..."
if command -v node &> /dev/null; then
    echo "✓ Node.js 已安装: $(node --version)"
    echo "✓ npm 版本: $(npm --version)"
    echo "✓ npx 版本: $(npx --version)"
else
    echo "⚠ Node.js 未安装，开始安装..."
    echo "正在下载 Node.js LTS（这可能需要几分钟）..."
    nvm install --lts
    nvm alias default node
    echo "✓ Node.js 安装完成"
fi

echo ""

# 步骤 3: 验证环境
echo "步骤 3: 验证环境..."
echo "Node.js 路径: $(which node)"
echo "npm 路径: $(which npm)"
echo "npx 路径: $(which npx)"

echo ""

# 步骤 4: 测试 npx
echo "步骤 4: 测试 npx..."
if npx -y cowsay "测试成功！" 2>/dev/null; then
    echo "✓ npx 工作正常"
else
    echo "⚠ cowsay 测试跳过（可选）"
fi

echo ""

# 步骤 5: 检查配置文件
echo "步骤 5: 检查配置文件..."

if [ -d ~/.config/cline-mcp ]; then
    echo "✓ 配置目录存在: ~/.config/cline-mcp/"
else
    echo "✗ 配置目录不存在"
fi

if [ -d ~/.local/share/cline-mcp/logs ]; then
    echo "✓ 日志目录存在: ~/.local/share/cline-mcp/logs/"
else
    echo "✗ 日志目录不存在"
fi

CLINE_CONFIG="$HOME/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
if [ -f "$CLINE_CONFIG" ]; then
    echo "✓ Cline 配置文件存在"
    echo "  位置: $CLINE_CONFIG"
else
    echo "✗ Cline 配置文件不存在"
fi

echo ""
echo "============================================"
echo "  安装状态总结"
echo "============================================"
echo ""

# 最终检查
ALL_OK=true

if ! command -v node &> /dev/null; then
    echo "✗ Node.js 未安装"
    ALL_OK=false
else
    echo "✓ Node.js: $(node --version)"
fi

if ! command -v npm &> /dev/null; then
    echo "✗ npm 未安装"
    ALL_OK=false
else
    echo "✓ npm: $(npm --version)"
fi

if ! command -v npx &> /dev/null; then
    echo "✗ npx 未安装"
    ALL_OK=false
else
    echo "✓ npx: $(npx --version)"
fi

if [ -f "$CLINE_CONFIG" ]; then
    echo "✓ Cline 配置: 已配置"
else
    echo "✗ Cline 配置: 未找到"
    ALL_OK=false
fi

echo ""

if [ "$ALL_OK" = true ]; then
    echo "🎉 所有检查通过！"
    echo ""
    echo "下一步："
    echo "1. 在当前终端运行: source ~/.bashrc"
    echo "2. 重启 VS Code (Ctrl+Shift+P → Reload Window)"
    echo "3. 开始使用 Cline 和 MCP servers！"
    echo ""
    echo "查看已配置的 MCP servers:"
    echo "  cat $CLINE_CONFIG"
else
    echo "⚠ 有些检查未通过，请查看上面的错误信息"
    echo ""
    echo "如果 Node.js 未安装，请在新终端中运行:"
    echo "  export NVM_DIR=\"\$HOME/.nvm\""
    echo "  [ -s \"\$NVM_DIR/nvm.sh\" ] && source \"\$NVM_DIR/nvm.sh\""
    echo "  nvm install --lts"
    echo "  nvm alias default node"
fi

echo ""
