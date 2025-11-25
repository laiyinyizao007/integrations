# n8n学习与实践项目

> 全面学习n8n工作流自动化平台的实践项目

## 🎯 项目目标

通过实际案例和系统化学习，掌握n8n工作流自动化平台的完整使用方法，包括：

- ✅ **本地部署** - Averivendell_n8n环境配置和使用
- ✅ **云端部署** - Hugging Face Spaces集成
- ✅ **VSCode集成** - n8n-vscode-connector扩展使用
- ✅ **工作流开发** - 从基础到高级的工作流设计
- ✅ **实际应用** - 真实场景的工作流解决方案

## 📁 项目结构

```
n8n-learning-project/
├── workflows/           # 工作流文件和配置
│   ├── basics/         # 基础工作流示例
│   ├── integrations/   # 第三方服务集成
│   ├── automation/     # 自动化场景
│   └── advanced/       # 高级功能演示
├── examples/           # 代码示例和脚本
│   ├── api-integration/ # API集成示例
│   ├── data-processing/ # 数据处理示例
│   ├── telegram-bot/    # Telegram机器人
│   └── vscode-extension/ # VSCode扩展使用
├── docs/              # 文档和指南
│   ├── getting-started.md    # 快速开始
│   ├── workflow-guide.md     # 工作流指南
│   ├── best-practices.md     # 最佳实践
│   └── troubleshooting.md    # 故障排除
└── scripts/           # 工具脚本
    ├── setup.sh          # 环境设置
    ├── deploy.sh         # 部署脚本
    └── test-workflows.sh # 工作流测试
```

## 🚀 快速开始

### 1. 环境准备

确保您已安装并配置好以下工具：

- **Averivendell_n8n** - 本地n8n环境
- **n8n-vscode-connector** - VSCode扩展
- **Docker & Docker Compose** - 容器化部署

### 2. 启动本地环境

```bash
# 启动本地n8n实例
cd ../Averivendell_n8n
./start.sh

# 在VSCode中打开预览
# 打开 n8n-preview.html → 右键 → Open with Live Server
```

### 3. 导入示例工作流

```bash
# 导入基础工作流
cd n8n-learning-project
./scripts/import-workflows.sh
```

### 4. 开始学习

按照以下顺序学习：

1. **[基础工作流](docs/getting-started.md)** - 了解n8n基本概念
2. **[VSCode集成](examples/vscode-extension/)** - 掌握VSCode扩展使用
3. **[实际案例](workflows/)** - 学习具体应用场景
4. **[高级功能](docs/workflow-guide.md)** - 深入工作流设计

## 📚 学习路径

### 🟢 阶段1：基础入门 (1-2天)

**目标**：掌握n8n基本概念和工作流创建

**学习内容**：
- [x] n8n界面和基本操作
- [x] 节点类型和连接方式
- [x] 简单工作流创建和测试
- [x] VSCode扩展安装和配置

**实践项目**：
- 创建"Hello World"工作流
- 构建简单的HTTP API调用
- 设置定时任务

### 🟡 阶段2：核心功能 (3-5天)

**目标**：掌握工作流设计和数据处理

**学习内容**：
- [ ] 数据流和转换
- [ ] 条件判断和循环
- [ ] 错误处理机制
- [ ] 工作流变量和环境配置

**实践项目**：
- API数据获取和处理
- 条件分支工作流
- 错误重试机制

### 🟠 阶段3：集成应用 (1周)

**目标**：掌握第三方服务集成

**学习内容**：
- [ ] REST API集成
- [ ] 数据库操作
- [ ] 消息服务集成 (Telegram, Slack等)
- [ ] 文件处理和存储

**实践项目**：
- Telegram机器人开发
- 自动化报告生成
- 多服务数据同步

### 🔴 阶段4：高级特性 (2周+)

**目标**：掌握高级工作流设计和部署

**学习内容**：
- [ ] 复杂工作流架构
- [ ] 自定义节点开发
- [ ] 性能优化
- [ ] 云端部署和监控

**实践项目**：
- 企业级工作流系统
- 多租户应用
- 高可用部署方案

## 🛠️ 核心工具使用指南

### Averivendell_n8n (本地开发环境)

**何时使用**：
- 工作流开发和测试
- 需要完整功能支持
- 处理敏感数据
- 高性能需求

**使用方法**：
```bash
# 启动服务
cd ../Averivendell_n8n
docker compose up -d

# 访问地址
open http://localhost:5678

# 用户名: admin
# 密码: avery_n8n_2025
```

### n8n-vscode-connector (VSCode扩展)

**何时使用**：
- 远程管理云端n8n实例
- 从VSCode直接执行工作流
- 监控工作流状态
- 团队协作

**配置方法**：
```bash
# 1. 安装扩展
cd ../n8n-vscode-connector
npm run compile
code --install-extension n8n-vscode-connector-1.0.0.vsix

# 2. 配置连接
cp .env.example .env
# 编辑 N8N_BASE_URL 和 N8N_API_KEY
```

**常用命令**：
- `n8n: Connect to Instance` - 连接n8n实例
- `n8n: List Workflows` - 浏览工作流
- `n8n: Execute Workflow` - 执行工作流
- `n8n: View Workflow Details` - 查看详情

## 📋 示例工作流

### 1. 基础示例

#### HTTP API调用
```json
{
  "name": "HTTP API Demo",
  "nodes": [
    {
      "name": "Start",
      "type": "n8n-nodes-base.start"
    },
    {
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.github.com/user",
        "method": "GET"
      }
    }
  ],
  "connections": {
    "Start": {
      "main": [
        {
          "node": "HTTP Request",
          "type": "main",
          "index": 0
        }
      ]
    }
  }
}
```

#### Telegram机器人
```json
{
  "name": "Telegram Bot Demo",
  "nodes": [
    {
      "name": "Telegram Trigger",
      "type": "n8n-nodes-base.telegram",
      "parameters": {
        "mode": "webhook",
        "botToken": "{{$node[\"Telegram Credential\"].json[\"botToken\"]}}"
      }
    },
    {
      "name": "Message Handler",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "return { message: 'Hello! You said: ' + $input.item.json.text }"
      }
    },
    {
      "name": "Send Message",
      "type": "n8n-nodes-base.telegram",
      "parameters": {
        "mode": "sendMessage",
        "botToken": "{{$node[\"Telegram Credential\"].json[\"botToken\"]}}",
        "chatId": "{{$input.item.json.chat.id}}",
        "text": "{{$input.item.json.message}}"
      }
    }
  ]
}
```

### 2. 高级示例

#### 数据处理流水线
- API数据获取 → 数据清洗 → 存储到数据库 → 发送通知

#### 自动化报告生成
- 定时触发 → 收集数据 → 生成图表 → 发送邮件报告

#### 多服务集成
- GitHub Webhook → 触发CI/CD → 更新状态 → 通知团队

## 🔧 开发环境配置

### VSCode推荐扩展

```json
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-typescript-next",
    "ritwickdey.liveserver",
    "ms-vscode-remote.remote-containers"
  ]
}
```

### 环境变量模板

```bash
# .env 文件
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your-api-key-here
TELEGRAM_BOT_TOKEN=your-bot-token
GITHUB_TOKEN=your-github-token
```

## 📊 学习进度跟踪

使用以下清单跟踪您的学习进度：

### 基础知识
- [ ] n8n界面和基本操作
- [ ] 节点类型和工作流创建
- [ ] 数据流和变量使用
- [ ] 错误处理和调试

### 核心功能
- [ ] HTTP请求和API集成
- [ ] 数据转换和处理
- [ ] 条件判断和循环
- [ ] 定时任务和触发器

### 高级特性
- [ ] 自定义节点开发
- [ ] 复杂工作流设计
- [ ] 性能优化
- [ ] 云端部署

### 实际应用
- [ ] Telegram机器人开发
- [ ] 自动化数据处理
- [ ] 多服务集成
- [ ] 企业级工作流

## 🤝 贡献指南

欢迎提交工作流示例、改进文档或报告问题！

### 提交工作流
1. 在 `workflows/` 下创建相应目录
2. 提供完整的JSON配置文件
3. 编写详细的使用说明
4. 测试工作流功能

### 改进文档
1. 更新 `docs/` 中的相关文件
2. 保持文档结构清晰
3. 添加实际使用示例

## 📞 支持和帮助

### 常见问题

**Q: 本地n8n无法启动？**
A: 检查Docker是否运行，端口5678是否被占用

**Q: VSCode扩展无法连接？**
A: 确认n8n实例正在运行，检查API密钥配置

**Q: 工作流执行失败？**
A: 查看n8n日志，检查节点配置和数据格式

### 获取帮助

1. 查看项目文档：`docs/`
2. 检查现有示例：`workflows/` 和 `examples/`
3. 提交Issue描述问题

## 📈 项目状态

- **创建时间**: 2025-11-11
- **维护者**: AI Assistant
- **版本**: v1.0.0
- **状态**: 开发中

---

**开始您的n8n学习之旅吧！** 🚀

从基础工作流开始，逐步掌握这个强大的自动化平台。通过实际项目练习，您将能够构建复杂的自动化解决方案。
