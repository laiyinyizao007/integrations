# Cline MCP 服务器配置完成指南

## ✅ 已配置的 MCP 服务器

我已经为你配置了以下 7 个 MCP 服务器到 Cline：

### 1. **Filesystem Server** 📁
- **功能**: 文件系统操作
- **访问路径**: `/home/averyubuntu/projects`
- **自动批准**: 读取文件、列出目录、搜索文件、获取文件信息
- **用途**: 管理项目文件和目录
- **状态**: ✅ 立即可用

### 2. **GitHub Server** 🐙
- **功能**: GitHub 仓库管理
- **需要配置**: GitHub Personal Access Token
- **自动批准**: 搜索仓库、获取文件内容、列出提交
- **用途**: 直接与 GitHub 交互（创建仓库、管理 Issues/PRs 等）
- **状态**: ⚠️ 需要配置 Token

### 3. **Puppeteer Server** 🌐
- **功能**: 浏览器自动化
- **自动批准**: 导航、截图、点击、填充表单等所有操作
- **用途**: Web 自动化测试和交互
- **状态**: ✅ 立即可用

### 4. **Context7 Server** 📚
- **功能**: 库文档查询
- **自动批准**: 获取库文档
- **用途**: 快速查询开发库文档
- **状态**: ✅ 立即可用

### 5. **Fetch Server** 🔍
- **功能**: 网页内容获取
- **自动批准**: 获取网页内容
- **用途**: 抓取网页 HTML、JSON、文本、Markdown
- **状态**: ✅ 立即可用

### 6. **Sequential Thinking Server** 🧠
- **功能**: 思维链工具
- **配置**: 最大历史 1000 条
- **用途**: 增强推理能力
- **状态**: ✅ 立即可用

### 7. **Notion Server** 📝
- **功能**: Notion 集成
- **需要配置**: Notion Integration Token
- **自动批准**: 搜索、读取页面、读取数据库
- **用途**: 管理 Notion 内容（页面、数据库、块、评论等）
- **状态**: ⚠️ 需要配置 Token

## 📝 配置文件位置

```bash
~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

## 🔧 下一步：配置 API Tokens（可选）

### 配置 GitHub Token

如果你想使用 GitHub 功能，需要配置 Personal Access Token：

1. **获取 Token**:
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token" -> "Generate new token (classic)"
   - 选择权限: `repo`, `read:user`
   - 生成并复制 token

2. **更新配置文件**:
   ```bash
   nano ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
   ```
   
   找到 `"GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"`，替换为你的实际 token。

### 配置 Notion Token

如果你想使用 Notion 功能，需要配置 Integration Token：

1. **获取 Token**:
   - 访问 https://www.notion.so/my-integrations
   - 点击 "+ New integration"
   - 填写名称，选择权限（Read content, Update content, Insert content）
   - 创建后复制 "Internal Integration Token"

2. **更新配置文件**:
   ```bash
   nano ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
   ```
   
   找到 `"NOTION_API_TOKEN": "YOUR_NOTION_TOKEN_HERE"`，替换为你的实际 token。

3. **在 Notion 中授权**:
   - 打开你想要访问的 Notion 页面或数据库
   - 点击右上角 "..." -> "Add connections"
   - 选择你刚创建的 integration

## 🚀 如何使用

### 步骤 1: 重启 VS Code

配置文件已更新，需要重新加载 VS Code 窗口：

**方法 1**: 使用命令面板
```
1. 按 Ctrl+Shift+P
2. 输入 "Reload Window"
3. 按回车执行
```

**方法 2**: 直接重启 VS Code
```
关闭并重新打开 VS Code
```

### 步骤 2: 验证 MCP 服务器

重启后，在 Cline 扩展中：
1. 点击顶部的齿轮图标或 MCP 图标
2. 查看 "MCP Servers" 部分
3. 你应该看到 7 个已配置的服务器

### 步骤 3: 开始使用

现在你可以在 Cline 中使用这些功能了！

#### 文件操作示例
```
帮我在 projects 目录中创建一个新的项目文件夹
列出 telegram-AIworkHorse 目录下的所有文件
```

#### GitHub 操作示例
```
搜索我的 GitHub 仓库
帮我在 GitHub 上创建一个新仓库
查看某个仓库的最新提交
```

#### 网页抓取示例
```
帮我获取 https://example.com 的内容
抓取这个网页的所有链接
```

#### Notion 操作示例
```
在 Notion 中搜索关于 "项目管理" 的页面
读取我的 Notion 数据库
```

#### 浏览器自动化示例
```
打开浏览器访问 https://example.com 并截图
自动填写这个表单
```

## 📊 MCP 服务器运行方式

所有 MCP 服务器都使用 `npx -y` 方式运行：
- **优点**: 无需手动安装，npx 会自动下载和管理包
- **首次运行**: npx 会下载所需的包（可能需要几秒钟）
- **后续运行**: 使用缓存的包，速度很快
- **自动更新**: npx 会使用最新版本

## ⚠️ 注意事项

### 安全性
- ✅ GitHub 和 Notion tokens 是敏感信息
- ✅ 配置文件在 `.vscode-server` 目录中，不会被 Git 跟踪
- ⚠️ 不要分享配置文件或将其提交到版本控制

### 权限说明
- `autoApprove`: 列出的操作会自动批准，无需每次确认
- 其他操作会在执行前询问你的批准
- 你可以根据需要调整自动批准的操作列表

### 文件系统访问
- Filesystem server 只能访问 `/home/averyubuntu/projects`
- 这是出于安全考虑的限制
- 如需访问其他目录，可在配置中添加路径

### Puppeteer 依赖
在 WSL/Linux 环境中，如果 Puppeteer 出现问题，可能需要安装浏览器依赖：

```bash
sudo apt-get update
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

## 🔄 修改配置

如需修改配置，直接编辑配置文件：

```bash
# 使用 nano
nano ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json

# 或在 VS Code 中打开
code ~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

修改后需要重新加载 VS Code 窗口。

## 📚 相关文档

- [MCP 官方网站](https://modelcontextprotocol.io)
- [MCP GitHub](https://github.com/modelcontextprotocol)
- [Filesystem Server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [GitHub Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [Puppeteer Server](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)

## 🐛 故障排查

### MCP 服务器未显示
1. 检查配置文件格式是否正确（JSON 格式）
2. 重新加载 VS Code 窗口
3. 查看 Cline 的输出日志

### GitHub/Notion 功能不工作
1. 检查 token 是否正确配置
2. 确认 token 有正确的权限
3. 对于 Notion，确认已在 Notion 中授权 integration

### Puppeteer 启动失败
1. 检查是否安装了必要的系统依赖（见上文）
2. 在 WSL 中可能需要额外配置

### npx 下载缓慢
1. 首次运行时 npx 会下载包，请耐心等待
2. 可以配置 npm 使用国内镜像：
   ```bash
   npm config set registry https://registry.npmmirror.com
   ```

## ✨ 总结

**已完成**:
- ✅ 配置了 7 个 MCP 服务器
- ✅ 设置了合理的自动批准权限
- ✅ 配置文件已就绪

**下一步**:
1. 重启 VS Code 窗口 (Ctrl+Shift+P -> Reload Window)
2. （可选）配置 GitHub 和 Notion tokens
3. 开始在 Cline 中使用这些强大的功能！

---

**配置时间**: 2025-11-12  
**配置版本**: v1.0  
**系统**: Linux (WSL)  
**配置位置**: `~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
