const AIClient = require('./ai-client');
const NotionClient = require('../api/notion-client');
const Logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

/**
 * 任务分析 AI - 应用艾森豪威尔矩阵分析任务
 */
class TaskAnalyzerAI {
  constructor() {
    this.aiClient = new AIClient();
    this.notionClient = new NotionClient();
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, '../../.notion-config.json');
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      Logger.error('配置文件未找到，请先运行 npm run setup');
      process.exit(1);
    }
  }

  /**
   * 分析所有未分析的任务
   */
  async analyzeAll() {
    Logger.section('AI 任务分析');

    try {
      // 1. 获取待分析的任务
      const tasks = await this.getUnanalyzedTasks();

      if (tasks.length === 0) {
        Logger.info('暂无待分析任务');
        return [];
      }

      Logger.info(`发现 ${tasks.length} 个待分析任务`);

      // 2. 逐个分析
      const analyzedTasks = [];
      for (const task of tasks) {
        try {
          const analysis = await this.analyzeTask(task.id, task.title);
          analyzedTasks.push({ id: task.id, analysis });
          Logger.success(`✓ ${task.title}`);
        } catch (error) {
          Logger.error(`✗ ${task.title}: ${error.message}`);
        }
      }

      Logger.success(`已分析 ${analyzedTasks.length} 个任务`);

      return analyzedTasks;
    } catch (error) {
      Logger.error(`任务分析失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 分析单个任务
   */
  async analyzeTask(taskId, taskTitle) {
    Logger.info(`分析任务: ${taskTitle}`);

    try {
      // 1. 加载 Prompt
      const systemPrompt = this.loadPrompt('task-analysis');

      // 2. 调用 AI 分析
      const analysis = await this.aiClient.generateJSONWithRetry(
        systemPrompt,
        `任务ID: ${taskId}\n任务标题: ${taskTitle}`
      );

      // 3. 更新任务属性
      await this.updateTaskProperties(taskId, analysis);

      return analysis;
    } catch (error) {
      Logger.error(`任务分析失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取未分析的任务
   */
  async getUnanalyzedTasks() {
    const projectsDb = this.config.databaseIds?.Projects;
    if (!projectsDb) {
      Logger.warning('Projects 数据库未找到');
      return [];
    }

    try {
      // 获取状态为"计划中"的任务
      const results = await this.notionClient.queryDatabase(
        projectsDb,
        {
          property: '状态',
          select: {
            equals: '计划中',
          },
        },
        [
          {
            property: '创建时间',
            direction: 'descending',
          },
        ]
      );

      return results.slice(0, 10).map((page) => {
        const nameProp = page.properties['名称'];

        return {
          id: page.id,
          title: nameProp?.title?.[0]?.plain_text || '无标题',
        };
      });
    } catch (error) {
      Logger.error(`获取任务失败: ${error.message}`);
      return [];
    }
  }

  /**
   * 加载 Prompt 模板
   */
  loadPrompt(name) {
    try {
      const promptPath = path.join(__dirname, `../../prompts/${name}.txt`);
      return fs.readFileSync(promptPath, 'utf8');
    } catch (error) {
      Logger.error(`Prompt 模板加载失败: ${name}`);
      throw error;
    }
  }

  /**
   * 更新任务属性
   */
  async updateTaskProperties(taskId, analysis) {
    const properties = {};

    // 更新优先级
    if (analysis.importance_score >= 3 && analysis.urgency_score >= 2) {
      properties['优先级'] = {
        select: {
          name: '高',
        },
      };
    } else if (analysis.importance_score >= 2) {
      properties['优先级'] = {
        select: {
          name: '中',
        },
      };
    } else {
      properties['优先级'] = {
        select: {
          name: '低',
        },
      };
    }

    // 添加分类标签
    if (analysis.category && Array.isArray(analysis.category)) {
      properties['标签'] = {
        multi_select: analysis.category.map((cat) => ({ name: cat })),
      };
    }

    await this.notionClient.updatePage(taskId, properties);

    // 如果有子任务建议，追加到页面内容
    if (analysis.subtasks_or_advice) {
      const blocks = [
        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [{ text: { content: 'AI 建议' } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: { content: analysis.subtasks_or_advice },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'callout',
          callout: {
            icon: { emoji: '📊' },
            rich_text: [
              {
                text: {
                  content: `重要性: ${analysis.importance_score}/3 | 紧急性: ${analysis.urgency_score}/3 | 象限: ${this.getQuadrantName(analysis.eisenhower_quadrant)}`,
                },
              },
            ],
          },
        },
      ];

      await this.notionClient.appendBlocks(taskId, blocks);
    }
  }

  /**
   * 获取象限名称
   */
  getQuadrantName(quadrant) {
    const names = {
      1: '象限1-立即做',
      2: '象限2-计划做',
      3: '象限3-委派',
      4: '象限4-删除',
    };
    return names[quadrant] || '未分类';
  }
}

module.exports = TaskAnalyzerAI;
