const AIClient = require('./ai-client');
const NotionClient = require('../api/notion-client');
const Logger = require('../utils/logger');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * 笔记聚合 AI - 智能合并和结构化笔记
 */
class NoteAggregationAI {
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
   * 聚合笔记
   * @param {Object} dailySummaryContext - 每日总结上下文（可选）
   */
  async aggregate(dailySummaryContext = null) {
    Logger.section('AI 笔记聚合');

    try {
      // 1. 获取待处理笔记
      const rawNotes = await this.getUnprocessedNotes();

      if (rawNotes.length === 0) {
        Logger.info('暂无待处理笔记');
        return [];
      }

      Logger.info(`发现 ${rawNotes.length} 条待处理笔记`);

      // 2. 准备上下文
      const contextText = dailySummaryContext
        ? `## 今日总结上下文\n${JSON.stringify(dailySummaryContext, null, 2)}\n\n`
        : '';

      // 3. 准备笔记文本
      const notesText = this.prepareNotesText(rawNotes);

      // 4. 加载 Prompt
      const systemPrompt = this.loadPrompt('note-aggregation');
      const fullPrompt = systemPrompt.replace('{{CONTEXT}}', contextText);

      // 5. 调用 AI 聚合
      Logger.info('正在聚合笔记...');
      const result = await this.aiClient.generateJSONWithRetry(
        fullPrompt,
        notesText
      );

      if (!result.notes || !Array.isArray(result.notes)) {
        throw new Error('AI 返回格式错误：缺少 notes 数组');
      }

      Logger.success(`AI 聚合完成，生成 ${result.notes.length} 条结构化笔记`);

      // 6. 创建聚合笔记
      const createdNotes = [];
      for (const note of result.notes) {
        const noteId = await this.createAggregatedNote(note);
        createdNotes.push({ id: noteId, ...note });
      }

      Logger.success(`已创建 ${createdNotes.length} 条聚合笔记`);

      return createdNotes;
    } catch (error) {
      Logger.error(`笔记聚合失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取未处理的笔记
   */
  async getUnprocessedNotes() {
    const inboxDb = this.config.databaseIds?.Inbox;
    if (!inboxDb) {
      Logger.warning('Inbox 数据库未找到');
      return [];
    }

    try {
      const results = await this.notionClient.queryDatabase(
        inboxDb,
        {
          property: '处理状态',
          select: {
            equals: '待处理',
          },
        },
        [
          {
            property: '创建时间',
            direction: 'ascending',
          },
        ]
      );

      return results.map((page) => {
        const contentProp = page.properties['内容'];
        const sourceProp = page.properties['来源'];

        return {
          id: page.id,
          content: contentProp?.title?.[0]?.plain_text || '',
          source: sourceProp?.select?.name || '未知',
          created_time: page.created_time,
        };
      });
    } catch (error) {
      Logger.error(`获取待处理笔记失败: ${error.message}`);
      return [];
    }
  }

  /**
   * 准备笔记文本
   */
  prepareNotesText(notes) {
    return notes
      .map((note, index) => {
        return `[笔记 ${index + 1}]\nID: ${note.id}\n来源: ${note.source}\n时间: ${note.created_time}\n内容: ${note.content}`;
      })
      .join('\n\n---\n\n');
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
   * 创建聚合笔记
   */
  async createAggregatedNote(note) {
    const notesDb = this.config.databaseIds?.Notes;
    if (!notesDb) {
      throw new Error('Notes 数据库未找到');
    }

    // 生成唯一 ID
    const noteId = crypto.randomUUID();

    const properties = {
      标题: {
        title: [
          {
            text: {
              content: note.refined_content?.substring(0, 100) || noteId,
            },
          },
        ],
      },
      类型: {
        select: {
          name: '永久笔记',
        },
      },
      状态: {
        select: {
          name: '已完成',
        },
      },
      分类: {
        select: {
          name: '收件箱',
        },
      },
    };

    // 添加标签
    if (note.tags && Array.isArray(note.tags)) {
      properties['标签'] = {
        multi_select: note.tags.map((tag) => ({ name: tag })),
      };
    }

    // 关联原始笔记
    if (note.source_ids && Array.isArray(note.source_ids)) {
      // 注意：这需要 Notion 数据库中有 relation 属性
      // properties['相关笔记'] = {
      //   relation: note.source_ids.map(id => ({ id }))
      // };
    }

    // 创建页面（内容作为块添加）
    const blocks = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              text: { content: note.refined_content || '' },
            },
          ],
        },
      },
    ];

    const page = await this.notionClient.createDatabaseItem(
      notesDb,
      properties,
      blocks
    );

    // 更新原始 Inbox 项状态
    if (note.source_ids && Array.isArray(note.source_ids)) {
      for (const sourceId of note.source_ids) {
        try {
          await this.notionClient.updatePage(sourceId, {
            处理状态: {
              select: {
                name: '已处理',
              },
            },
          });
        } catch (error) {
          Logger.warning(`更新 Inbox 项 ${sourceId} 失败`);
        }
      }
    }

    return page.id;
  }
}

module.exports = NoteAggregationAI;
