# AI 驱动的第二大脑增强方案

基于你现有的 Cubox → Notion 工作流分析，我们可以为第二大脑项目添加类似的 AI 自动化能力。

## 核心改进方向

### 1. AI 增强的 Inbox 处理

**当前状态**：手动整理 Inbox
**改进方案**：AI 自动分析和预分类

```javascript
// scripts/ai-inbox-processor.js
class AIInboxProcessor {
  /**
   * AI 处理 Inbox 内容
   * 1. 自动生成摘要
   * 2. 推荐标签
   * 3. 建议 PARA 分类
   * 4. 提取待办事项
   */
  async processInboxItem(item) {
    const prompt = `
    分析以下笔记内容，返回 JSON：
    {
      "summary": "精炼摘要（50字以内）",
      "tags": ["标签1", "标签2"],
      "para_category": "Projects/Areas/Resources",
      "has_todo": true/false,
      "todo_items": ["待办1", "待办2"],
      "priority": 1-3
    }

    内容：${item.content}
    `;

    const result = await this.callAI(prompt);
    return this.parseJSON(result);
  }
}
```

### 2. 每日智能总结系统

**借鉴你的 DAILY SUMMARY 设计**：

```javascript
// scripts/daily-summary-ai.js
class DailySummaryAI {
  async generateDailySummary(date) {
    // 1. 收集当天所有笔记
    const notes = await this.getAllNotesForDate(date);

    // 2. 调用 AI 生成总结
    const prompt = `
    角色：沉稳、富有洞察力的个人人生导师

    任务：分析用户今天的所有笔记，生成：
    1. daily_summary: 今日总结（2-3句话）
    2. core_themes: 核心主题数组
    3. mindset_analysis: 思考模式分析
    4. main_highlight: 主要亮点
    5. main_blindspot: 潜在盲点
    6. action_suggestions: 行动建议数组
    7. daily_mantra: 哲理金句（必须标注作者）

    今日笔记：
    ${notes.map(n => `[${n.type}] ${n.content}`).join('\n\n')}
    `;

    const summary = await this.callAI(prompt);

    // 3. 写入 Notion
    await this.createDailySummaryPage(date, summary);

    return summary;
  }
}
```

### 3. 笔记聚合与智能关联

**借鉴 note aggregation 设计**：

```javascript
// scripts/note-aggregation.js
class NoteAggregation {
  async aggregateNotes(dailySummaryContext) {
    // 1. 获取待处理笔记
    const rawNotes = await this.getUnprocessedNotes();

    // 2. AI 聚合（使用 daily summary 作为上下文）
    const prompt = `
    上下文指导：
    ${dailySummaryContext}

    任务：
    1. 合并相关话题的笔记
    2. 提炼精简版（保留核心信息）
    3. 生成 3-8 个标签
    4. 关联原始笔记 ID

    输出格式：
    {
      "notes": [
        {
          "refined_content": "精炼后的笔记",
          "tags": ["标签1", "标签2"],
          "source_ids": ["id1", "id2"],
          "related_projects": ["项目名"]
        }
      ]
    }

    原始笔记：
    ${rawNotes.map(n => `ID: ${n.id}\n${n.content}`).join('\n\n')}
    `;

    const aggregated = await this.callAI(prompt);

    // 3. 创建聚合笔记
    for (const note of aggregated.notes) {
      await this.createAggregatedNote(note);
    }
  }
}
```

### 4. 智能任务提取

**借鉴 generate task 设计**：

```javascript
// scripts/task-extraction.js
class TaskExtraction {
  async extractTasks(notes) {
    const prompt = `
    角色：任务提取专家

    规则：
    ✅ 必须提取：明确的待办、项目规划、调研需求
    ❌ 必须忽略：纯感悟、观点、资讯收藏

    输出格式：
    {
      "tasks": [
        {
          "title": "任务名称",
          "source_note_id": "来源笔记ID",
          "priority": "high/medium/low",
          "category": "工作/学习/个人"
        }
      ]
    }

    笔记内容：
    ${notes}
    `;

    const tasks = await this.callAI(prompt);

    // 创建任务
    for (const task of tasks.tasks) {
      await this.createTask(task);
    }
  }
}
```

### 5. 艾森豪威尔矩阵自动分析

**借鉴 task master 设计**：

```javascript
// scripts/task-analyzer.js
class TaskAnalyzer {
  async analyzeTask(taskId, taskTitle) {
    const prompt = `
    角色：高效能管理专家

    任务：分析任务并返回 JSON
    {
      "importance_score": 1-3,
      "urgency_score": 1-3,
      "eisenhower_quadrant": 1-4,
      "category": ["工作", "学习"],
      "subtasks": "子任务1；子任务2；子任务3",
      "estimated_time": "2小时",
      "best_time": "上午/下午/晚上"
    }

    艾森豪威尔象限：
    1 = 重要且紧急（立即做）
    2 = 重要不紧急（计划做）
    3 = 不重要但紧急（委派）
    4 = 不重要不紧急（删除）

    任务：${taskTitle}
    `;

    const analysis = await this.callAI(prompt);

    // 更新任务属性
    await this.updateTaskProperties(taskId, analysis);
  }
}
```

## 完整的 AI 工作流集成

### 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                     定时触发器                               │
│          每小时 / 每日 / 手动触发                            │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  第一阶段：每日总结                          │
│   DailySummaryAI.generateDailySummary()                     │
│   - 收集今日所有笔记                                         │
│   - AI 生成宏观总结和洞察                                    │
│   - 创建 Daily Summary 页面                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  第二阶段：笔记聚合                          │
│   NoteAggregation.aggregateNotes(dailySummary)              │
│   - 使用 daily summary 作为上下文                           │
│   - 合并同话题笔记                                           │
│   - 生成标签和关联                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  第三阶段：任务提取                          │
│   TaskExtraction.extractTasks(notes)                        │
│   - 从笔记中识别待办事项                                     │
│   - 创建任务条目                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  第四阶段：任务分析                          │
│   TaskAnalyzer.analyzeTask(task)                            │
│   - 评估重要性和紧急性                                       │
│   - 分配象限                                                 │
│   - 拆解子任务                                               │
└─────────────────────────────────────────────────────────────┘
```

## 数据库结构扩展

### 1. 扩展 Notes 数据库

```javascript
// config/database-schema.json
{
  "Notes": {
    "properties": {
      // 现有字段...
      "ai_summary": { "type": "rich_text" },      // AI 生成的摘要
      "ai_tags": { "type": "multi_select" },      // AI 推荐的标签
      "suggested_para": { "type": "select" },     // AI 建议的 PARA 分类
      "processing_status": {                       // 处理状态
        "type": "select",
        "options": ["未处理", "AI已分析", "已确认"]
      },
      "source_notes": { "type": "relation" },     // 来源笔记（聚合时）
      "derived_notes": { "type": "relation" },    // 衍生笔记
      "extracted_tasks": { "type": "relation" }   // 提取的任务
    }
  }
}
```

### 2. 新增 Daily_Insights 数据库

```javascript
{
  "Daily_Insights": {
    "icon": "🌟",
    "properties": {
      "日期": { "type": "title" },
      "daily_summary": { "type": "rich_text" },
      "core_themes": { "type": "multi_select" },
      "mindset_analysis": { "type": "rich_text" },
      "highlight": { "type": "rich_text" },
      "blindspot": { "type": "rich_text" },
      "action_plan": { "type": "rich_text" },
      "daily_mantra": { "type": "rich_text" },
      "related_notes": { "type": "relation" },     // 关联今日笔记
      "mood_score": { "type": "number" }           // 情绪评分
    }
  }
}
```

### 3. 扩展 Projects/Tasks 数据库

```javascript
{
  "Projects": {
    "properties": {
      // 现有字段...
      "importance_score": { "type": "number" },
      "urgency_score": { "type": "number" },
      "eisenhower_quadrant": {
        "type": "select",
        "options": [
          "象限1-立即做",
          "象限2-计划做",
          "象限3-委派",
          "象限4-删除"
        ]
      },
      "ai_subtasks": { "type": "rich_text" },
      "estimated_time": { "type": "rich_text" },
      "best_time_to_do": { "type": "select" }
    }
  }
}
```

## 实现脚本框架

### AI 客户端封装

```javascript
// src/api/ai-client.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIClient {
  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.client.getGenerativeModel({
      model: 'gemini-2.0-flash-exp'
    });
  }

  async generateContent(systemPrompt, userContent) {
    const fullPrompt = `${systemPrompt}\n\n用户内容：\n${userContent}`;

    const result = await this.model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  }

  parseJSON(text) {
    // 移除可能的 Markdown 代码块
    let cleaned = text.replace(/```json\s*/, '').replace(/\s*```$/, '');
    return JSON.parse(cleaned);
  }
}

module.exports = AIClient;
```

### 主控制器

```javascript
// scripts/ai-workflow-runner.js
const DailySummaryAI = require('./daily-summary-ai');
const NoteAggregation = require('./note-aggregation');
const TaskExtraction = require('./task-extraction');
const TaskAnalyzer = require('./task-analyzer');

class AIWorkflowRunner {
  async run() {
    Logger.section('AI 增强工作流');

    // 阶段 1: 生成每日总结
    const dailySummary = await new DailySummaryAI().generate();
    Logger.success('每日总结已生成');

    // 阶段 2: 笔记聚合
    await new NoteAggregation().aggregate(dailySummary);
    Logger.success('笔记聚合完成');

    // 阶段 3: 任务提取
    const tasks = await new TaskExtraction().extract();
    Logger.success(`提取了 ${tasks.length} 个任务`);

    // 阶段 4: 任务分析
    for (const task of tasks) {
      await new TaskAnalyzer().analyze(task);
    }
    Logger.success('任务分析完成');
  }
}

module.exports = AIWorkflowRunner;
```

## 配置文件

```javascript
// config/ai-config.json
{
  "ai_provider": "gemini",
  "models": {
    "summary": "gemini-2.0-flash-exp",
    "analysis": "gemini-2.0-flash-exp",
    "quick": "gemini-1.5-flash"
  },
  "prompts": {
    "daily_summary": "prompts/daily-summary.txt",
    "note_aggregation": "prompts/note-aggregation.txt",
    "task_extraction": "prompts/task-extraction.txt",
    "task_analysis": "prompts/task-analysis.txt"
  },
  "schedule": {
    "daily_summary": "21:00",
    "note_processing": "every 2 hours",
    "task_extraction": "09:00"
  },
  "filters": {
    "min_note_length": 10,
    "max_notes_per_batch": 20,
    "ignore_tags": ["已归档", "无需处理"]
  }
}
```

## Prompt 模板管理

```
prompts/
├── daily-summary.txt      # 每日总结 prompt
├── note-aggregation.txt   # 笔记聚合 prompt
├── task-extraction.txt    # 任务提取 prompt
└── task-analysis.txt      # 任务分析 prompt
```

## 使用方式

```bash
# 安装 AI 相关依赖
npm install @google/generative-ai

# 配置 API Key
echo "GEMINI_API_KEY=your_key_here" >> .env

# 手动运行完整工作流
npm run ai-workflow

# 只运行每日总结
npm run ai:daily-summary

# 只处理 Inbox
npm run ai:process-inbox

# 启动自动化（包含 AI 工作流）
npm run automation
```

## 成本控制建议

### 1. 批量处理
- 不要每条笔记实时处理
- 每2小时批量处理一次
- 每日总结只在晚上运行一次

### 2. 使用缓存
```javascript
// 相似内容使用缓存结果
const cache = new Map();
if (cache.has(contentHash)) {
  return cache.get(contentHash);
}
```

### 3. 分级处理
- 重要笔记：使用高级模型（Gemini Pro）
- 普通笔记：使用快速模型（Gemini Flash）
- 简单分类：使用本地规则

## 渐进式实施路线

### Phase 1: 基础 AI 集成（Week 1-2）
- [ ] AI 客户端封装
- [ ] 每日总结功能
- [ ] 基础 JSON 解析

### Phase 2: 笔记处理（Week 3-4）
- [ ] Inbox 自动分类
- [ ] 笔记聚合
- [ ] 标签生成

### Phase 3: 任务管理（Week 5-6）
- [ ] 任务提取
- [ ] 优先级分析
- [ ] 艾森豪威尔矩阵

### Phase 4: 优化迭代（Week 7-8）
- [ ] Prompt 优化
- [ ] 缓存机制
- [ ] 成本优化

## 对比总结

| 功能 | 你的工作流 | 第二大脑项目 | 整合方案 |
|------|-----------|-------------|---------|
| 数据源 | Cubox 收藏 | 手动输入 | 支持多源（Cubox/手动/API） |
| AI 调用 | 4次渐进式 | 无 | 采用4次渐进式设计 |
| 每日总结 | ✅ 人生导师视角 | 基础模板 | 集成 AI 导师视角 |
| 笔记聚合 | ✅ 智能合并 | 手动整理 | AI 自动聚合 |
| 任务提取 | ✅ 自动识别 | 手动创建 | AI 自动提取 |
| 优先级分析 | ✅ 艾森豪威尔矩阵 | 无 | 集成优先级系统 |
| PARA 方法 | 无 | ✅ 完整实现 | 两者结合 |

## 最终效果

用户体验：
1. 每天随意记录想法到 Inbox
2. 系统每2小时自动处理：
   - AI 理解内容
   - 自动分类到 PARA
   - 生成标签
   - 提取任务
3. 每晚21:00自动生成每日总结：
   - 今日亮点
   - 潜在盲点
   - 行动建议
   - 哲理金句
4. 任务自动分析优先级，告诉你先做什么

**结果**：真正的"第二大脑"，既能记忆，又能思考，还能提供建议！

---

**文档版本**：v1.0
**创建日期**：2025-11-23
