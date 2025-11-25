#!/bin/bash

################################################################################
# Linux 原生 MCP Servers 安装脚本
# 此脚本将安装 NVM、Node.js，并配置所有 MCP servers
################################################################################

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Linux 原生 MCP Servers 安装脚本                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 步骤 1: 安装 NVM
echo -e "${CYAN}步骤 1/5: 安装 NVM (Node Version Manager)...${NC}"
if [ -d "$HOME/.nvm" ]; then
    echo -e "${YELLOW}NVM 已安装，跳过...${NC}"
else
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    echo -e "${GREEN}✓ NVM 安装完成${NC}"
fi

# 加载 NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo ""

# 步骤 2: 安装 Node.js
echo -e "${CYAN}步骤 2/5: 安装 Node.js LTS...${NC}"
if command -v node &> /dev/null; then
    current_version=$(node --version)
    echo -e "${YELLOW}Node.js 已安装: $current_version${NC}"
    read -p "是否重新安装最新 LTS 版本？(y/n): " reinstall
    if [[ "$reinstall" == "y" || "$reinstall" == "Y" ]]; then
        nvm install --lts
        nvm alias default node
    fi
else
    nvm install --lts
    nvm alias default node
    echo -e "${GREEN}✓ Node.js 安装完成${NC}"
fi

echo ""

# 步骤 3: 验证安装
echo -e "${CYAN}步骤 3/5: 验证安装...${NC}"
echo -e "${BLUE}Node 版本:${NC} $(node --version)"
echo -e "${BLUE}npm 版本:${NC} $(npm --version)"
echo -e "${BLUE}npx 版本:${NC} $(npx --version)"

echo ""

# 步骤 4: 创建配置目录
echo -e "${CYAN}步骤 4/5: 创建 MCP 配置目录...${NC}"
mkdir -p ~/.config/cline-mcp
mkdir -p ~/.local/share/cline-mcp/logs

# 创建 README
cat > ~/.config/cline-mcp/README.md << 'EOF'
# Cline MCP 配置目录

此目录包含 Cline MCP servers 的配置文件。

## MCP Servers 位置

MCP servers 通过 npx 自动管理：
- **缓存位置**: ~/.npm/_npx/
- **自动下载**: 首次运行时
- **自动更新**: 每次运行检查

## 目录结构

- ~/.config/cline-mcp/          # 配置文件
- ~/.local/share/cline-mcp/logs/ # 日志文件
- ~/.npm/_npx/                   # npx 缓存（MCP servers）

## 已配置的 MCP Servers

1. Filesystem - 文件系统操作
2. GitHub - GitHub 集成
3. Puppeteer - 浏览器自动化
4. Context7 - 库文档查询
5. Fetch - 网页内容获取
6. Sequential Thinking - 思维链增强
7. Notion - Notion 集成

## Cline 配置文件

~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json

## 测试 MCP Servers

测试 npx 是否正常：
```bash
npx -y cowsay "MCP servers ready!"
```

查看 npx 缓存：
```bash
ls -lh ~/.npm/_npx/
```

## 清理缓存（如需要）

```bash
npm cache clean --force
```
EOF

echo -e "${GREEN}✓ 配置目录已创建${NC}"
echo -e "  ${BLUE}配置目录:${NC} ~/.config/cline-mcp/"
echo -e "  ${BLUE}日志目录:${NC} ~/.local/share/cline-mcp/logs/"

echo ""

# 步骤 5: 加载环境变量
echo -e "${CYAN}步骤 5/7: 加载环境变量...${NC}"

# 检查.env文件
ENV_FILE="$(dirname "$0")/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}错误: 未找到 .env 文件${NC}"
    echo -e "${YELLOW}请执行以下步骤:${NC}"
    echo "  1. cd $(dirname "$0")"
    echo "  2. cp .env.example .env"
    echo "  3. 编辑 .env 文件，填入你的真实 tokens"
    echo ""
    exit 1
fi

# 加载.env文件
set -a
source "$ENV_FILE"
set +a

# 验证必需的环境变量
echo -e "${CYAN}步骤 6/7: 验证环境变量...${NC}"

missing_vars=()

if [ -z "$GITHUB_TOKEN" ] || [ "$GITHUB_TOKEN" = "your_github_token_here" ]; then
    missing_vars+=("GITHUB_TOKEN")
fi

if [ -z "$NOTION_TOKEN" ] || [ "$NOTION_TOKEN" = "your_notion_token_here" ]; then
    missing_vars+=("NOTION_TOKEN")
fi

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}错误: 以下环境变量未正确配置:${NC}"
    for var in "${missing_vars[@]}"; do
        echo -e "  ${YELLOW}✗ $var${NC}"
    done
    echo ""
    echo -e "${YELLOW}请编辑 $ENV_FILE 文件，填入真实的 tokens${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ 环境变量验证通过${NC}"
echo -e "  ${BLUE}GITHUB_TOKEN:${NC} ${GITHUB_TOKEN:0:20}..."
echo -e "  ${BLUE}NOTION_TOKEN:${NC} ${NOTION_TOKEN:0:20}..."

echo ""

# 步骤 7: 更新 Cline 配置
echo -e "${CYAN}步骤 7/7: 配置 Cline MCP Servers...${NC}"

CLINE_CONFIG="$HOME/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"

if [ -f "$CLINE_CONFIG" ]; then
    # 备份原配置
    cp "$CLINE_CONFIG" "$CLINE_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${YELLOW}原配置已备份${NC}"
fi

# 写入新配置（使用环境变量）
cat > "$CLINE_CONFIG" << EOF
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/averyubuntu/projects"
      ],
      "autoApprove": [
        "read_text_file",
        "read_media_file",
        "read_multiple_files",
        "edit_file",
        "create_directory",
        "list_directory_with_sizes",
        "move_file",
        "search_files",
        "get_file_info",
        "list_allowed_directories",
        "list_files",
        "read_file",
        "write_file",
        "list_directory",
        "directory_tree"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_TOKEN": "$GITHUB_TOKEN"
      },
      "autoApprove": [
        "create_or_update_file",
        "search_repositories",
        "create_repository",
        "get_file_contents",
        "push_files",
        "create_issue",
        "create_pull_request",
        "fork_repository",
        "create_branch",
        "list_commits",
        "list_issues",
        "update_issue",
        "add_issue_comment",
        "search_code",
        "search_issues",
        "search_users",
        "get_issue",
        "get_pull_request",
        "list_pull_requests",
        "create_pull_request_review",
        "merge_pull_request",
        "get_pull_request_files",
        "get_pull_request_status",
        "update_pull_request_branch",
        "get_pull_request_comments",
        "get_pull_request_reviews"
      ]
    },
    "puppeteer": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ],
      "autoApprove": [
        "puppeteer_navigate",
        "puppeteer_screenshot",
        "puppeteer_click",
        "puppeteer_fill",
        "puppeteer_select",
        "puppeteer_hover",
        "puppeteer_evaluate"
      ]
    },
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp"
      ],
      "autoApprove": [
        "resolve-library-id",
        "get-library-docs"
      ]
    },
    "fetch": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-fetch-server"
      ],
      "autoApprove": [
        "fetch_html",
        "fetch_json",
        "fetch_txt",
        "fetch_markdown"
      ]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-sequentialthinking-tools"
      ],
      "env": {
        "MAX_HISTORY_SIZE": "1000"
      },
      "autoApprove": [
        "sequentialthinking_tools"
      ]
    },
    "notion": {
      "command": "npx",
      "args": [
        "-y",
        "@notionhq/notion-mcp-server"
      ],
      "env": {
        "NOTION_TOKEN": "$NOTION_TOKEN"
      },
      "autoApprove": [
        "API-get-user",
        "API-get-users",
        "API-get-self",
        "API-post-database-query",
        "API-post-search",
        "API-get-block-children",
        "API-patch-block-children",
        "API-retrieve-a-block",
        "API-update-a-block",
        "API-delete-a-block",
        "API-retrieve-a-page",
        "API-patch-page",
        "API-post-page",
        "API-create-a-database",
        "API-update-a-database",
        "API-retrieve-a-database",
        "API-retrieve-a-page-property",
        "API-retrieve-a-comment",
        "API-create-a-comment"
      ]
    }
  }
}
EOF

echo -e "${GREEN}✓ Cline 配置已更新${NC}"
echo -e "  ${BLUE}配置文件:${NC} $CLINE_CONFIG"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                 🎉 安装完成！🎉                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 测试 npx
echo -e "${CYAN}测试 npx...${NC}"
if npx -y cowsay "MCP servers ready!" 2>/dev/null; then
    echo ""
else
    echo -e "${YELLOW}cowsay 测试跳过（可选工具）${NC}"
fi

echo ""
echo -e "${BLUE}下一步操作：${NC}"
echo "1. ${CYAN}重启终端或运行:${NC} source ~/.bashrc"
echo "2. ${CYAN}重启 VS Code${NC} (Ctrl+Shift+P → Reload Window)"
echo "3. ${CYAN}开始使用 Cline${NC} - 所有 MCP servers 已配置完成！"
echo ""
echo -e "${BLUE}验证安装：${NC}"
echo "  node --version    # 检查 Node.js 版本"
echo "  npx --version     # 检查 npx 版本"
echo "  nvm list          # 查看已安装的 Node.js 版本"
echo ""
echo -e "${BLUE}查看文档：${NC}"
echo "  cat ~/.config/cline-mcp/README.md"
echo ""
echo -e "${GREEN}所有 7 个 MCP servers 已配置完成！${NC}"
echo "  ✓ Filesystem"
echo "  ✓ GitHub"
echo "  ✓ Puppeteer"
echo "  ✓ Context7"
echo "  ✓ Fetch"
echo "  ✓ Sequential Thinking"
echo "  ✓ Notion"
echo ""
