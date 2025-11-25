# Cline-CLI MCP 服务器配置指南

## 📋 项目说明

这个配置让你可以在 Cline VS Code 扩展中通过 MCP 调用 `cline-cli`，实现 "Run cline from cline" 的功能。

### 相关项目

- **[@yaegaki/cline-cli](https://github.com/yaegaki/cline-cli)** - 独立的 Cline 命令行工具
- **[mcp-cline](https://github.com/tbarron-xyz/mcp-cline)** - 控制 cline-cli 的 MCP 服务器

## 🔧 安装步骤

### 步骤 1: 安装 cline-cli

```bash
# 全局安装
npm install -g @yaegaki/cline-cli

# 或者使用 npx（无需全局安装）
npx -y @yaegaki/cline-cli init
```

### 步骤 2: 配置 cline-cli

```bash
# 初始化配置文件
cline-cli init

# 编辑配置文件
nano ~/.cline_cli/cline_cli_settings.json
```

### 步骤 3: 配置 cline_cli_settings.json

编辑 `~/.cline_cli/cline_cli_settings.json` 文件：

```json
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
```

### 步骤 4: 配置 MCP 设置文件（可选）

如果 cline-cli 也需要使用 MCP 服务器，需要配置：
```bash
# 这个文件与 VS Code Cline 扩展的配置相同
cp ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json \
   ~/.cline_cli/cline_mcp_settings.json
```

### 步骤 5: 设置 API Key

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export API_KEY="your-anthropic-api-key-here"

# 或者每次使用时指定
API_KEY=your-key cline-cli task "你的任务"
```

### 步骤 6: 测试 cline-cli

```bash
# 测试运行
API_KEY=your-key cline-cli task "创建一个简单的 hello world Python 脚本"
```

## 📦 配置 MCP 服务器到 Cline

### 方法 1: 手动编辑配置文件

编辑 Cline MCP 配置文件：
```bash
nano ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

添加以下配置：

```json
{
  "mcpServers": {
    "cline-cli": {
      "command": "/home/averyubuntu/.nvm/versions/node/v24.11.0/bin/npx",
      "args": [
        "-y",
        "mcp-cline",
        "--mcpPort",
        "3000"
      ],
      "env": {
        "PATH": "/home/averyubuntu/.nvm/versions/node/v24.11.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "API_KEY": "your-anthropic-api-key-here"
      },
      "autoApprove": [
        "task",
        "readOutput",
        "y",
        "n"
      ]
    }
  }
}
```

### 方法 2: 通过 Cline UI 添加

1. 在 VS Code 中打开 Cline 扩展
2. 点击顶部导航栏的 "MCP Servers" 图标
3. 选择 "Configure" 标签
4. 点击 "+" 添加新服务器
5. 填写以下信息：
   - **名称**: `cline-cli`
   - **命令**: `npx`
   - **参数**: `-y mcp-cline --mcpPort 3000`
   - **环境变量**: 添加 `API_KEY`

## 🚀 使用方法

配置完成后，在 Cline VS Code 扩展中可以使用以下 MCP 工具：

### 可用工具

1. **task(prompt)** - 启动一个新的 cline-cli 任务
   ```
   使用 cline-cli 创建一个 Python 脚本来计算斐波那契数列
   ```

2. **readOutput()** - 读取任务的完整输出历史
   ```
   读取上一个 cline-cli 任务的输出
   ```

3. **y()** - 对 y/n 提示回答 "y"
   ```
   批准 cline-cli 的操作
   ```

4. **n()** - 对 y/n 提示回答 "n"
   ```
   拒绝 cline-cli 的操作
   ```

## 📝 配置文件位置总结

| 文件 | 位置 | 用途 |
|------|------|------|
| cline-cli 设置 | `~/.cline_cli/cline_cli_settings.json` | cline-cli 的配置 |
| cline-cli MCP 设置 | `~/.cline_cli/cline_mcp_settings.json` | cline-cli 使用的 MCP 服务器 |
| Cline 扩展 MCP 设置 | `~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` | VS Code Cline 扩展的 MCP 服务器配置 |

## ⚙️ 高级配置

### 自定义端口

如果默认端口 3000 已被占用，可以修改：

```json
{
  "args": [
    "-y",
    "mcp-cline",
    "--mcpPort",
    "3001"
  ]
}
```

### 自定义工作区

使用 cline-cli 时指定工作区：

```bash
cline-cli task "你的任务" --workspace /path/to/project
```

### 完全自动模式

```bash
cline-cli task "你的任务" --full-auto
```

### 自动批准 MCP

```bash
cline-cli task "你的任务" --auto-approve-mcp
```

## 🐛 故障排查

### 问题 1: cline-cli 命令未找到

```bash
# 确认安装
npm list -g @yaegaki/cline-cli

# 重新安装
npm install -g @yaegaki/cline-cli
```

### 问题 2: API Key 错误

```bash
# 检查环境变量
echo $API_KEY

# 临时设置
export API_KEY="your-key"

# 或在配置中使用
API_KEY=your-key cline-cli task "任务"
```

### 问题 3: MCP 服务器连接失败

```bash
# 测试 mcp-cline 服务器
npx mcp-cline --mcpPort 3000

# 检查端口占用
lsof -i :3000
```

### 问题 4: cline-cli 不读取 MCP 工具

根据项目说明，cline-cli 目前可能不会自动读取 MCP 服务器上的工具并传递给 API 调用。这是一个已知限制。

## 📚 相关资源

- [Cline 官方文档](https://docs.cline.bot)
- [yaegaki/cline-cli GitHub](https://github.com/yaegaki/cline-cli)
- [tbarron-xyz/mcp-cline GitHub](https://github.com/tbarron-xyz/mcp-cline)
- [Model Context Protocol](https://modelcontextprotocol.io)

## ⚠️ 注意事项

1. **开发状态**: cline-cli 仍在开发中，不建议在生产环境使用
2. **功能限制**: `browser_action` 和 `execute_command` 工具目前不支持
3. **MCP 工具**: cline-cli 可能无法自动传递 MCP 工具到模型
4. **API 成本**: 运行 cline-cli 会产生额外的 API 调用费用

## 🎯 使用示例

### 示例 1: 在 Cline 中启动 cline-cli 任务

在 Cline VS Code 扩展中输入：
```
使用 cline-cli MCP 工具创建一个新任务：编写一个 Python 脚本来分析日志文件
```

### 示例 2: 读取任务输出

```
使用 readOutput 工具查看上一个 cline-cli 任务的完整输出
```

### 示例 3: 批准操作

```
使用 y() 工具批准 cline-cli 的当前操作
```

---

**创建时间**: 2025-01-08  
**配置版本**: v1.0  
**系统**: Linux (WSL)
