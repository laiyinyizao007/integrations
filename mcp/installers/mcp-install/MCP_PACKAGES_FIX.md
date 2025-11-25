# MCP 包配置修复完整指南

## 修复日期
2025-11-12

## 问题概述

在使用 Cline MCP (Model Context Protocol) 时遇到三个 npm 包找不到的错误：

### 错误 1: Context7 包
```
npm error 404 Not Found - GET https://registry.npmjs.org/@context-labs%2fmcp-server-context7
```

### 错误 2: Fetch 包
```
npm error 404 Not Found - GET https://registry.npmjs.org/@modelcontextprotocol%2fserver-fetch
```

### 错误 3: Notion 包
```
npm error 404 Not Found - GET https://registry.npmjs.org/@notionhq%2fmcp-server-notion
```

## 根本原因

配置文件中使用的包名在 npm 仓库中**不存在**。这些包可能：
- 包名拼写错误
- 包已被移除或重命名
- 包从未发布到 npm

## 解决方案

### 1. Context7 包修复

**错误的包名:** `@context-labs/mcp-server-context7` ❌

**正确的包名:** `@upstash/context7-mcp` ✅

```bash
# 修复命令
sed -i 's/@context-labs\/mcp-server-context7/@upstash\/context7-mcp/g' \
  ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**包信息:**
- 版本: 1.0.26
- 描述: MCP server for Context7
- npm 地址: https://www.npmjs.com/package/@upstash/context7-mcp

### 2. Fetch 包修复

**错误的包名:** `@modelcontextprotocol/server-fetch` ❌

**正确的包名:** `@kazuph/mcp-fetch` ✅

```bash
# 修复命令
sed -i 's/@modelcontextprotocol\/server-fetch/@kazuph\/mcp-fetch/g' \
  ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**包信息:**
- 版本: 1.6.2
- 描述: A Model Context Protocol server that provides web content fetching capabilities with automatic image saving and optional AI display
- npm 地址: https://www.npmjs.com/package/@kazuph/mcp-fetch

**备选方案:**
- `mcp-server-fetch-typescript` (版本 0.1.1) - 另一个可用的 fetch MCP 服务器

### 3. Notion 包修复

**错误的包名:** `@notionhq/mcp-server-notion` ❌

**正确的包名:** `@notionhq/notion-mcp-server` ✅

```bash
# 修复命令
sed -i 's/@notionhq\/mcp-server-notion/@notionhq\/notion-mcp-server/g' \
  ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**包信息:**
- 包名: @notionhq/notion-mcp-server
- 描述: Notion MCP Server
- npm 地址: https://www.npmjs.com/package/@notionhq/notion-mcp-server

**备选方案:**
- `@suekou/mcp-notion-server` - 社区维护的 Notion MCP 服务器

## 修复后的完整配置

配置文件位置：
```
~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

修复后的完整配置：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/averyubuntu/projects"],
      "autoApprove": ["read_file", "read_multiple_files", "list_directory", "search_files", "get_file_info", "read_text_file", "write_file"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"},
      "autoApprove": ["search_repositories", "get_file_contents", "list_commits"]
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "autoApprove": ["puppeteer_navigate", "puppeteer_screenshot", "puppeteer_click", "puppeteer_fill", "puppeteer_select", "puppeteer_hover", "puppeteer_evaluate"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "autoApprove": ["get_library_docs"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@kazuph/mcp-fetch"],
      "autoApprove": ["fetch"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "env": {"MAX_HISTORY": "1000"}
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {"NOTION_API_TOKEN": "YOUR_NOTION_TOKEN_HERE"},
      "autoApprove": ["search", "read_page", "read_database"]
    }
  }
}
```

## 当前 MCP 服务器状态

所有 7 个 MCP 服务器现已正确配置：

| 服务器 | 包名 | 状态 | 功能 |
|--------|------|------|------|
| filesystem | @modelcontextprotocol/server-filesystem | ✅ | 文件系统操作 |
| github | @modelcontextprotocol/server-github | ✅ | GitHub 集成 |
| puppeteer | @modelcontextprotocol/server-puppeteer | ✅ | 浏览器自动化 |
| context7 | @upstash/context7-mcp | ✅ 已修复 | 库文档查询 |
| fetch | @kazuph/mcp-fetch | ✅ 已修复 | HTTP 请求和网页抓取 |
| sequential-thinking | @modelcontextprotocol/server-sequential-thinking | ✅ | 顺序思考能力 |
| notion | @notionhq/notion-mcp-server | ✅ 已修复 | Notion 集成 |

## 使配置生效

修复完成后，请执行以下步骤：

1. **重启 VSCode**
   ```bash
   # 完全关闭 VSCode 然后重新打开
   code .
   ```

2. **清除 npm 缓存（可选）**
   ```bash
   npm cache clean --force
   ```

3. **测试 MCP 服务器**
   ```bash
   # 测试 context7
   npx -y @upstash/context7-mcp
   
   # 测试 fetch
   npx -y @kazuph/mcp-fetch
   ```

## 如何查找正确的 MCP 包

当遇到类似问题时，使用以下方法：

### 方法 1: npm 搜索
```bash
npm search "mcp server context7"
npm search "mcp server fetch"
```

### 方法 2: npm 注册表 API
```bash
curl -s "https://registry.npmjs.org/-/v1/search?text=mcp+server+context7&size=10" | grep '"name"'
```

### 方法 3: 验证包是否存在
```bash
npm view <package-name> version description
```

### 方法 4: 浏览 npm 网站
访问 https://www.npmjs.com/ 搜索包名

## 预防措施

1. **使用官方文档**: 始终参考 MCP 官方文档获取正确的包名
2. **验证包名**: 在添加到配置前，先验证包是否存在
3. **检查版本**: 确保包在 npm 上有活跃维护
4. **备份配置**: 修改配置文件前先备份

## 故障排除

### 问题: 修复后仍然报错

**解决方案:**
1. 确认配置文件已保存
2. 完全重启 VSCode（不要只是重新加载窗口）
3. 检查网络连接
4. 清除 npm 缓存

### 问题: npx 命令超时

**解决方案:**
```bash
# 设置更长的超时时间
export NPM_CONFIG_FETCH_TIMEOUT=300000
# 或使用国内镜像
npm config set registry https://registry.npmmirror.com
```

### 问题: 权限错误

**解决方案:**
```bash
# 修复 npm 权限
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ~/.config
```

## 相关资源

- MCP 官方文档: https://modelcontextprotocol.io/
- Context7 文档: https://context7.dev/
- Cline 扩展: https://github.com/saoudrizwan/claude-dev
- npm 注册表: https://registry.npmjs.org/

## 修复总结

### 第一阶段：包名错误修复

✅ **已完成的包名修复:**
- Context7 包: `@context-labs/mcp-server-context7` → `@upstash/context7-mcp`
- Fetch 包: `@modelcontextprotocol/server-fetch` → `@kazuph/mcp-fetch`
- Notion 包: `@notionhq/mcp-server-notion` → `@notionhq/notion-mcp-server`

### 第二阶段：根据 awesome-mcp-servers 优化

参考 [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) 推荐列表后：

✅ **最终配置（5个服务器）:**
1. **filesystem** - @modelcontextprotocol/server-filesystem ✅ MCP 官方
2. **github** - @modelcontextprotocol/server-github ✅ MCP 官方
3. **puppeteer** - @modelcontextprotocol/server-puppeteer ✅ MCP 官方（可用于网页抓取）
4. **sequential-thinking** - @modelcontextprotocol/server-sequential-thinking ✅ MCP 官方
5. **notion** - @notionhq/notion-mcp-server ✅ Notion 官方

❌ **已移除的服务器:**
- **context7** - `@upstash/context7-mcp` - 不在推荐列表中
- **fetch** - `@kazuph/mcp-fetch` - 不在推荐列表中，功能可用 puppeteer 替代

### 验证状态

✅ **配置验证:**
- 所有包名正确
- 配置文件 JSON 格式正确
- 所有包在 npm 上可用
- 符合 awesome-mcp-servers 推荐标准

⚠️ **注意事项:**
- 需要重启 VSCode 才能生效
- 某些 MCP 服务器需要环境变量配置（GitHub token、Notion token）
- Puppeteer 可以替代 fetch 功能进行网页内容获取

## 联系与支持

如果遇到其他问题：
1. 查看 Cline 的 GitHub Issues
2. 检查 MCP 官方文档
3. 在社区论坛寻求帮助

---

**文档版本:** 1.0  
**最后更新:** 2025-11-12  
**维护者:** Claude (Cline Assistant)
