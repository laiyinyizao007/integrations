# Context7 MCP 服务器修复说明

## 问题描述

在使用 MCP (Model Context Protocol) 时遇到以下错误：

```
npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/@context-labs%2fmcp-server-context7
npm error 404 The requested resource '@context-labs/mcp-server-context7@*' could not be found
```

## 问题原因

配置文件中使用的包名 `@context-labs/mcp-server-context7` **不存在于 npm 仓库中**。

## 解决方案

### 1. 找到正确的包名

通过搜索 npm 仓库，找到以下可用的 context7 MCP 包：

- ✅ **`@upstash/context7-mcp`** (推荐) - 版本 1.0.26
  - 描述: MCP server for Context7
  - 这是官方维护的 MCP 服务器包

- `context7-mcp-server` - 社区版本
- `@iflow-mcp/context7-mcp` - 第三方版本

### 2. 更新配置文件

修改配置文件：
```
/home/averyubuntu/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**修改前：**
```json
"context7": {
  "command": "npx",
  "args": [
    "-y",
    "@context-labs/mcp-server-context7"  // ❌ 错误的包名
  ],
  "autoApprove": [
    "get_library_docs"
  ]
}
```

**修改后：**
```json
"context7": {
  "command": "npx",
  "args": [
    "-y",
    "@upstash/context7-mcp"  // ✅ 正确的包名
  ],
  "autoApprove": [
    "get_library_docs"
  ]
}
```

### 3. 使用的修复命令

```bash
sed -i 's/@context-labs\/mcp-server-context7/@upstash\/context7-mcp/g' \
  /home/averyubuntu/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

## 验证修复

修复后，MCP 服务器将能够正确安装和运行 Context7 服务。

### 当前完整的 MCP 配置

系统现在配置了以下 MCP 服务器：

1. **filesystem** - 文件系统操作
2. **github** - GitHub 集成
3. **puppeteer** - 浏览器自动化
4. **context7** - ✅ 已修复，使用 `@upstash/context7-mcp`
5. **fetch** - HTTP 请求
6. **sequential-thinking** - 顺序思考
7. **notion** - Notion 集成

## 相关资源

- npm 包地址: https://www.npmjs.com/package/@upstash/context7-mcp
- Context7 官网: https://context7.dev/

## 修复时间

- 日期: 2025-11-12
- 修复人: Claude (Cline Assistant)

## 注意事项

如果将来遇到类似的 MCP 包找不到的问题：

1. 首先检查包名是否正确
2. 使用 `npm search` 或访问 https://registry.npmjs.org 搜索正确的包名
3. 查看包的文档确认它是否是 MCP 服务器包
4. 更新配置文件并重启 VSCode/Cline

## 故障排除

如果修复后仍有问题：

1. **重启 VSCode**: 关闭并重新打开 VSCode
2. **清除 npm 缓存**: `npm cache clean --force`
3. **手动安装包测试**: `npx -y @upstash/context7-mcp`
4. **检查网络连接**: 确保可以访问 npm 仓库
