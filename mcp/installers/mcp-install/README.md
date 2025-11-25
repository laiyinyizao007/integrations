# MCP Servers 安装配置

这个目录包含Linux环境下MCP Servers的安装和配置脚本。

## 🔐 环境变量配置（重要！）

为了安全起见，本项目使用环境变量来管理敏感的API tokens，**不再硬编码到脚本中**。

### 首次配置步骤

1. **复制环境变量模板**
   ```bash
   cd /home/averyubuntu/projects/mcp-install
   cp .env.example .env
   ```

2. **编辑.env文件，填入真实的tokens**
   ```bash
   nano .env
   # 或使用你喜欢的编辑器
   ```

3. **填入以下tokens**：
   - `GITHUB_TOKEN`: 从 https://github.com/settings/tokens 获取
   - `NOTION_TOKEN`: 从 https://www.notion.so/my-integrations 获取

4. **保存并运行安装脚本**
   ```bash
   ./setup-mcp-linux.sh
   ```

### 安全注意事项

✅ **DO（应该做的）**：
- ✅ `.env`文件已在`.gitignore`中，不会被提交
- ✅ 始终使用环境变量引用tokens
- ✅ 定期更新和轮换tokens
- ✅ 不要分享.env文件

❌ **DON'T（不要做的）**：
- ❌ 永远不要提交.env文件到Git
- ❌ 不要在代码中硬编码tokens
- ❌ 不要在公开场合分享tokens

## 📦 安装内容

脚本会自动安装和配置以下MCP Servers：

1. **Filesystem** - 文件系统操作
2. **GitHub** - GitHub集成（使用GITHUB_TOKEN）
3. **Puppeteer** - 浏览器自动化
4. **Context7** - 库文档查询
5. **Fetch** - 网页内容获取
6. **Sequential Thinking** - 思维链增强
7. **Notion** - Notion集成（使用NOTION_TOKEN）

## 🚀 使用方法

### 全新安装
```bash
cd /home/averyubuntu/projects/mcp-install
cp .env.example .env
# 编辑.env填入真实tokens
./setup-mcp-linux.sh
```

### 更新配置
如果需要更新tokens：
```bash
cd /home/averyubuntu/projects/mcp-install
nano .env  # 更新tokens
./setup-mcp-linux.sh  # 重新运行安装脚本
```

## 📝 相关文件

- `setup-mcp-linux.sh` - 主安装脚本
- `.env.example` - 环境变量模板（可以提交到Git）
- `.env` - 实际的环境变量文件（**不要提交到Git**）
- `README.md` - 本文档

## 🔍 故障排查

### 错误：未找到 .env 文件
```
错误: 未找到 .env 文件
```
**解决方案**: 运行 `cp .env.example .env` 并填入真实tokens

### 错误：环境变量未正确配置
```
错误: 以下环境变量未正确配置:
  ✗ GITHUB_TOKEN
```
**解决方案**: 编辑 `.env` 文件，确保填入的是真实的token，而不是 `your_github_token_here`

## 📚 更多信息

- GitHub Token权限要求：`repo`, `read:user`
- Notion Token权限要求：`Read content`, `Update content`, `Insert content`
- 配置文件位置：`~/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

## 🔄 更新日志

- **2025-11-09**: 改为环境变量管理，移除硬编码tokens
- 增加安全性和灵活性
- 添加完整的配置指南
