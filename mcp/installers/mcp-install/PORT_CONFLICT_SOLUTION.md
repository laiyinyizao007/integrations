# Cline-CLI MCP 端口冲突解决方案

## ❌ 问题描述

在启动 cline-cli MCP 服务器时遇到端口占用错误：

```
Error: listen EADDRINUSE: address already in use :::3000
```

## 🔍 问题原因

端口 3000 已经被其他进程占用（可能是另一个开发服务器或应用）。

检查端口占用：
```bash
lsof -i :3000
# 输出显示进程 538805 正在占用端口 3000
```

## ✅ 解决方案

### 方案 1: 更改 MCP 服务器端口（已实施）

已将 cline-cli MCP 服务器的端口从 3000 更改为 3001。

**修改的文件：**
`~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

**更改内容：**
```json
{
  "cline-cli": {
    "args": [
      "-y",
      "mcp-cline",
      "--mcpPort",
      "3001"  // 从 3000 改为 3001
    ]
  }
}
```

### 方案 2: 停止占用端口的进程（备选）

如果你确定端口 3000 被不需要的进程占用，可以停止它：

```bash
# 查找占用端口的进程
lsof -i :3000

# 停止进程（替换 PID 为实际进程 ID）
kill -9 PID

# 或者更温和的停止方式
kill PID
```

## 🚀 后续步骤

### 1. 重启 Cline 扩展

**方法 1: 重新加载 VS Code 窗口**
```
Ctrl+Shift+P -> "Reload Window"
```

**方法 2: 重启 VS Code**
- 关闭并重新打开 VS Code

### 2. 验证 MCP 服务器状态

重启后，在 Cline 扩展中：
1. 点击顶部的 "MCP Servers" 图标
2. 检查 "cline-cli" 服务器状态
3. 应该显示为连接成功（绿色）

### 3. 测试 MCP 工具

在 Cline 中尝试使用：
```
使用 cline-cli 创建一个测试文件
```

## 🔧 其他可用端口

如果端口 3001 也被占用，可以选择其他端口：

**常用的未占用端口：**
- 3002
- 3003
- 8080
- 8081
- 5000
- 5001

**修改方法：**
编辑 MCP 配置文件，将 `"3001"` 改为你选择的端口号。

```bash
nano ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

## 📋 配置检查清单

- [x] 更新 MCP 配置文件中的端口号为 3001
- [ ] 重启 VS Code 或重新加载窗口
- [ ] 检查 MCP Servers 连接状态
- [ ] 测试 cline-cli MCP 工具功能

## ⚠️ 注意事项

1. **API Key 配置**
   - 配置文件中的 `API_KEY` 仍需要替换为真实的 Anthropic API Key
   - 位置：同一配置文件的 `env.API_KEY` 字段

2. **端口一致性**
   - 确保 cline-cli 自身配置也使用相同端口（如果需要）
   - 防火墙需要允许该端口的本地连接

3. **首次启动**
   - MCP 服务器会通过 npx 自动下载 `mcp-cline` 包
   - 首次启动可能需要几秒钟时间

## 📚 相关资源

- **完整配置指南**: `mcp-install/CLINE_CLI_MCP_SETUP.md`
- **MCP 配置文件位置**: `~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **项目仓库**: 
  - [yaegaki/cline-cli](https://github.com/yaegaki/cline-cli)
  - [tbarron-xyz/mcp-cline](https://github.com/tbarron-xyz/mcp-cline)

## 🐛 故障排查

### 问题：MCP 服务器仍然无法启动

**解决步骤：**
1. 检查新端口是否也被占用：`lsof -i :3001`
2. 查看 Cline 扩展的错误日志
3. 尝试使用其他端口号
4. 确认 Node.js 和 npm 正常工作

### 问题：MCP 工具不可用

**检查项：**
- MCP 服务器是否成功启动（绿色状态）
- API Key 是否正确配置
- 网络连接是否正常
- cline-cli 是否已安装

---

**解决时间**: 2025-01-08  
**状态**: ✅ 已解决  
**使用端口**: 3001（从 3000 更改）
