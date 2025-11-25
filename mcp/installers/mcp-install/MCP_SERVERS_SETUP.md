# MCP Servers 配置说明

## ✅ 已配置的 MCP Servers

以下 MCP servers 已成功配置到 Cline：

### 1. **Filesystem Server**
- **功能**: 文件系统操作
- **访问路径**: `/home/averyubuntu/projects`
- **权限**: 读取、写入、创建目录、搜索文件等
- **用途**: 管理项目文件

### 2. **GitHub Server**
- **功能**: GitHub 仓库管理
- **已配置**: GitHub Personal Access Token
- **权限**: 创建/更新文件、仓库管理、Issue/PR 管理等
- **用途**: 直接与 GitHub 交互

### 3. **Puppeteer Server**
- **功能**: 浏览器自动化
- **权限**: 导航、截图、点击、填充表单等
- **用途**: Web 自动化测试和交互

### 4. **Context7 Server**
- **功能**: 库文档查询
- **权限**: 解析库 ID、获取文档
- **用途**: 快速查询开发库文档

### 5. **Fetch Server**
- **功能**: 网页内容获取
- **权限**: 获取 HTML、JSON、文本、Markdown
- **用途**: 抓取网页内容

### 6. **Sequential Thinking Server**
- **功能**: 思维链工具
- **配置**: 最大历史 1000 条
- **用途**: 增强推理能力

### 7. **Notion Server**
- **功能**: Notion 集成
- **已配置**: Notion Integration Token
- **权限**: 页面、数据库、块、评论等完整操作
- **用途**: 管理 Notion 内容

## 📝 配置文件位置

```
/home/averyubuntu/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

## 🔧 Linux 系统调整

相比 Windows 配置，已做以下调整：

1. **文件系统路径**: `C:/Dev` → `/home/averyubuntu/projects`
2. **命令执行**: 使用 Linux 兼容的 `npx` 命令
3. **环境变量**: 保持原有的 Token 配置

## 🚀 如何使用

### 重启 Cline
配置文件已更新，需要重启 Cline 以加载新的 MCP servers：
1. 在 VS Code 中按 `Ctrl+Shift+P`
2. 输入 "Reload Window" 并执行
3. 或者关闭并重新打开 VS Code

### 验证安装
重启后，Cline 会自动通过 `npx` 下载和运行这些 MCP servers。首次使用时：
- `npx` 会自动下载所需的包
- 这些包会被缓存，后续使用会更快
- 无需手动安装

### 使用示例

#### 文件操作
```
帮我在 /home/averyubuntu/projects 中创建一个新项目
```

#### GitHub 操作
```
帮我在 GitHub 上创建一个新仓库
搜索我的 GitHub 仓库
```

#### 网页抓取
```
帮我获取 https://example.com 的内容
```

#### Notion 操作
```
帮我在 Notion 中创建一个新页面
查询我的 Notion 数据库
```

## ⚠️ 注意事项

### 1. API Token 安全
- ✅ GitHub Token 已配置
- ✅ Notion Token 已配置
- ⚠️ 这些是敏感信息，不要分享配置文件

### 2. 权限说明
- `autoApprove`: 列出的操作会自动批准，无需每次确认
- 可根据需要调整自动批准的操作列表

### 3. 文件系统访问
- Filesystem server 只能访问 `/home/averyubuntu/projects`
- 如需访问其他目录，可在配置中添加

### 4. Puppeteer 注意事项
- 在 WSL 环境中，Puppeteer 可能需要额外的依赖
- 如遇到问题，可能需要安装浏览器依赖：
  ```bash
  sudo apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2
  ```

## 🔄 更新配置

如需修改配置，编辑文件：
```bash
nano ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

或者在 VS Code 中直接编辑该文件。

## 📚 MCP Server 文档

- [MCP GitHub Repository](https://github.com/modelcontextprotocol)
- [Filesystem Server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [GitHub Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [Puppeteer Server](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)

## ✅ 配置完成

所有 MCP servers 已成功配置！重启 Cline 后即可开始使用。

---

**配置时间**: 2025-01-07 01:30  
**系统**: Linux (WSL)  
**Cline 版本**: Latest
