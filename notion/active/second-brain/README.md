# Notion 第二大脑系统 🧠

一个基于 Notion 的 AI 增强型个人知识管理系统，帮助你构建自己的第二大脑。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini-blue)](https://ai.google.dev/)

## ✨ 特性

### 核心功能
- **🎯 PARA 方法**：结构化的知识分类体系（Projects、Areas、Resources、Archives）
- **🔗 双向链接**：建立知识网络，形成思维图谱
- **📝 模板系统**：预设多种笔记模板（每日笔记、会议记录、读书笔记等）
- **🔄 自动化工作流**：定时任务、自动归档、数据备份

### 🤖 AI 增强功能（NEW!）
- **💡 每日智能总结**：AI 导师视角分析你的思考模式和行动轨迹
- **🔍 笔记智能聚合**：自动合并相关话题，生成精炼版笔记
- **✅ 任务自动提取**：从笔记中识别待办事项，自动创建任务
- **📊 优先级分析**：基于艾森豪威尔矩阵的智能任务规划
- **🏷️ 自动标签生成**：AI 理解内容并推荐合适的标签

## 🚀 快速开始

### 1. 安装依赖

```bash
git clone https://github.com/yourusername/notion-second-brain.git
cd notion-second-brain
npm install
```

### 2. 配置 API

#### Notion API
1. 访问 [Notion Integrations](https://www.notion.so/my-integrations)
2. 创建新的 Integration，获取 API Token
3. 在 Notion 中创建根页面，并授权 Integration 访问

#### Gemini AI API（可选，启用 AI 功能）
1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 创建 API Key

#### 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# Notion API
NOTION_API_TOKEN=secret_your_notion_api_token_here

# Gemini AI API（可选）
GEMINI_API_KEY=your_gemini_api_key_here
AI_ENABLED=true

# 其他配置
TIMEZONE=Asia/Shanghai
```

### 3. 初始化 Notion Workspace

```bash
npm run setup
```

这将自动创建：
- ✅ PARA 四大分类页面
- ✅ 核心数据库（Notes、Projects、Areas、Resources、Archives、Inbox、Daily Notes）
- ✅ 仪表盘
- ✅ 基础模板

## 📖 使用指南

### 基础功能

#### 创建每日笔记
```bash
npm run daily-note
```

#### 查看统计
```bash
npm run stats
```

#### 自动归档
```bash
npm run auto-archive
```

#### 数据备份
```bash
npm run backup
```

### 🤖 AI 功能

#### 完整 AI 工作流（推荐）
运行完整的 AI 增强流程：每日总结 → 笔记聚合 → 任务提取 → 优先级分析

```bash
npm run ai:workflow
```

#### 单独运行 AI 功能

**生成每日总结**
```bash
npm run ai:daily-summary
```
AI 会分析你今日的所有笔记，生成：
- 今日总结
- 核心主题
- 思考模式分析
- 主要亮点与盲点
- 行动建议
- 哲理金句

**处理 Inbox**
```bash
npm run ai:process-inbox
```
AI 会自动：
- 合并相关话题的笔记
- 生成精炼版内容
- 添加智能标签
- 更新处理状态

**提取任务**
```bash
npm run ai:extract-tasks
```
AI 会扫描笔记，识别：
- 明确的待办事项
- 项目规划
- 调研需求
- 并自动创建任务

#### 启动自动化（包含 AI）
```bash
npm run automation
```

## 📁 项目结构

```
notion-second-brain/
├── docs/                        # 文档目录
│   ├── PRD.md                  # 产品需求文档
│   ├── setup-guide.md          # 详细设置指南
│   ├── workflow-analysis.md    # 工作流分析
│   └── ai-workflow-integration.md  # AI 集成方案
│
├── config/                      # 配置文件
│   ├── para.json               # PARA 结构定义
│   ├── templates.json          # 模板配置
│   └── ai-config.json          # AI 配置
│
├── prompts/                     # AI Prompt 模板
│   ├── daily-summary.txt       # 每日总结 Prompt
│   ├── note-aggregation.txt    # 笔记聚合 Prompt
│   ├── task-extraction.txt     # 任务提取 Prompt
│   └── task-analysis.txt       # 任务分析 Prompt
│
├── scripts/                     # 可执行脚本
│   ├── setup.js                # 初始化向导
│   ├── daily-note.js           # 每日笔记
│   ├── auto-archive.js         # 自动归档
│   ├── backup.js               # 数据备份
│   ├── stats.js                # 统计报告
│   ├── automation.js           # 自动化任务
│   ├── ai-workflow.js          # AI 完整工作流
│   ├── ai-daily-summary.js     # AI 每日总结
│   ├── ai-process-inbox.js     # AI 处理 Inbox
│   └── ai-extract-tasks.js     # AI 任务提取
│
└── src/                         # 源代码
    ├── api/                     # API 封装
    │   └── notion-client.js    # Notion API 客户端
    ├── ai/                      # AI 模块
    │   ├── ai-client.js        # AI 客户端封装
    │   ├── daily-summary-ai.js # 每日总结 AI
    │   ├── note-aggregation-ai.js  # 笔记聚合 AI
    │   ├── task-extraction-ai.js   # 任务提取 AI
    │   └── task-analyzer-ai.js     # 任务分析 AI
    ├── automation/              # 自动化逻辑
    ├── templates/               # 模板管理
    └── utils/                   # 工具函数
        ├── date-helper.js      # 日期工具
        └── logger.js           # 日志工具
```

## 🎯 工作流程

### 每日工作流

**早晨（5分钟）**
1. 运行 `npm run daily-note` 创建今日笔记
2. 查看仪表盘，了解待办事项

**白天（随时）**
- 随时记录想法到 Inbox
- 不需要分类，保持思维流畅

**晚上（10分钟）**
1. 运行 `npm run ai:workflow` 执行 AI 工作流
2. AI 自动：
   - 生成每日总结和洞察
   - 整理 Inbox 并分类到 PARA
   - 提取任务并分析优先级

### 每周工作流

**周日晚上（30分钟）**
1. 查看本周统计：`npm run stats`
2. 运行自动归档：`npm run auto-archive`
3. 回顾本周的每日总结
4. 规划下周重点

## 🧠 AI 工作流详解

### 四次 AI 调用的渐进式理解

```
┌─────────────────────────────────────┐
│  第一次 AI：每日总结（导师视角）      │
│  分析全天笔记，生成宏观洞察           │
└──────────┬──────────────────────────┘
           │ 提供上下文指导
           ▼
┌─────────────────────────────────────┐
│  第二次 AI：笔记聚合（结构化专家）    │
│  合并同话题，提炼精简版，生成标签     │
└──────────┬──────────────────────────┘
           │ 识别行动项
           ▼
┌─────────────────────────────────────┐
│  第三次 AI：任务提取（任务专家）      │
│  识别待办事项，创建可执行任务         │
└──────────┬──────────────────────────┘
           │ 深度分析
           ▼
┌─────────────────────────────────────┐
│  第四次 AI：任务分析（管理专家）      │
│  评估优先级，应用艾森豪威尔矩阵       │
└─────────────────────────────────────┘
```

每次 AI 调用都基于前一次的输出，形成**认知的螺旋上升**。

## 📊 PARA 方法说明

### Projects（项目）
有明确截止日期和可交付成果的短期目标

**示例**：
- 完成季度报告
- 学习 React 框架
- 筹备生日派对

### Areas（领域）
需要持续维护的长期责任和兴趣

**示例**：
- 健康管理
- 财务规划
- 职业发展

### Resources（资源）
感兴趣的主题和未来可能用到的参考资料

**示例**：
- 编程教程
- 设计灵感
- 烹饪食谱

### Archives（归档）
已完成或不再活跃的内容

## 💡 最佳实践

1. **保持简单**：从基础结构开始，逐步优化
2. **定期回顾**：建立固定的回顾习惯
3. **及时捕捉**：不要让想法溜走
4. **信任 AI**：让 AI 帮你分类和规划
5. **持续迭代**：系统应该随着你的需求进化

## 🔧 高级配置

### 自定义 AI Prompt

编辑 `prompts/` 目录下的文件来自定义 AI 行为：
- `daily-summary.txt` - 每日总结的角色和任务
- `note-aggregation.txt` - 笔记聚合规则
- `task-extraction.txt` - 任务提取标准
- `task-analysis.txt` - 优先级分析方法

### 调整 AI 模型

编辑 `.env` 文件：

```env
# 使用更快的模型
AI_MODEL=gemini-1.5-flash

# 或使用更智能的模型
AI_MODEL=gemini-2.0-flash-exp
```

### 自定义模板

编辑 `config/templates.json` 添加自己的模板。

## 💰 成本估算

### 免费额度
- **Notion API**: 免费
- **Gemini API**: 每天 1500 次免费调用（Gemini Flash）

### 典型使用成本
假设每天运行一次完整 AI 工作流（4次 AI 调用）：
- 每月约 120 次调用
- 在免费额度内，**完全免费**

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

- [Notion API](https://developers.notion.com/)
- [Google Gemini](https://ai.google.dev/)
- [Building a Second Brain](https://www.buildingasecondbrain.com/)
- [PARA Method](https://fortelabs.com/blog/para/)

## 📚 相关文档

### 用户文档
- [⚡️ 5分钟快速开始](QUICKSTART.md) - 最快上手指南
- [📖 完整设置指南](docs/setup-guide.md) - 详细配置步骤

### 技术文档
- [📋 产品需求文档](docs/PRD.md) - **新版 v2.0，含完整数据流程和 AI 功能详细设计**
- [🔄 工作流分析](docs/workflow-analysis.md) - Cubox→Notion 工作流深度分析
- [🤖 AI 集成方案](docs/ai-workflow-integration.md) - AI 功能技术实现方案

### 项目管理文档
- [📊 项目完成报告](PROJECT-COMPLETION-REPORT.md) - 项目交付总结
- [📝 更新日志](CHANGELOG.md) - 版本更新记录
- [🤝 贡献指南](CONTRIBUTING.md) - 如何参与贡献

## ❓ 常见问题

**Q: 必须使用 AI 功能吗？**
A: 不必须。所有基础功能都可以独立使用。AI 功能是可选的增强。

**Q: AI 会读取我的所有笔记吗？**
A: 只会读取你指定处理的笔记。所有数据都在本地处理，不会上传到第三方。

**Q: 成本会很高吗？**
A: 在正常使用下（每天1-2次 AI 工作流），完全在免费额度内。

**Q: 支持其他 AI 模型吗？**
A: 当前支持 Google Gemini。未来计划支持 OpenAI、Claude 等。

**Q: 如何备份数据？**
A: 运行 `npm run backup` 即可导出所有数据为 JSON 格式。

---

如果这个项目对你有帮助，请给个 Star ⭐️

**让 AI 成为你的第二大脑的增强器！** 🚀
