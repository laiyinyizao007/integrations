# Linux 原生 MCP Servers 安装方案

## 📋 当前情况分析

您的 WSL 环境目前使用的是 Windows 的 Node.js：
- 路径：`/mnt/c/Program Files/nodejs/`
- 这导致路径转换问题和超时问题

## 🎯 解决方案：安装 Linux 原生 Node.js

### 方案选择

推荐使用 **NVM (Node Version Manager)**，原因：
- ✅ 易于安装和管理
- ✅ 可以轻松切换 Node.js 版本
- ✅ 不需要 sudo 权限
- ✅ 安装在用户目录，不污染系统

### 步骤 1: 安装 NVM

```bash
# 下载并安装 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载 shell 配置
source ~/.bashrc

# 验证安装
nvm --version
```

### 步骤 2: 安装 Node.js

```bash
# 安装最新的 LTS 版本
nvm install --lts

# 设置为默认版本
nvm alias default node

# 验证安装
node --version
npm --version
npx --version
```

### 步骤 3: MCP Servers 配置

MCP servers 使用 **npx** 运行，**无需手动安装**。

#### 推荐的目录结构

```
~/.config/
└── mcp-servers/          # 可选：MCP servers 配置目录
    └── logs/             # 日志文件
```

或者简单使用：
```
/home/averyubuntu/projects/   # 已有的项目目录
```

#### 为什么不需要单独安装目录？

1. **npx 自动管理**：
   - npx 会自动下载并缓存包
   - 缓存位置：`~/.npm/_npx/`
   - 每次运行都使用最新版本

2. **Cline 配置简单**：
   - 只需指定 `npx` 命令
   - 不需要指定安装路径

3. **易于维护**：
   - 自动更新
   - 不占用额外空间
   - 清理方便

### 步骤 4: 更新 Cline 配置

配置文件将使用：
- **命令**: Linux 原生 npx
- **路径**: Linux 原生路径 `/home/averyubuntu/projects`
- **无需 WSL 路径转换**

配置示例：
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/averyubuntu/projects"
      ]
    }
  }
}
```

## 🔧 完整安装命令

### 一键安装脚本

```bash
#!/bin/bash

echo "=== 安装 Linux 原生 Node.js 环境 ==="

# 1. 安装 NVM
echo "步骤 1: 安装 NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. 加载 NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 3. 安装 Node.js LTS
echo "步骤 2: 安装 Node.js LTS..."
nvm install --lts
nvm alias default node

# 4. 验证安装
echo "步骤 3: 验证安装..."
echo "Node 版本: $(node --version)"
echo "npm 版本: $(npm --version)"
echo "npx 版本: $(npx --version)"

# 5. 测试 npx
echo "步骤 4: 测试 npx..."
npx --version

echo ""
echo "=== 安装完成！==="
echo ""
echo "下一步："
echo "1. 关闭并重新打开终端"
echo "2. 或运行: source ~/.bashrc"
echo "3. 然后告诉我继续配置 MCP servers"
```

## 📝 配置文件位置

```
~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

## ✅ 优势对比

| 方案 | Windows Node.js | Linux 原生 Node.js |
|------|----------------|-------------------|
| 路径格式 | 复杂的 WSL 转换 | 简单的 Linux 路径 |
| 性能 | 慢（跨系统调用） | 快（原生执行） |
| 兼容性 | 经常出问题 | 完美兼容 |
| 维护 | 困难 | 简单 |

## 🚀 准备好了吗？

运行以下命令开始安装：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash && \
source ~/.bashrc && \
nvm install --lts && \
nvm alias default node && \
echo "安装完成！Node 版本: $(node --version)"
```

安装完成后告诉我，我将为您配置所有 MCP servers！
