# GitHub MCP Research

一个用于研究和测试 GitHub Model Context Protocol (MCP) 连接的项目。

## 📋 项目概述

本项目旨在探索和测试通过 Model Context Protocol (MCP) 与 GitHub API 进行交互的可能性。它提供了一个完整的框架来研究 GitHub MCP 工具的功能、性能和使用模式。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行基本测试

```bash
# 运行基本连接测试
node src/index.js --basic

# 运行全面研究测试
node src/index.js --research
```

### 运行单元测试

```bash
npm test
```

## 🏗️ 项目结构

```
github-mcp-research/
├── src/
│   ├── index.js                 # 主入口文件
│   ├── client/
│   │   └── github-mcp-client.js # GitHub MCP 客户端
│   ├── repositories/            # 仓库相关功能
│   ├── issues/                  # Issue 相关功能
│   ├── pull-requests/           # Pull Request 相关功能
│   ├── files/                   # 文件操作功能
│   └── search/                  # 搜索功能
├── tests/                       # 测试文件
├── examples/                    # 使用示例
└── docs/                        # 文档
```

## 🔧 可用功能

### GitHub MCP 工具

本项目封装了以下 GitHub MCP 工具：

- **仓库管理**: `search_repositories`, `get_file_contents`, `create_or_update_file`, `push_files`
- **Issue 管理**: `create_issue`, `list_issues`, `update_issue`, `add_issue_comment`
- **Pull Request 管理**: `create_pull_request`, `list_pull_requests`, `create_pull_request_review`, `merge_pull_request`
- **分支管理**: `fork_repository`, `create_branch`
- **搜索功能**: `search_code`, `search_issues`, `search_users`
- **其他工具**: `list_commits`, `get_pull_request_files`, 等

### 核心类

#### `GitHubMCPClient`

主要客户端类，提供对 GitHub MCP 工具的高级封装：

```javascript
const { GitHubMCPClient } = require('./src/client/github-mcp-client');

const client = new GitHubMCPClient();
await client.initialize();

// 搜索仓库
const repos = await client.searchRepositories('cline');

// 创建 Issue
const issue = await client.createIssue('owner', 'repo', '标题', '内容');

// 创建 Pull Request
const pr = await client.createPullRequest('owner', 'repo', '标题', 'feature-branch', 'main', '描述');
```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npx jest tests/basic.test.js

# 运行测试并生成覆盖率报告
npx jest --coverage
```

### 测试覆盖范围

- ✅ 客户端初始化
- ✅ 工具可用性检查
- ✅ 仓库搜索（模拟）
- ✅ 用户信息获取（模拟）
- ✅ Issue 创建（模拟）
- ✅ Pull Request 创建（模拟）

## 📚 使用示例

查看 `examples/` 目录中的示例文件：

- `examples/search-repositories.js` - 仓库搜索示例
- `examples/create-issue.js` - 创建 Issue 示例
- `examples/manage-pull-requests.js` - Pull Request 管理示例

## 🔍 研究目标

本项目的主要研究目标包括：

1. **连接稳定性**: 测试 MCP 连接的稳定性和可靠性
2. **性能分析**: 评估不同操作的响应时间和资源使用
3. **功能完整性**: 验证所有 GitHub API 功能的 MCP 实现
4. **错误处理**: 测试各种错误情况下的处理机制
5. **最佳实践**: 总结使用 GitHub MCP 工具的最佳实践

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

ISC License

## 🔗 MCP 工具使用演示

由于这个项目运行在 Node.js 环境中，而 MCP 工具需要在 Cline 环境中调用，我们提供了以下使用方式：

### 方式1: 在 Cline 中直接使用 MCP 工具

```javascript
// 在 Cline 中，你可以直接使用 MCP 工具
// 搜索仓库
const repos = await use_mcp_tool({
  server_name: "github",
  tool_name: "search_repositories",
  arguments: { query: "cline" }
});

// 创建 Issue
const issue = await use_mcp_tool({
  server_name: "github",
  tool_name: "create_issue",
  arguments: {
    owner: "your-username",
    repo: "your-repo",
    title: "Test Issue",
    body: "This is a test issue"
  }
});
```

### 方式2: 使用项目中的客户端类（模拟模式）

```javascript
const { GitHubMCPClient } = require('./src/client/github-mcp-client');

const client = new GitHubMCPClient();
await client.initialize();

// 搜索仓库（当前使用模拟数据）
const repos = await client.searchRepositories('cline');
```

### 方式3: 集成到实际项目

将 MCP 工具调用集成到你的实际项目中：

```javascript
// 在你的项目中使用 MCP 工具
async function searchGitHubRepos(query) {
  return await use_mcp_tool({
    server_name: "github",
    tool_name: "search_repositories",
    arguments: { query }
  });
}
```

## ⚠️ 注意事项

- MCP 工具只能在 Cline 环境中调用，不能在独立的 Node.js 应用中使用
- 确保你的 Cline 配置中包含 GitHub MCP 服务器
- 请遵守 GitHub API 的使用限制和条款
- 生产环境使用前请确保正确配置 GITHUB_TOKEN
