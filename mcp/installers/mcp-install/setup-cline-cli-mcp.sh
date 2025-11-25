#!/bin/bash

# Cline-CLI MCP 服务器自动配置脚本
# 用途：自动安装和配置 cline-cli 及其 MCP 服务器

set -e

echo "=========================================="
echo "Cline-CLI MCP 服务器配置向导"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 步骤 1: 检查 Node.js 和 npm
echo -e "${YELLOW}[1/6] 检查环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未找到 Node.js，请先安装 Node.js${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: 未找到 npm，请先安装 npm${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version) 已安装${NC}"
echo -e "${GREEN}✓ npm $(npm --version) 已安装${NC}"
echo ""

# 步骤 2: 安装 @yaegaki/cline-cli
echo -e "${YELLOW}[2/6] 安装 @yaegaki/cline-cli...${NC}"
read -p "是否全局安装 @yaegaki/cline-cli? (y/n): " install_global

if [[ "$install_global" == "y" ]]; then
    npm install -g @yaegaki/cline-cli
    echo -e "${GREEN}✓ @yaegaki/cline-cli 已全局安装${NC}"
else
    echo -e "${YELLOW}跳过全局安装，将使用 npx${NC}"
fi
echo ""

# 步骤 3: 初始化 cline-cli
echo -e "${YELLOW}[3/6] 初始化 cline-cli 配置...${NC}"
if [[ "$install_global" == "y" ]]; then
    cline-cli init
else
    npx -y @yaegaki/cline-cli init
fi
echo -e "${GREEN}✓ 配置文件已创建在 ~/.cline_cli/${NC}"
echo ""

# 步骤 4: 配置 API Key
echo -e "${YELLOW}[4/6] 配置 API Key...${NC}"
read -p "请输入你的 Anthropic API Key (或按回车跳过): " api_key

if [[ -n "$api_key" ]]; then
    # 更新 cline_cli_settings.json
    SETTINGS_FILE="$HOME/.cline_cli/cline_cli_settings.json"
    
    if [[ -f "$SETTINGS_FILE" ]]; then
        # 创建一个包含 API provider 配置的文件
        cat > "$SETTINGS_FILE" << EOF
{
  "globalState": {
    "apiProvider": "anthropic",
    "apiModelId": "claude-3-7-sonnet-20250219",
    "autoApprovalSettings": {
      "enabled": true,
      "actions": {
        "readFiles": true,
        "editFiles": false,
        "executeSafeCommands": true,
        "useMcp": false
      },
      "maxRequests": 20
    }
  },
  "settings": {
    "cline.enableCheckpoints": false
  }
}
EOF
        echo -e "${GREEN}✓ cline-cli 配置已更新${NC}"
    fi
    
    # 更新 Cline MCP 配置中的 API_KEY
    MCP_SETTINGS_FILE="$HOME/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
    
    if [[ -f "$MCP_SETTINGS_FILE" ]]; then
        sed -i "s/REPLACE_WITH_YOUR_ANTHROPIC_API_KEY/$api_key/g" "$MCP_SETTINGS_FILE"
        echo -e "${GREEN}✓ Cline MCP 配置已更新${NC}"
    fi
    
    # 添加到环境变量
    echo "" >> "$HOME/.bashrc"
    echo "# Cline-CLI API Key" >> "$HOME/.bashrc"
    echo "export API_KEY=\"$api_key\"" >> "$HOME/.bashrc"
    echo -e "${GREEN}✓ API Key 已添加到 ~/.bashrc${NC}"
    echo -e "${YELLOW}提示: 运行 'source ~/.bashrc' 或重新打开终端以应用环境变量${NC}"
else
    echo -e "${YELLOW}跳过 API Key 配置${NC}"
    echo -e "${YELLOW}你需要手动配置:${NC}"
    echo -e "  1. 编辑 ~/.cline_cli/cline_cli_settings.json"
    echo -e "  2. 编辑 ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
    echo -e "  3. 设置环境变量: export API_KEY=\"your-key\""
fi
echo ""

# 步骤 5: 复制 MCP 设置（可选）
echo -e "${YELLOW}[5/6] 配置 cline-cli MCP 设置...${NC}"
read -p "是否将 Cline 扩展的 MCP 配置复制到 cline-cli? (y/n): " copy_mcp

if [[ "$copy_mcp" == "y" ]]; then
    SOURCE_MCP="$HOME/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
    DEST_MCP="$HOME/.cline_cli/cline_mcp_settings.json"
    
    if [[ -f "$SOURCE_MCP" ]]; then
        cp "$SOURCE_MCP" "$DEST_MCP"
        echo -e "${GREEN}✓ MCP 配置已复制${NC}"
    else
        echo -e "${RED}错误: 源文件不存在${NC}"
    fi
else
    echo -e "${YELLOW}跳过 MCP 配置复制${NC}"
fi
echo ""

# 步骤 6: 测试安装
echo -e "${YELLOW}[6/6] 测试安装...${NC}"
read -p "是否测试 cline-cli 安装? (y/n): " test_install

if [[ "$test_install" == "y" ]]; then
    echo -e "${YELLOW}运行测试任务...${NC}"
    if [[ "$install_global" == "y" ]]; then
        cline-cli task "创建一个简单的 hello.txt 文件，内容为 Hello from cline-cli" --full-auto || true
    else
        npx -y @yaegaki/cline-cli task "创建一个简单的 hello.txt 文件，内容为 Hello from cline-cli" --full-auto || true
    fi
fi
echo ""

# 完成
echo "=========================================="
echo -e "${GREEN}✓ 配置完成！${NC}"
echo "=========================================="
echo ""
echo "后续步骤:"
echo "1. 在 VS Code 中重新加载窗口 (Ctrl+Shift+P -> Reload Window)"
echo "2. 打开 Cline 扩展，检查 MCP Servers 中是否有 'cline-cli'"
echo "3. 测试使用: 在 Cline 中输入任务来调用 cline-cli MCP 工具"
echo ""
echo "配置文件位置:"
echo "  - cline-cli 配置: ~/.cline_cli/cline_cli_settings.json"
echo "  - Cline MCP 配置: ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
echo ""
echo "可用的 MCP 工具:"
echo "  - task(prompt) - 启动新任务"
echo "  - readOutput() - 读取任务输出"
echo "  - y() - 批准操作"
echo "  - n() - 拒绝操作"
echo ""
echo "文档: mcp-install/CLINE_CLI_MCP_SETUP.md"
echo ""
