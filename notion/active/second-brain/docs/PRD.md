# Notion 第二大脑系统 - 产品需求文档 (PRD)

## 1. 项目概述

### 1.1 项目背景
在信息爆炸的时代，个人知识管理变得越来越重要。"第二大脑"（Second Brain）是一个个人知识管理系统，用于捕捉、组织和利用我们日常接触的信息，让知识成为可复用的资产。

### 1.2 项目目标
构建一个基于 Notion 的第二大脑系统，通过自动化工具和最佳实践，帮助用户：
- 高效捕捉和整理信息
- 建立知识之间的联系
- 提升知识检索和复用效率
- 形成个人知识体系

### 1.3 核心价值主张
- **智能捕捉**：支持多渠道信息快速收集
- **结构化组织**：基于 PARA 方法的知识分类体系
- **双链笔记**：建立知识网络，促进创造性思考
- **自动化工作流**：减少重复性工作，专注于思考

## 2. 目标用户

### 2.1 主要用户群体
- **知识工作者**：需要处理大量信息的研究人员、作家、开发者
- **终身学习者**：希望系统化管理学习内容的个人
- **创意工作者**：需要灵感管理和创意整合的设计师、内容创作者
- **项目管理者**：需要整合项目资料和知识的团队领导者

### 2.2 用户痛点
- 信息分散在多个平台，难以统一管理
- 笔记缺乏组织，难以快速检索
- 知识孤岛化，缺少关联和复用
- 手动整理费时费力

## 3. 功能需求

### 3.1 核心功能

#### 3.1.1 知识捕捉系统
- **快速收集**
  - Web Clipper 集成（保存网页、文章）
  - 邮件转发至 Notion
  - 移动端快速输入
  - API 集成（从其他工具导入）

- **多格式支持**
  - 文本笔记
  - 网页剪藏
  - 图片、文档
  - 代码片段
  - 音频/视频链接

#### 3.1.2 知识组织系统
- **PARA 架构**
  - Projects（项目）：当前正在进行的项目
  - Areas（领域）：长期关注的领域
  - Resources（资源）：主题相关的参考资料
  - Archives（归档）：已完成或暂停的内容

- **标签系统**
  - 多维度标签（主题、类型、状态等）
  - 智能标签推荐
  - 标签层级管理

#### 3.1.3 知识连接系统
- **双向链接**
  - 页面间的双向引用
  - 反向链接自动展示
  - 知识图谱可视化

- **关系网络**
  - 相关笔记推荐
  - 主题聚类
  - 知识路径追踪

#### 3.1.4 知识检索系统
- **全文搜索**
  - 快速搜索功能
  - 高级筛选器
  - 搜索历史记录

- **视图管理**
  - 多种视图（表格、看板、画廊、时间线）
  - 自定义筛选和排序
  - 保存常用视图

### 3.2 自动化功能

#### 3.2.1 自动化工作流
- **定期回顾提醒**
  - 每日/周/月回顾任务
  - 间隔重复系统（Spaced Repetition）
  - 笔记复习提醒

- **智能处理**
  - 新笔记自动分类建议
  - 相关内容自动关联
  - 定期归档旧内容

#### 3.2.2 模板系统
- **预设模板**
  - 每日笔记模板
  - 会议记录模板
  - 读书笔记模板
  - 项目管理模板
  - 决策日志模板

### 3.3 辅助功能

- **仪表盘（Dashboard）**
  - 今日待办
  - 最近笔记
  - 统计数据（笔记数量、增长趋势等）
  - 快速访问入口

- **导入导出**
  - 从 Evernote、OneNote 等迁移
  - 导出为 Markdown
  - 备份功能

## 4. 技术方案

### 4.1 技术栈
```json
{
  "runtime": "Node.js 16+",
  "apis": {
    "notion": "@notionhq/client v2.2.15",
    "ai": "@google/generative-ai v0.21.0"
  },
  "automation": "node-cron v3.0.3",
  "cli": {
    "prompts": "inquirer v8.2.6",
    "spinner": "ora v5.4.1",
    "colors": "chalk v4.1.2"
  },
  "utils": {
    "dates": "date-fns v3.3.1",
    "http": "axios v1.7.2"
  }
}
```

### 4.2 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                       用户层                             │
│            CLI 命令 / 定时任务触发                       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                    脚本层                                │
│  setup | daily-note | ai-workflow | automation          │
└────────────────────┬────────────────────────────────────┘
                     │
     ┌───────────────┴───────────────┐
     │                               │
┌────▼─────────┐              ┌─────▼──────────┐
│  核心模块    │              │  AI 模块        │
│              │              │                 │
│ API 封装     │              │ daily-summary   │
│ 日期工具     │              │ note-aggregation│
│ 日志工具     │              │ task-extraction │
│              │              │ task-analyzer   │
└────┬─────────┘              └─────┬───────────┘
     │                              │
     └─────────────┬────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                  外部 API 层                             │
│         Notion API  |  Gemini AI API                    │
└─────────────────────────────────────────────────────────┘
```

### 4.3 数据库设计（Notion Database Schema）

#### 4.3.1 核心数据库（PARA 体系）

**1. Projects（项目）数据库**
```json
{
  "icon": "🎯",
  "description": "有明确截止日期和可交付成果的短期目标",
  "properties": {
    "名称": { "type": "title" },
    "状态": {
      "type": "select",
      "options": ["计划中", "进行中", "暂停", "已完成", "已取消"]
    },
    "优先级": {
      "type": "select",
      "options": ["高", "中", "低"]
    },
    "开始日期": { "type": "date" },
    "截止日期": { "type": "date" },
    "进度": { "type": "number", "format": "percent" },
    "领域": { "type": "relation", "database": "Areas" },
    "标签": { "type": "multi_select" },
    "相关资源": { "type": "relation", "database": "Resources" }
  }
}
```

**2. Areas（领域）数据库**
```json
{
  "icon": "🌳",
  "description": "需要持续维护的长期责任和兴趣",
  "properties": {
    "名称": { "type": "title" },
    "类型": {
      "type": "select",
      "options": ["工作", "学习", "健康", "财务", "人际关系", "个人成长"]
    },
    "状态": {
      "type": "select",
      "options": ["活跃", "维护", "暂停"]
    },
    "标准": { "type": "rich_text" },
    "目标": { "type": "rich_text" },
    "相关项目": { "type": "relation", "database": "Projects" },
    "相关资源": { "type": "relation", "database": "Resources" }
  }
}
```

**3. Resources（资源）数据库**
```json
{
  "icon": "📚",
  "description": "可能在未来有用的参考资料",
  "properties": {
    "名称": { "type": "title" },
    "类型": {
      "type": "select",
      "options": ["文章", "书籍", "视频", "课程", "工具", "代码", "其他"]
    },
    "来源": { "type": "url" },
    "作者": { "type": "rich_text" },
    "发布日期": { "type": "date" },
    "评分": {
      "type": "select",
      "options": ["⭐️⭐️⭐️⭐️⭐️", "⭐️⭐️⭐️⭐️", "⭐️⭐️⭐️", "⭐️⭐️", "⭐️"]
    },
    "阅读状态": {
      "type": "select",
      "options": ["未读", "阅读中", "已完成"]
    },
    "主题": { "type": "multi_select" },
    "相关领域": { "type": "relation", "database": "Areas" },
    "相关项目": { "type": "relation", "database": "Projects" }
  }
}
```

**4. Archives（归档）数据库**
```json
{
  "icon": "📦",
  "description": "已完成或不再活跃的内容",
  "properties": {
    "名称": { "type": "title" },
    "原分类": {
      "type": "select",
      "options": ["项目", "领域", "资源"]
    },
    "归档原因": {
      "type": "select",
      "options": ["已完成", "已取消", "不再相关"]
    },
    "归档日期": { "type": "date" },
    "标签": { "type": "multi_select" }
  }
}
```

#### 4.3.2 辅助数据库

**5. Notes（笔记中央库）**
```json
{
  "icon": "📝",
  "description": "所有笔记的统一入口",
  "properties": {
    "标题": { "type": "title" },
    "类型": {
      "type": "select",
      "options": ["永久笔记", "文献笔记", "闪念笔记", "每日笔记", "会议记录"]
    },
    "状态": {
      "type": "select",
      "options": ["草稿", "完善中", "已完成"]
    },
    "分类": {
      "type": "select",
      "options": ["项目", "领域", "资源", "收件箱"]
    },
    "相关项目": { "type": "relation", "database": "Projects" },
    "相关领域": { "type": "relation", "database": "Areas" },
    "相关资源": { "type": "relation", "database": "Resources" },
    "标签": { "type": "multi_select" },
    "创建时间": { "type": "created_time" },
    "更新时间": { "type": "last_edited_time" },
    "上次查看": { "type": "date" }
  }
}
```

**6. Inbox（收件箱）**
```json
{
  "icon": "📥",
  "description": "待整理的新想法和信息",
  "properties": {
    "内容": { "type": "title" },
    "来源": {
      "type": "select",
      "options": ["Web Clipper", "邮件", "手机", "其他"]
    },
    "处理状态": {
      "type": "select",
      "options": ["待处理", "处理中", "已处理"]
    },
    "创建时间": { "type": "created_time" },
    "处理时间": { "type": "date" }
  }
}
```

**7. Daily_Notes（每日笔记）**
```json
{
  "icon": "📅",
  "description": "每日记录和反思",
  "properties": {
    "日期": { "type": "title" },
    "星期": {
      "type": "select",
      "options": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    },
    "心情": {
      "type": "select",
      "options": ["😄 很好", "🙂 不错", "😐 一般", "😔 不好"]
    },
    "创建时间": { "type": "created_time" }
  }
}
```

### 4.4 AI 功能详细设计

#### 4.4.1 AI 每日总结功能

**功能目标**：分析当天所有笔记，生成导师视角的深度洞察

**数据流程**：
```
步骤 1: 数据收集
├─ 从 Daily_Notes 数据库查询：filter = { 日期: 今日 }
├─ 从 Notes 数据库查询：filter = { 创建时间: 今日 }
└─ 从 Inbox 数据库查询：filter = { 创建时间: 今日 }

步骤 2: 数据整合
├─ 提取所有页面的文本内容（调用 Notion API blocks.children.list）
├─ 合并为单一文本：daily_note_content + notes_content + inbox_content
└─ 添加元数据：日期、笔记数量、总字数

步骤 3: AI 分析
├─ 加载 Prompt 模板：prompts/daily-summary.txt
├─ 构建输入：系统 Prompt + 用户内容（今日所有笔记）
├─ 调用 Gemini API：generateContent(prompt, content)
└─ 解析 JSON 响应（重试机制：最多 3 次）

步骤 4: 结果存储
├─ 在 Daily_Notes 数据库创建子页面
│  └─ 标题："每日总结 - {日期}"
├─ 写入 AI 输出的 7 个字段为 Notion blocks：
│  ├─ heading_2: "今日总结"
│  ├─ paragraph: daily_summary
│  ├─ heading_2: "核心主题"
│  ├─ bulleted_list_item: core_themes[0]
│  ├─ bulleted_list_item: core_themes[1]
│  ├─ ...其他字段
└─ 返回：{ date, pageId, summary }
```

**输入数据格式**：
```
## 今日笔记汇总

### Daily Note - 2025-11-23
- 早上 8:00 开会讨论项目进度
- 中午学习了 React Hooks
- 晚上读了 10 页《深度工作》

### Inbox 条目
1. 看到一篇关于时间管理的文章
2. 想到一个产品优化的点子
3. 记录一个技术问题待解决

### 普通笔记
- React useEffect 的依赖数组陷阱
- 深度工作的核心原则笔记
```

**AI 输出格式**（必须严格 JSON）：
```json
{
  "daily_summary": "今天主要聚焦于学习 React Hooks 和时间管理方法，同时在项目进度上有明确推进。",
  "core_themes": ["技术学习：React", "个人效率", "项目管理"],
  "mindset_analysis": "今天展现出平衡学习与工作的思维模式，既关注深度技术学习，也在意整体生产力提升。",
  "main_highlight": "学习 React Hooks 并立即记录了技术陷阱，体现了有效的学习闭环。",
  "main_blindspot": "技术问题记录后缺少解决时间规划，建议为每个待解决问题设置处理时间。",
  "mentor_action_plan": [
    "为记录的技术问题创建具体的解决任务",
    "将时间管理的理论应用到明天的日程中",
    "预留每天固定时间进行深度学习"
  ],
  "daily_mantra": "知识的积累在于持续的刻意练习，而非偶尔的灵光一现。 (James Clear)"
}
```

**Notion 存储结构**：
```
Page: "每日总结 - 2025-11-23"
├─ Properties:
│  ├─ 日期: 2025-11-23
│  └─ 类型: "AI 生成"
└─ Content Blocks:
   ├─ heading_2: "今日总结"
   ├─ paragraph: "今天主要聚焦于..."
   ├─ heading_2: "核心主题"
   ├─ bulleted_list_item: "技术学习：React"
   ├─ bulleted_list_item: "个人效率"
   ├─ bulleted_list_item: "项目管理"
   ├─ heading_2: "思考模式分析"
   ├─ paragraph: "今天展现出平衡学习..."
   ├─ heading_2: "主要亮点"
   ├─ callout: "💡 学习 React Hooks..."
   ├─ heading_2: "潜在盲点"
   ├─ callout: "⚠️ 技术问题记录后..."
   ├─ heading_2: "行动建议"
   ├─ numbered_list_item: "为记录的技术问题..."
   ├─ numbered_list_item: "将时间管理的理论..."
   ├─ numbered_list_item: "预留每天固定时间..."
   ├─ heading_2: "今日箴言"
   └─ quote: "知识的积累在于..."
```

#### 4.4.2 AI 笔记聚合功能

**功能目标**：智能合并 Inbox 中相关话题的笔记，提炼精简版

**数据流程**：
```
步骤 1: 收集未处理笔记
├─ 查询 Inbox：filter = { 处理状态: "待处理" }
├─ 按创建时间排序
├─ 限制数量：最多 20 条（避免超出 AI token 限制）
└─ 提取每条笔记的：ID、标题、内容

步骤 2: 获取上下文
├─ 查询今日的每日总结（如果存在）
├─ 提取：daily_summary, core_themes
└─ 作为上下文指导笔记聚合

步骤 3: AI 聚合分析
├─ 加载 Prompt：prompts/note-aggregation.txt
├─ 替换占位符：{{CONTEXT}} = 每日总结内容
├─ 构建输入：
│  ├─ 系统 Prompt（含上下文）
│  └─ 用户内容：所有 Inbox 笔记列表
├─ 调用 Gemini API
└─ 解析 JSON：{ notes: [{refined_content, tags, source_ids}] }

步骤 4: 创建聚合笔记
├─ 遍历 AI 返回的每个 note
├─ 在 Notes 数据库创建新页面：
│  ├─ 标题：根据 refined_content 生成
│  ├─ 内容：refined_content
│  ├─ 标签：tags[]
│  └─ Properties: { 类型: "AI 聚合", 状态: "已完成" }
└─ 更新原始 Inbox 条目：
   ├─ 处理状态 = "已处理"
   ├─ 添加关联：指向新创建的聚合笔记
   └─ 处理时间 = 当前时间

步骤 5: 返回结果
└─ 返回：{ aggregatedCount, createdNoteIds, processedInboxIds }
```

**输入数据格式**：
```
## 上下文（每日总结）
今日核心主题：技术学习、个人效率

## 待聚合笔记

### 笔记 1 (ID: inbox_001)
看到一篇关于 React Hooks 性能优化的文章，主要讲 useMemo 和 useCallback 的使用场景。

### 笔记 2 (ID: inbox_002)
React 的 useEffect 依赖数组如果不正确会导致无限循环，需要注意。

### 笔记 3 (ID: inbox_003)
发现一个时间管理工具 Toggl，可以追踪每项任务的时间。

### 笔记 4 (ID: inbox_004)
番茄工作法的核心是 25 分钟专注 + 5 分钟休息，适合深度工作。
```

**AI 输出格式**：
```json
{
  "notes": [
    {
      "refined_content": "React Hooks 性能优化核心要点：\n1. useMemo 用于缓存计算结果，避免重复计算\n2. useCallback 用于缓存函数引用，避免子组件无谓重渲染\n3. useEffect 的依赖数组必须完整，否则可能导致无限循环或状态不同步\n\n关键原则：优化前先profile，避免过早优化。",
      "tags": ["React", "性能优化", "Hooks", "前端开发"],
      "source_ids": ["inbox_001", "inbox_002"]
    },
    {
      "refined_content": "时间管理工具与方法组合：\n- 工具：Toggl 用于时间追踪，量化每项任务耗时\n- 方法：番茄工作法（25分钟专注 + 5分钟休息）\n- 适用场景：深度工作、编程、写作等需要长时间专注的任务\n\n实践建议：先用 Toggl 记录一周，分析时间分配，再用番茄工作法优化。",
      "tags": ["时间管理", "效率工具", "番茄工作法", "深度工作"],
      "source_ids": ["inbox_003", "inbox_004"]
    }
  ]
}
```

**Notion 存储结构**：
```
聚合笔记 1: "React Hooks 性能优化核心要点"
├─ Properties:
│  ├─ 标题: "React Hooks 性能优化核心要点"
│  ├─ 类型: "AI 聚合"
│  ├─ 状态: "已完成"
│  ├─ 标签: ["React", "性能优化", "Hooks", "前端开发"]
│  └─ 来源: [关联到 inbox_001, inbox_002]
└─ Content: refined_content（格式化为 Notion blocks）

原 Inbox 条目更新:
├─ inbox_001:
│  ├─ 处理状态: "已处理"
│  ├─ 处理时间: 2025-11-23 21:30
│  └─ 关联笔记: → "React Hooks 性能优化核心要点"
└─ inbox_002:
   └─ (同上)
```

#### 4.4.3 AI 任务提取功能

**功能目标**：从笔记中识别可执行的行动项

**数据流程**：
```
步骤 1: 收集待分析笔记
├─ 查询 Notes：filter = {
│    创建时间: 最近 7 天,
│    状态: ["草稿", "完善中"]
│  }
├─ 排除已归档笔记
└─ 提取：ID、标题、内容

步骤 2: AI 任务识别
├─ 加载 Prompt：prompts/task-extraction.txt
├─ 构建输入：所有笔记的标题和内容
├─ 调用 Gemini API
└─ 解析 JSON：{ tasks: [{title, source_note_id, priority, category}] }

步骤 3: 创建任务条目
├─ 在 Projects 数据库创建任务页面
│  ├─ 名称: task.title
│  ├─ 优先级: task.priority（高/中/低）
│  ├─ 标签: [task.category, "AI 提取"]
│  └─ 关联笔记: task.source_note_id
└─ 触发任务分析（步骤 4）

步骤 4: 任务优先级分析（可选）
└─ 对新创建的任务调用 AI 任务分析功能（见 4.4.4）
```

**输入数据格式**：
```
### 笔记 1 (ID: note_001)
标题：React 项目技术债务
内容：
- 需要重构 UserProfile 组件，代码重复太多
- 添加单元测试覆盖率到 80% 以上
- 考虑引入 React Query 管理服务端状态

### 笔记 2 (ID: note_002)
标题：《深度工作》读书笔记
内容：
要实践深度工作，需要：
1. 每天安排固定的深度工作时段
2. 关闭所有通知和干扰源
3. 建立深度工作的仪式感

思考：可以尝试每天早上 9-11 点作为深度工作时间。

### 笔记 3 (ID: note_003)
标题：产品优化想法
内容：
用户反馈搜索功能不够智能，经常找不到想要的内容。可能需要：
- 调研搜索引擎方案（Elasticsearch vs Algolia）
- 分析用户搜索日志，找出高频搜索词
- 优化搜索结果排序算法
```

**AI 输出格式**：
```json
{
  "tasks": [
    {
      "title": "重构 UserProfile 组件",
      "source_note_id": "note_001",
      "priority": "中",
      "category": "重构"
    },
    {
      "title": "提升单元测试覆盖率到 80%",
      "source_note_id": "note_001",
      "priority": "高",
      "category": "测试"
    },
    {
      "title": "评估并引入 React Query",
      "source_note_id": "note_001",
      "priority": "中",
      "category": "技术选型"
    },
    {
      "title": "建立每日深度工作时段（9-11点）",
      "source_note_id": "note_002",
      "priority": "高",
      "category": "习惯养成"
    },
    {
      "title": "调研搜索引擎方案（Elasticsearch vs Algolia）",
      "source_note_id": "note_003",
      "priority": "高",
      "category": "技术调研"
    },
    {
      "title": "分析用户搜索日志数据",
      "source_note_id": "note_003",
      "priority": "中",
      "category": "数据分析"
    }
  ]
}
```

**Notion 存储结构**：
```
任务页面: "重构 UserProfile 组件"
├─ Properties:
│  ├─ 名称: "重构 UserProfile 组件"
│  ├─ 状态: "计划中"
│  ├─ 优先级: "中"
│  ├─ 标签: ["重构", "AI 提取"]
│  ├─ 开始日期: (空)
│  ├─ 截止日期: (空)
│  └─ 来源笔记: → note_001
└─ Content: (稍后由任务分析 AI 填充)
```

#### 4.4.4 AI 任务分析功能（艾森豪威尔矩阵）

**功能目标**：评估任务的重要性和紧急性，提供执行建议

**数据流程**：
```
步骤 1: 获取任务信息
├─ 输入：task_id, task_title
├─ 查询 Projects 数据库获取任务详情
└─ 提取：标题、描述、相关笔记内容

步骤 2: AI 分析
├─ 加载 Prompt：prompts/task-analysis.txt
├─ 构建输入：任务标题 + 任务描述
├─ 调用 Gemini API
└─ 解析 JSON：{
     importance_score, urgency_score,
     eisenhower_quadrant, subtasks_or_advice,
     estimated_time, best_time_to_do
   }

步骤 3: 更新任务属性
├─ 添加自定义属性（如不存在）：
│  ├─ "重要性"（数字：1-3）
│  ├─ "紧急性"（数字：1-3）
│  └─ "象限"（选择：Q1-Q4）
└─ 更新任务页面：
   ├─ Properties: importance_score, urgency_score, quadrant
   └─ Content blocks:
      ├─ heading_2: "AI 分析"
      ├─ heading_3: "子任务建议"
      ├─ todo: subtasks[0]
      ├─ todo: subtasks[1]
      ├─ heading_3: "执行建议"
      ├─ paragraph: "预计时间：{estimated_time}"
      └─ paragraph: "最佳执行时间：{best_time_to_do}"
```

**输入数据格式**：
```
任务 ID: task_001
任务标题: 重构 UserProfile 组件
任务描述: UserProfile 组件代码重复太多，需要抽取公共逻辑，提升可维护性。
```

**AI 输出格式**：
```json
{
  "importance_score": 2,
  "urgency_score": 1,
  "eisenhower_quadrant": 2,
  "subtasks_or_advice": "识别重复代码模式; 设计抽象层; 编写单元测试; 逐步重构，保持功能不变; Code Review",
  "estimated_time": "4-6 小时",
  "best_time_to_do": "早上精力充沛时，需要集中注意力进行架构设计"
}
```

**艾森豪威尔矩阵说明**：
```
象限 1（重要且紧急）：立即做
  - importance_score = 3, urgency_score = 3
  - 建议：优先处理，今天完成

象限 2（重要但不紧急）：计划做
  - importance_score = 2-3, urgency_score = 1-2
  - 建议：安排时间，深度工作

象限 3（紧急但不重要）：委派
  - importance_score = 1, urgency_score = 3
  - 建议：委派给他人或简化流程

象限 4（不重要不紧急）：删除
  - importance_score = 1, urgency_score = 1
  - 建议：考虑是否真的需要做
```

**Notion 存储结构**：
```
任务页面: "重构 UserProfile 组件"（更新后）
├─ Properties:
│  ├─ 名称: "重构 UserProfile 组件"
│  ├─ 状态: "计划中"
│  ├─ 优先级: "中"
│  ├─ 重要性: 2
│  ├─ 紧急性: 1
│  ├─ 象限: "Q2 - 计划做"
│  └─ 标签: ["重构", "AI 提取", "AI 分析"]
└─ Content Blocks:
   ├─ heading_2: "📊 AI 分析"
   ├─ callout: "💡 象限 2：重要但不紧急 - 建议计划执行"
   ├─ heading_3: "子任务建议"
   ├─ to_do: "识别重复代码模式"
   ├─ to_do: "设计抽象层"
   ├─ to_do: "编写单元测试"
   ├─ to_do: "逐步重构，保持功能不变"
   ├─ to_do: "Code Review"
   ├─ heading_3: "执行建议"
   ├─ paragraph: "⏱️ 预计时间：4-6 小时"
   └─ paragraph: "🌅 最佳执行时间：早上精力充沛时..."
```

### 4.5 渐进式 AI 理解架构

**核心设计思想**：每次 AI 调用都基于前一次的输出，形成认知的螺旋上升

```
第一层（宏观视角）：每日总结 AI
  输入: 今日所有笔记
  输出: 今日总结 + 核心主题 + 思考模式分析
  目的: 建立全天的宏观理解
  ↓ [输出作为下一层的上下文]

第二层（中观视角）：笔记聚合 AI
  输入: Inbox 笔记 + 每日总结上下文
  输出: 聚合笔记 + 智能标签
  目的: 在宏观理解指导下，结构化碎片信息
  ↓ [聚合笔记进入 Notes 库]

第三层（微观视角）：任务提取 AI
  输入: 最近笔记（包括新聚合的笔记）
  输出: 可执行任务列表
  目的: 识别需要行动的具体事项
  ↓ [任务进入 Projects 库]

第四层（执行视角）：任务分析 AI
  输入: 单个任务的详细信息
  输出: 优先级分析 + 执行建议
  目的: 为每个任务提供决策支持
```

**上下文传递机制**：
```javascript
// 第一次 AI 调用
const dailySummary = await generateDailySummary(todayNotes);
// 返回: { daily_summary, core_themes, mindset_analysis, ... }

// 第二次 AI 调用（使用第一次的输出）
const context = `
## 今日总结上下文
- 核心主题: ${dailySummary.core_themes.join(', ')}
- 思考模式: ${dailySummary.mindset_analysis}
`;
const aggregatedNotes = await aggregateNotes(inboxItems, context);

// 第三次 AI 调用（隐式使用前面的成果）
// 因为聚合笔记已经进入 Notes 库，查询时会包含它们
const tasks = await extractTasks(recentNotes);

// 第四次 AI 调用（针对每个任务）
for (const task of tasks) {
  const analysis = await analyzeTask(task.id, task.title);
}
```

## 5. 实施路线图

### Phase 1: 基础搭建（Week 1-2）
- [ ] 创建 Notion workspace 基础结构
- [ ] 设置 PARA 四大分类
- [ ] 创建核心数据库（笔记、资源、项目）
- [ ] 设计基础模板

### Phase 2: 工作流建立（Week 3-4）
- [ ] 配置信息捕捉工具（Web Clipper、Email）
- [ ] 建立每日笔记自动化
- [ ] 创建回顾提醒系统
- [ ] 设置仪表盘

### Phase 3: 增强功能（Week 5-6）
- [ ] 开发自定义自动化脚本
- [ ] 集成第三方工具
- [ ] 完善标签和分类体系
- [ ] 建立知识图谱可视化

### Phase 4: 优化迭代（Week 7-8）
- [ ] 使用反馈收集
- [ ] 工作流优化
- [ ] 性能调优
- [ ] 文档和教程完善

## 6. 成功指标

### 6.1 使用指标
- 每周新增笔记数量：≥ 10 条
- 笔记复用率：≥ 30%
- 每日系统使用时长：≥ 30 分钟
- 搜索成功率：≥ 90%

### 6.2 效果指标
- 信息查找时间：减少 50%
- 知识连接数量：平均每个笔记 ≥ 3 个链接
- 用户满意度：≥ 8/10
- 系统稳定性：正常运行时间 ≥ 99%

## 7. 风险和挑战

### 7.1 主要风险
- **过度复杂化**：系统设计过于复杂，降低使用意愿
- **维护成本高**：需要持续投入时间维护系统
- **依赖单一平台**：Notion 服务变更或停用的风险
- **学习曲线**：初期需要时间适应新的工作流

### 7.2 应对策略
- 采用渐进式实施，从简单开始
- 设计低维护成本的自动化流程
- 定期备份，保持数据导出能力
- 提供清晰的使用文档和教程

## 8. 附录

### 8.1 参考资料
- Building a Second Brain (Tiago Forte)
- The PARA Method
- Zettelkasten 笔记法
- Notion 官方文档

### 8.2 相关工具
- Notion Web Clipper
- Readwise（阅读笔记同步）
- Raindrop（书签管理）
- Zapier/Make（自动化）

## 9. 用户故事和使用场景

### 9.1 知识工作者：张工（软件工程师）

**背景**：
- 每天阅读大量技术文章和文档
- 需要管理多个并行项目
- 经常忘记记录的技术问题和灵感

**使用场景 1：早晨工作开始**
```
8:30  打开 Notion，查看 AI 生成的昨日总结
      发现 AI 指出：技术问题记录后缺少解决时间规划

8:35  查看 AI 自动提取的 5 个任务
      其中 3 个被标记为"Q2 - 计划做"
      根据 AI 建议，安排上午处理"重构 UserProfile"任务

8:40  开始深度工作，完成重构任务
```

**使用场景 2：白天随手记录**
```
10:30 在会议中想到一个优化点，快速记录到 Inbox
      内容："搜索功能需要支持模糊匹配"

14:00 看到一篇好文章，用 Web Clipper 保存到 Inbox

16:30 又想到一个技术方案，继续记录到 Inbox
```

**使用场景 3：晚上回顾整理**
```
21:00 运行 npm run ai:workflow

21:02 AI 生成今日总结：
      "今天主要完成了代码重构工作，同时发现了搜索功能的优化机会"

21:03 AI 自动将 3 条 Inbox 笔记聚合为 1 条：
      "搜索功能优化方案"（包含 3 个来源笔记的精华）

21:04 AI 从新笔记中提取出 2 个任务：
      1. 调研模糊搜索算法（Q2 - 计划做）
      2. 评估 Elasticsearch 方案（Q2 - 计划做）

21:05 查看 AI 分析，发现两个任务都建议"早上精力充沛时执行"
      决定明天上午处理
```

**结果**：
- 节省 30 分钟整理时间
- 不遗漏任何想法
- 任务优先级清晰
- 行动计划明确

### 9.2 终身学习者：李悦（产品经理）

**背景**：
- 每天阅读多篇文章和书籍
- 需要整理大量学习笔记
- 希望建立知识体系

**使用场景 1：阅读时快速捕捉**
```
早上通勤（7:30-8:30）
├─ 读《深度工作》10 页 → 手机快速记录 5 条感悟到 Inbox
├─ 看到一篇关于 OKR 的文章 → Web Clipper 保存
└─ 播客中听到时间管理技巧 → 语音转文字记录到 Inbox
```

**使用场景 2：AI 自动整理**
```
晚上 21:00 运行 AI 工作流

AI 笔记聚合结果：
├─ 将 5 条《深度工作》感悟合并为 1 条结构化笔记
│  标题："深度工作的四大原则"
│  标签：["深度工作", "专注力", "效率提升"]
│
├─ 将 OKR 文章和相关思考合并
│  标题："OKR 实施要点与个人应用"
│  标签：["OKR", "目标管理", "产品方法论"]
│
└─ 时间管理笔记独立成篇
   标题："时间管理工具箱"
   标签：["时间管理", "GTD", "个人效率"]

AI 提取任务：
├─ "实践深度工作：每天 9-11 点为深度时段"（Q2）
├─ "为 Q4 制定个人 OKR"（Q2）
└─ "试用番茄工作法 1 周"（Q3）
```

**使用场景 3：周末复盘**
```
周日下午复盘本周学习

查看 AI 每日总结：
├─ 周一：关注"产品方法论"
├─ 周二：关注"用户研究"
├─ 周三：关注"深度工作"
├─ 周四：关注"OKR 目标管理"
├─ 周五：关注"时间管理"

AI 分析：
"本周学习主题分散但都围绕个人效率提升，建议下周选择一个主题深入学习"

基于分析，决定下周专注"深度工作"实践
```

**结果**：
- 碎片知识系统化
- 学习主题清晰可见
- 自动生成行动清单
- 知识网络逐步建立

### 9.3 项目管理者：王总（创业者）

**背景**：
- 同时管理 3 个项目
- 每天大量会议和决策
- 需要跟踪多个待办事项

**使用场景：典型一天**
```
09:00 查看仪表盘
      ├─ 今日待办：5 个任务（2 个 Q1，3 个 Q2）
      ├─ 昨日总结：AI 指出"战略思考时间不足"
      └─ 行动建议："预留每周固定时间进行战略规划"

10:00 产品会议
      ├─ 记录会议要点到 Daily Note
      ├─ 3 个行动项快速记录到 Inbox
      └─ 1 个重要决策记录到"决策日志"模板

14:00 技术方案评审
      ├─ 记录技术选型讨论
      └─ 添加待调研的技术方案到 Inbox

16:00 临时想法
      ├─ "需要优化团队协作流程"
      ├─ "考虑引入 Scrum 框架"
      └─ 快速记录到 Inbox

21:00 运行 AI 工作流

AI 处理结果：
├─ 每日总结：
│  "今天聚焦于产品决策和技术方案，但执行型任务较少"
│  盲点："战术执行和战略思考需要平衡"
│
├─ 任务提取（7 个新任务）：
│  ├─ 产品相关（3 个）
│  ├─ 技术相关（2 个）
│  └─ 团队管理（2 个）
│
└─ 优先级分析：
   ├─ Q1（立即做）：2 个
   ├─ Q2（计划做）：4 个
   └─ Q3（可委派）：1 个

基于 AI 分析：
├─ 将 1 个 Q3 任务委派给团队成员
├─ 安排明天上午处理 2 个 Q1 任务
└─ 为 Q2 任务制定本周计划
```

**结果**：
- 不遗漏任何会议要点
- 自动识别行动项
- 优先级自动评估
- 委派建议明确

### 9.4 完整工作流示例

**场景：从想法到执行的完整闭环**

```
第 1 天：捕捉阶段
├─ 早上：通勤时读文章，保存 3 条笔记到 Inbox
├─ 中午：会议记录 5 个要点
├─ 下午：技术调研，记录 4 条发现
└─ 晚上：临时想法 2 条
   总计：14 条碎片信息

第 1 天晚上：AI 处理
├─ 21:00 运行 npm run ai:workflow
├─ AI 步骤 1：分析今日 14 条笔记，生成每日总结
├─ AI 步骤 2：将 14 条 Inbox 聚合为 4 条结构化笔记
│  ├─ "React 性能优化要点"（来源：3 条）
│  ├─ "产品需求分析"（来源：5 条）
│  ├─ "技术选型方案"（来源：4 条）
│  └─ "团队协作优化"（来源：2 条）
├─ AI 步骤 3：从 4 条笔记提取 6 个任务
└─ AI 步骤 4：为 6 个任务分析优先级

第 2 天：执行阶段
├─ 08:30 查看昨日总结和任务列表
├─ 09:00 根据 Q1 标记，处理紧急任务
├─ 11:00 根据 Q2 标记，安排深度工作任务
└─ 15:00 根据 Q3 标记，委派或简化任务

结果：
├─ 14 条碎片 → 4 条结构化笔记
├─ 4 条笔记 → 6 个可执行任务
└─ 6 个任务 → 明确的优先级和执行计划
```

## 10. API 调用示例

### 10.1 Notion API 调用示例

**创建数据库**：
```javascript
const notion = require('@notionhq/client').Client({
  auth: process.env.NOTION_API_TOKEN
});

// 创建 Notes 数据库
const notesDatabase = await notion.databases.create({
  parent: { page_id: parentPageId },
  title: [{ text: { content: "Notes" } }],
  icon: { emoji: "📝" },
  properties: {
    "标题": { title: {} },
    "类型": {
      select: {
        options: [
          { name: "永久笔记", color: "green" },
          { name: "文献笔记", color: "blue" },
          { name: "闪念笔记", color: "yellow" }
        ]
      }
    },
    "标签": { multi_select: {} },
    "创建时间": { created_time: {} }
  }
});
```

**查询数据库**：
```javascript
// 查询今日笔记
const response = await notion.databases.query({
  database_id: notesDatabaseId,
  filter: {
    property: "创建时间",
    created_time: {
      on_or_after: "2025-11-23T00:00:00.000Z"
    }
  },
  sorts: [
    {
      property: "创建时间",
      direction: "ascending"
    }
  ]
});
```

**创建页面**：
```javascript
// 在 Inbox 创建条目
const page = await notion.pages.create({
  parent: { database_id: inboxDatabaseId },
  properties: {
    "内容": {
      title: [{ text: { content: "快速记录的想法" } }]
    },
    "来源": {
      select: { name: "手机" }
    },
    "处理状态": {
      select: { name: "待处理" }
    }
  },
  children: [
    {
      object: "block",
      paragraph: {
        rich_text: [{ text: { content: "详细内容..." } }]
      }
    }
  ]
});
```

### 10.2 Gemini AI API 调用示例

**生成内容**：
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 调用 AI 生成每日总结
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const prompt = `
你是一位沉稳、富有洞察力的个人人生导师...

请分析以下笔记内容：
${notesContent}

输出严格的 JSON（禁止任何额外文本）：
{
  "daily_summary": "...",
  "core_themes": [...],
  ...
}
`;

const result = await model.generateContent(prompt);
const text = result.response.text();

// 清理并解析 JSON
let cleaned = text.trim();
if (cleaned.startsWith('```json')) {
  cleaned = cleaned.substring(7).replace(/```$/, '').trim();
}
const summary = JSON.parse(cleaned);
```

**重试机制**：
```javascript
async function generateWithRetry(prompt, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const json = parseJSON(result.response.text());
      return json;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}
```

---

**文档版本**：v2.0
**创建日期**：2025-11-23
**最后更新**：2025-11-23
**负责人**：待定

---

## 参考资料

本 PRD 基于以下实践和理论：
- Cubox → Notion 实际工作流分析
- Building a Second Brain (Tiago Forte)
- PARA 方法论
- 艾森豪威尔矩阵
- Prompt Engineering 最佳实践

**相关链接**：
- [Chunking Best Practices](https://dev.to/oleh-halytskyi/optimizing-rag-context-chunking-and-summarization-for-technical-docs-3pel)
- [Markdown Header Splitting](https://python.langchain.com/docs/how_to/markdown_header_metadata_splitter/)
- [Markdown Best Practices](https://www.markdownlang.com/advanced/best-practices.html)
