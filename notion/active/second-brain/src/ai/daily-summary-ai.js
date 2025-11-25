const AIClient = require('./ai-client');
const NotionClient = require('../api/notion-client');
const DateHelper = require('../utils/date-helper');
const Logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

/**
 * 每日总结 AI - 生成宏观洞察和建议
 */
class DailySummaryAI {
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
   * 生成每日总结
   * @param {string} date - 日期（可选，默认今天）
   */
  async generate(date = null) {
    Logger.section('AI 每日总结生成');

    try {
      const targetDate = date || DateHelper.getToday();
      Logger.info(`目标日期: ${targetDate}`);

      // 1. 收集当天所有笔记
      const notes = await this.collectDailyNotes(targetDate);

      if (notes.length === 0) {
        Logger.warning('今日暂无笔记，跳过总结生成');
        return null;
      }

      Logger.info(`收集到 ${notes.length} 条笔记`);

      // 2. 合并笔记内容
      const combinedText = this.combineNotes(notes);

      // 3. 加载 Prompt
      const systemPrompt = this.loadPrompt('daily-summary');

      // 4. 调用 AI 生成总结
      Logger.info('正在生成每日总结...');
      const summary = await this.aiClient.generateJSONWithRetry(
        systemPrompt,
        combinedText
      );

      Logger.success('AI 总结生成成功');

      // 5. 创建 Notion 页面
      const pageId = await this.createDailySummaryPage(targetDate, summary);

      Logger.success(`每日总结已创建: ${pageId}`);

      return {
        date: targetDate,
        pageId: pageId,
        summary: summary,
      };
    } catch (error) {
      Logger.error(`每日总结生成失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 收集当天的所有笔记
   */
  async collectDailyNotes(date) {
    const notesDb = this.config.databaseIds?.Notes;
    if (!notesDb) {
      Logger.warning('Notes 数据库未找到');
      return [];
    }

    try {
      // 查询当天创建的笔记
      const results = await this.notionClient.queryDatabase(
        notesDb,
        {
          property: '创建时间',
          date: {
            equals: date,
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
        const titleProp = page.properties['标题'] || page.properties['Title'];
        const typeProp = page.properties['类型'];
        const statusProp = page.properties['状态'];

        return {
          id: page.id,
          title: titleProp?.title?.[0]?.plain_text || '无标题',
          type: typeProp?.select?.name || '未分类',
          status: statusProp?.select?.name || '',
          created_time: page.created_time,
        };
      });
    } catch (error) {
      Logger.error(`收集笔记失败: ${error.message}`);
      return [];
    }
  }

  /**
   * 合并笔记内容
   */
  combineNotes(notes) {
    return notes
      .map((note, index) => {
        return `--- 笔记 ${index + 1} [${note.type}] ${note.created_time} (ID: ${note.id}) ---\n${note.title}`;
      })
      .join('\n\n========================\n\n');
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
   * 创建每日总结 Notion 页面
   */
  async createDailySummaryPage(date, summary) {
    // 如果没有 Daily_Insights 数据库，使用根页面
    const dbId =
      this.config.databaseIds?.Daily_Insights || this.config.rootPageId;

    // 构建页面内容块
    const blocks = [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '📊 今日总结' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: summary.daily_summary || '' } }],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '🎯 核心主题' } }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              text: { content: (summary.core_themes || []).join(', ') },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '🧠 思考与行动分析' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: summary.mindset_analysis || '' } }],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '✨ 主要亮点' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: summary.main_highlight || '' } }],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '⚠️ 需警惕的盲点' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: summary.main_blindspot || '' } }],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '🎬 行动建议' } }],
        },
      },
    ];

    // 添加行动建议列表
    if (summary.mentor_action_plan && Array.isArray(summary.mentor_action_plan)) {
      summary.mentor_action_plan.forEach((action) => {
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: action } }],
          },
        });
      });
    }

    // 添加每日金句
    blocks.push({
      object: 'block',
      type: 'divider',
      divider: {},
    });
    blocks.push({
      object: 'block',
      type: 'quote',
      quote: {
        rich_text: [{ text: { content: summary.daily_mantra || '' } }],
      },
    });

    // 创建页面
    const page = await this.notionClient.createPage(
      dbId,
      `${DateHelper.formatChinese(new Date(date))} - 每日总结`,
      '🌟',
      {},
      blocks
    );

    return page.id;
  }
}

module.exports = DailySummaryAI;
