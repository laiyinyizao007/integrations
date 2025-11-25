# GitHub MCP 连接问题诊断报告

> **更新时间**: 2025-11-09  
> **诊断工具**: `/home/averyubuntu/projects/github-mcp-research/src/diagnose-github-mcp.js`

---

## 📋 问题概述

GitHub MCP (Model Context Protocol) 服务器有时会出现连接不稳定的情况，表现为：

- ✅ 某些 API 调用可以成功（如普通仓库搜索）
- ❌ 某些 API 调用失败（如特定用户搜索）
- ⚠️ 连接状态不一致，时好时坏

---

## 🔍 诊断发现

### 1. 配置状态 ✅

**配置文件位置**:
```
~/.vscode-server/data/User/globalStorage/anthropic.claude-code/settings/cline_mcp_settings.json
```

**GitHub MCP 配置**:
```json
{
  "github": {
    "disabled": false,
    "timeout": 60,
    "type": "stdio",
    "command": "/home/averyubuntu/.nvm/versions/node/v24.11.0/bin/npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "PATH": "...",
      "GITHUB_TOKEN": "github_pat_..."
    }
  }
}
```

**状态**: ✅ 配置正常

---

### 2. Token 验证 ✅

**测试结果**:
```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

**响应**:
```json
{
  "login": "laiyinyizao007",
  "id": 43416623,
  "public_repos": 12,
  "followers": 0,
  "following": 3
}
```

**状态**: ✅ Token 有效，用户名为 `laiyinyizao007`

---

### 3. API 限流状态 ✅

**Core API**:
- 限制: 5000 次/小时
- 已使用: 119 次
- 剩余: 4881 次
- 状态: ✅ 正常

**Search API**:
- 限制: 30 次/分钟
- 已使用: 1 次
- 剩余: 29 次
- 状态: ✅ 正常

---

### 4. API 调用测试

#### ✅ 成功的调用

**普通仓库搜索**:
```javascript
// 搜索热门仓库
search_repositories({
  query: "stars:>1000 language:javascript",
  perPage: 3
})
```

**结果**: ✅ 成功返回 7389 个仓库

**用户自己的仓库搜索**:
```bash
curl "https://api.github.com/search/repositories?q=user:laiyinyizao007"
```

**结果**: ✅ 成功返回 53 个仓库

#### ❌ 失败的调用

**错误的用户名搜索**:
```javascript
// 使用不存在的用户名
search_repositories({
  query: "user:averyubuntu",
  perPage: 5
})
```

**错误信息**:
```json
{
  "message": "Validation Failed",
  "errors": [{
    "message": "The listed users and repositories cannot be searched either because the resources do not exist or you do not have permission to view them.",
    "resource": "Search",
    "field": "q",
    "code": "invalid"
  }],
  "status": "422"
}
```

**状态**: ❌ 失败（用户名不存在）

---

## 🎯 根本原因分析

### 主要问题：用户名不匹配

```
期望用户名: averyubuntu
实际用户名: laiyinyizao007
```

#### 为什么会出现这个问题？

1. **系统用户名 ≠ GitHub 用户名**
   - Linux 系统用户: `averyubuntu`
   - GitHub 账户名: `laiyinyizao007`
   - 两者完全不同！

2. **误用系统用户名**
   - 在 MCP 调用中可能使用了系统环境变量中的用户名
   - 实际应该使用 GitHub 账户的真实用户名

3. **搜索权限问题**
   - GitHub Search API 对不存在的用户名返回 422 错误
   - 这不是连接问题，而是参数错误

---

## 🔧 解决方案

### 方案 1: 使用正确的 GitHub 用户名

```javascript
// ❌ 错误方式
search_repositories({ query: "user:averyubuntu" })

// ✅ 正确方式
search_repositories({ query: "user:laiyinyizao007" })
```

### 方案 2: 获取当前用户信息

在搜索前，先获取当前认证用户的信息：

```javascript
// 1. 先获取当前用户
const user = await getCurrentUser();  // 返回 laiyinyizao007

// 2. 再使用正确的用户名搜索
const repos = await search_repositories({
  query: `user:${user.login}`
});
```

### 方案 3: 使用直接的 API 端点

某些操作可以使用更直接的 API，不需要搜索：

```javascript
// ❌ 通过搜索获取用户仓库（容易出错）
search_repositories({ query: "user:averyubuntu" })

// ✅ 直接获取认证用户的仓库
GET /user/repos

// ✅ 获取特定用户的仓库
GET /users/laiyinyizao007/repos
```

---

## 📊 连接问题的其他可能原因

虽然此次主要是用户名问题，但 GitHub MCP 连接不稳定还可能由以下原因造成：

### 1. 网络问题

**症状**:
- 超时错误
- 连接中断
- DNS 解析失败

**解决方法**:
```bash
# 测试网络连接
ping api.github.com

# 测试 HTTPS 连接
curl -I https://api.github.com

# 检查代理设置
echo $http_proxy
echo $https_proxy
```

### 2. Token 过期或权限不足

**症状**:
- 401 Unauthorized
- 403 Forbidden

**解决方法**:
```bash
# 验证 Token
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user

# 检查 Token 权限
# Token 应该有 repo, read:user 等权限
```

**更新 Token**:
1. 访问 https://github.com/settings/tokens
2. 生成新的 Personal Access Token
3. 更新配置文件中的 GITHUB_TOKEN

### 3. API 限流

**症状**:
- 403 Rate limit exceeded
- X-RateLimit-Remaining: 0

**解决方法**:
```bash
# 检查限流状态
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/rate_limit

# 等待重置时间
# 或使用多个 Token 轮换
```

### 4. NPX/Node.js 环境问题

**症状**:
- MCP Server 启动失败
- 命令找不到

**解决方法**:
```bash
# 检查 Node.js
node --version  # 应该 >= v18

# 检查 npx
npx --version

# 检查 PATH
echo $PATH | grep -o "[^:]*node[^:]*"

# 重新安装（如果需要）
npx -y @modelcontextprotocol/server-github
```

### 5. VS Code/Cline 缓存问题

**症状**:
- 配置更新后不生效
- 连接状态异常

**解决方法**:
```bash
# 1. 重启 VS Code
Ctrl+Shift+P -> "Reload Window"

# 2. 清除 MCP 缓存
rm -rf ~/.vscode-server/data/User/globalStorage/anthropic.claude-code/mcp-cache

# 3. 重新加载配置
# 修改配置后，务必重启
```

---

## 🛠️ 诊断工具使用

### 运行诊断脚本

```bash
cd /home/averyubuntu/projects/github-mcp-research
node src/diagnose-github-mcp.js
```

### 诊断内容

脚本会自动检查：

1. ✅ MCP 配置文件是否存在
2. ✅ GitHub MCP 是否启用
3. ✅ GitHub Token 是否配置
4. ✅ Token 格式是否正确
5. ✅ Token 是否有效（调用 /user API）
6. ✅ API 限流状态
7. ✅ Search API 是否工作
8. ✅ Node.js 环境是否正常

### 诊断报告

诊断完成后会生成 JSON 报告：

```
/home/averyubuntu/projects/github-mcp-research/logs/github-mcp-diagnostic.json
```

报告包含：
- 所有检查结果
- 发现的问题
- 严重程度分级
- 修复建议

---

## 📝 最佳实践

### 1. 正确使用用户名

```javascript
// ❌ 不要硬编码用户名
const repos = await search({ query: "user:averyubuntu" });

// ✅ 动态获取用户名
const { login } = await getUser();
const repos = await search({ query: `user:${login}` });
```

### 2. 处理 API 错误

```javascript
try {
  const repos = await search_repositories({ query: "user:xxx" });
} catch (error) {
  if (error.status === 422) {
    console.log('用户名不存在或无权访问');
  } else if (error.status === 403) {
    console.log('API 限流，请稍后重试');
  } else if (error.status === 401) {
    console.log('Token 无效，请更新');
  } else {
    console.log('其他错误:', error.message);
  }
}
```

### 3. 监控 API 限流

```javascript
// 定期检查限流状态
const rateLimit = await checkRateLimit();

if (rateLimit.core.remaining < 100) {
  console.warn('API 调用次数即将耗尽');
}

// 在重置时间前降低调用频率
const resetTime = new Date(rateLimit.core.reset * 1000);
console.log(`限流将在 ${resetTime} 重置`);
```

### 4. 使用合适的 API

```javascript
// 根据需求选择最合适的 API

// 需要搜索多个仓库 → Search API
search_repositories({ query: "stars:>1000" })

// 获取特定用户的仓库 → Repos API
GET /users/:username/repos

// 获取当前用户的仓库 → User Repos API
GET /user/repos

// 获取单个仓库信息 → Repo API
GET /repos/:owner/:repo
```

### 5. 定期维护

- [ ] 每月检查一次 GitHub Token 是否过期
- [ ] 定期运行诊断脚本
- [ ] 监控 API 使用情况
- [ ] 更新 MCP Server 版本

```bash
# 检查更新
npx @modelcontextprotocol/server-github --version

# 强制更新
npx -y @modelcontextprotocol/server-github@latest
```

---

## 🔗 相关资源

### 官方文档

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub Authentication](https://docs.github.com/en/authentication)
- [Rate Limiting](https://docs.github.com/en/rest/rate-limit)
- [Search API](https://docs.github.com/en/rest/search)

### MCP 相关

- [Model Context Protocol](https://github.com/modelcontextprotocol)
- [MCP Server GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [Cline Documentation](https://github.com/cline/cline)

### 诊断工具

- 诊断脚本: `/home/averyubuntu/projects/github-mcp-research/src/diagnose-github-mcp.js`
- 配置文件: `~/.vscode-server/data/User/globalStorage/anthropic.claude-code/settings/cline_mcp_settings.json`

---

## 📌 快速故障排查清单

当遇到 GitHub MCP 连接问题时，按以下顺序检查：

### 第1步：基础检查
- [ ] GitHub Token 是否配置？
- [ ] Token 是否有效？（运行 `curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user`）
- [ ] 网络是否正常？（`ping api.github.com`）

### 第2步：配置检查
- [ ] MCP 配置文件是否存在？
- [ ] GitHub MCP 是否被禁用？（`"disabled": false`）
- [ ] npx 路径是否正确？
- [ ] 环境变量是否正确？

### 第3步：API 检查
- [ ] API 限流状态如何？（运行诊断脚本）
- [ ] 使用的 API 端点是否正确？
- [ ] 参数是否有效？（特别是用户名）

### 第4步：环境检查
- [ ] Node.js 版本是否 >= 18？
- [ ] npx 是否可用？
- [ ] VS Code 是否需要重启？

### 第5步：运行诊断
```bash
cd /home/averyubuntu/projects/github-mcp-research
node src/diagnose-github-mcp.js
```

### 第6步：查看日志
- MCP Server 日志
- VS Code 开发者工具控制台
- Cline 输出面板

---

## 🎓 经验总结

### 关键教训

1. **系统用户名 ≠ GitHub 用户名**
   - 不要假设它们相同
   - 始终验证实际的 GitHub 用户名

2. **错误码很重要**
   - 422 = 参数错误（如用户名不存在）
   - 401 = 认证失败（Token 问题）
   - 403 = 权限/限流问题
   - 404 = 资源不存在

3. **连接不稳定 ≠ 配置错误**
   - 有时是使用方式的问题
   - 有时是参数不正确
   - 真正的连接问题较少见

4. **诊断工具很有价值**
   - 自动化检查节省时间
   - 系统化诊断避免遗漏
   - 日志记录便于追踪

### 预防措施

1. 在代码中避免硬编码用户名
2. 使用前验证 Token 有效性
3. 合理处理 API 错误
4. 监控 API 使用量
5. 定期运行诊断脚本

---

## 📞 获取帮助

如果问题仍未解决：

1. **运行诊断脚本** 并查看报告
2. **检查 VS Code 开发者工具** (Ctrl+Shift+I) 的控制台
3. **查看 GitHub API 状态** https://www.githubstatus.com/
4. **更新 MCP Server** 到最新版本
5. **提交 Issue** 到相关项目仓库

---

**文档版本**: 1.0  
**最后更新**: 2025-11-09  
**维护者**: AI Assistant
