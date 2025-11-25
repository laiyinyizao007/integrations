const AIClient = require('./ai-client');
const NotionClient = require('../api/notion-client');
const Logger = require('../utils/logger');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * 任务提取 AI - 从笔记中自动识别待办事项
 */
class TaskExtractionAI {
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
   * 提取任务
   */
  async extract() {
    Logger.section('AI 任务提取');

    try {
      // 1. 获取最近的笔记
      const notes = await this.getRecentNotes();

      if (notes.length === 0) {
        Logger.info('暂无笔记可供提取任务');
        return [];
      }

      Logger.info(`扫描 ${notes.length} 条笔记...`);

      // 2. 准备笔记文本
      const notesText = this.prepareNotesText(notes);

      // 3. 加载 Prompt
      const systemPrompt = this.loadPrompt('task-extraction');

      // 4. 调用 AI 提取任务
      Logger.info('正在提取任务...');
      const result = await this.aiClient.generateJSONWithRetry(
        systemPrompt,
        notesText
      );

      if (!result.tasks || !Array.isArray(result.tasks)) {
        throw new Error('AI 返回格式错误：缺少 tasks 数组');
      }

      Logger.success(`AI 提取完成，发现 ${result.tasks.length} 个任务`);

      // 5. 创建任务
      const createdTasks = [];
      for (const task of result.tasks) {
        const taskId = await this.createTask(task);
        createdTasks.push({ id: taskId, ...task });
      }

      Logger.success(`已创建 ${createdTasks.length} 个任务`);

      return createdTasks;
    } catch (error) {
      Logger.error(`任务提取失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取最近的笔记
   */
  async getRecentNotes() {
    const notesDb = this.config.databaseIds?.Notes;
    if (!notesDb) {
      Logger.warning('Notes 数据库未找到');
      return [];
    }

    try {
      // 获取最近24小时内的笔记
      const results = await this.notionClient.queryDatabase(
        notesDb,
        {},
        [
          {
            property: '创建时间',
            direction: 'descending',
          },
        ]
      );

      // 只取前20条
      return results.slice(0, 20).map((page) => {
        const titleProp = page.properties['标题'] || page.properties['Title'];

        return {
          id: page.id,
          content: titleProp?.title?.[0]?.plain_text || '',
          created_time: page.created_time,
        };
      });
    } catch (error) {
      Logger.error(`获取笔记失败: ${error.message}`);
      return [];
    }
  }

  /**
   * 准备笔记文本
   */
  prepareNotesText(notes) {
    return notes
      .map((note) => {
        return `[NOTE_ITEM]\n内容: ${note.content}\n笔记ID: ${note.id}\n---`;
      })
      .join('\n\n');
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
   * 创建任务
   */
  async createTask(task) {
    const projectsDb = this.config.databaseIds?.Projects;
    if (!projectsDb) {
      throw new Error('Projects 数据库未找到');
    }

    // 生成唯一 ID
    const taskId = crypto.randomUUID();

    const properties = {
      名称: {
        title: [
          {
            text: {
              content: task.title || taskId,
            },
          },
        ],
      },
      状态: {
        select: {
          name: '计划中',
        },
      },
      优先级: {
        select: {
          name: task.priority || '中',
        },
      },
    };

    // 添加分类
    if (task.category) {
      properties['标签'] = {
        multi_select: [{ name: task.category }],
      };
    }

    const page = await this.notionClient.createDatabaseItem(
      projectsDb,
      properties
    );

    return page.id;
  }
}

module.exports = TaskExtractionAI;
