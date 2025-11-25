# vscode-mcp-server-tabs 设置指南

## 🎉 已完成的步骤

- [x] 克隆并扩展 vscode-mcp-server
- [x] 添加 tab-tools.ts（标签页管理功能）
- [x] 更新 server.ts 和 extension.ts
- [x] 安装依赖
- [x] 修复编译错误
- [x] 打包 VSIX
- [x] 安装扩展到 VSCode
- [x] 配置 Cline MCP settings

## 🔧 下一步操作（需要手动完成）

### 1. 重新加载 VSCode 窗口

**按 F1 或 Ctrl+Shift+P，输入并选择：**
```
Developer: Reload Window
```

这将重启 VSCode 并加载新安装的 vscode-mcp-server 扩展和 Cline MCP 配置。

### 2. 启用 vscode-mcp-server

**查看 VSCode 状态栏（底部）：**
- 应该看到 `$(server) MCP Server: Off` 或 `$(server) MCP Server: 3000`
- **点击该状态栏项目**以切换服务器开关
- 确保显示为 `$(server) MCP Server: 3000`（表示服务器已启动）

### 3. 重启 Cline

**重启 Cline 以加载新的 MCP 配置：**
1. 打开 Cline 面板
2. 点击右上角的设置图标
3. 选择 "Restart Cline" 或直接关闭并重新打开 VSCode

## ✅ 验证安装

### 检查 MCP 服务器状态

在 Cline 聊天中询问：
```
你现在能看到 close_tabs_code 工具吗？
```

如果成功，Cline 应该能够列出所有可用的工具，包括：
- `close_tabs_code` ⭐（新添加的标签页管理功能）
- `list_files_code`
- `read_file_code`
- `search_symbols_code`
- `get_document_symbols_code`
- 等等...

## 🧪 测试功能

### 测试 close_tabs_code

1. **打开多个标签页**（3-5个）

2. **在 Cline 中请求：**
```
帮我关闭除了当前标签页之外的所有其他标签页
```

Cline 应该会调用：
```javascript
close_tabs_code({ mode: 'others' })
```

3. **验证结果**：除了当前活动的标签页，其他标签页应该都被关闭了

### 可用的模式

`close_tabs_code` 支持三种模式：

1. **`all`** - 关闭所有标签页
   ```
   帮我关闭所有标签页
   ```

2. **`others`** - 关闭除当前标签页外的其他标签页
   ```
   帮我关闭其他标签页
   ```

3. **`group`** - 关闭当前编辑器组的所有标签页
   ```
   帮我关闭当前组的所有标签页
   ```

## 🐛 故障排查

### 问题：看不到 close_tabs_code 工具

**解决方案：**
1. 确认 vscode-mcp-server 扩展已安装
   - 在 VSCode 扩展面板中搜索 "vscode-mcp-server"
   - 应该显示版本 0.3.1（本地安装）

2. 确认 MCP Server 已启动
   - 查看状态栏是否显示 `$(server) MCP Server: 3000`
   - 如果显示 "Off"，点击切换开关

3. 确认 Cline MCP 配置正确
   - 文件位置：`~/.vscode-server/data/User/globalStorage/anthropic.claude-code/settings/cline_mcp_settings.json`
   - 应该包含 `vscode-mcp-server` 配置项

4. 重启 VSCode 和 Cline

### 问题：调用 close_tabs_code 报错

**检查：**
1. VSCode 扩展是否正常运行
2. MCP Server 是否在 localhost:3000 监听
3. 查看 VSCode 输出面板（Output）中的 "MCP Server" 日志

## 📝 技术细节

### 代码实现位置

- **标签页管理工具**：`src/tools/tab-tools.ts`
- **服务器集成**：`src/server.ts`
- **扩展入口**：`src/extension.ts`

### 工作原理

1. Cline 通过 `mcp-remote` 连接到 `http://localhost:3000/mcp`
2. vscode-mcp-server 扩展在 VSCode 中启动 HTTP MCP 服务器
3. 当 Cline 调用 `close_tabs_code` 时，请求通过 HTTP 发送到扩展
4. 扩展调用 VSCode 的命令 API 关闭标签页：
   - `workbench.action.closeAllEditors`
   - `workbench.action.closeOtherEditors`
   - `workbench.action.closeEditorsInGroup`

### 配置文件

**Cline MCP Settings**:
```json
{
  "vscode-mcp-server": {
    "autoApprove": ["close_tabs_code", ...],
    "disabled": false,
    "timeout": 60,
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "mcp-remote@next", "http://localhost:3000/mcp"]
  }
}
```

## 🎯 使用场景

### 优化上下文 Token 使用

**问题**：打开太多标签页导致 Cline 上下文超限（如 202K tokens > 200K）

**解决方案**：
```
我的上下文 tokens 太高了，帮我关闭除了当前文件外的其他标签页
```

Cline 会：
1. 识别需要关闭标签页
2. 调用 `close_tabs_code({ mode: 'others' })`
3. 只保留当前正在编辑的文件
4. 大幅降低上下文 token 使用

### 批量关闭文件

**场景**：完成一个功能后，想清空所有打开的文件

```
帮我关闭所有标签页
```

## 📊 预期效果

### Token 优化示例

**优化前**：
- 打开标签页：19个
- 上下文使用：202,824 tokens（超限！）

**优化后**（关闭不需要的标签页）：
- 打开标签页：1-3个
- 上下文使用：~80,000 tokens（正常）

**改善**：减少 ~60% tokens ✅

## 🔗 相关文档

- **项目 README**：`vscode-mcp-server-tabs/README.md`
- **上下文优化方案**：`docs/guides/CONTEXT_OPTIMIZATION_SOLUTION.md`
- **日期错误教训**：`docs/guides/DATE_ERROR_LESSONS.md`
- **Lessons Learned**：`.cursor/rules/lessons-learned-core.mdc`

## 📅 更新日期

创建时间：2025-11-10  
最后更新：2025-11-10

---

## ⚠️ 重要提示

1. **安全性**：MCP Server 仅监听 localhost，不暴露到网络
2. **自动批准**：`close_tabs_code` 已在 `autoApprove` 列表中，无需手动确认
3. **可逆性**：关闭的标签页可以通过 "File > Recent" 重新打开

---

**祝使用愉快！** 🎉
