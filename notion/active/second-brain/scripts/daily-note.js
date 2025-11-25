#!/usr/bin/env node

const NotionClient = require('../src/api/notion-client');
const DateHelper = require('../src/utils/date-helper');
const Logger = require('../src/utils/logger');
const fs = require('fs');
const path = require('path');

const templatesConfig = require('../config/templates.json');

class DailyNoteCreator {
  constructor() {
    this.client = new NotionClient();
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, '../.notion-config.json');
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      Logger.error('配置文件未找到，请先运行 npm run setup');
      process.exit(1);
    }
  }

  async create() {
    Logger.section('创建每日笔记');

    const today = DateHelper.getToday();
    const todayChinese = DateHelper.formatChinese();
    const weekday = DateHelper.getWeekday();

    try {
      // 检查今日笔记是否已存在
      const existing = await this.checkExisting(today);
      if (existing) {
        Logger.warning(`今日笔记已存在: ${today}`);
        Logger.info(`页面 ID: ${existing.id}`);
        return;
      }

      // 创建每日笔记
      Logger.info(`创建笔记: ${todayChinese}`);

      const dailyNoteDb = this.config.databaseIds.Daily_Notes;
      if (!dailyNoteDb) {
        throw new Error('Daily_Notes 数据库 ID 未找到');
      }

      const template = templatesConfig.templates.daily_note;
      const page = await this.client.createDatabaseItem(
        dailyNoteDb,
        {
          日期: {
            title: [
              {
                text: {
                  content: todayChinese,
                },
              },
            ],
          },
          星期: {
            select: {
              name: weekday,
            },
          },
        },
        template.content.children
      );

      Logger.success(`每日笔记创建成功！`);
      Logger.info(`页面 ID: ${page.id}`);
      Logger.info(`日期: ${todayChinese}`);
    } catch (error) {
      Logger.error(`创建失败: ${error.message}`);
      throw error;
    }
  }

  async checkExisting(date) {
    try {
      const dailyNoteDb = this.config.databaseIds.Daily_Notes;
      const results = await this.client.queryDatabase(dailyNoteDb, {
        property: '日期',
        title: {
          contains: date,
        },
      });
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      return null;
    }
  }
}

// 运行脚本
if (require.main === module) {
  const creator = new DailyNoteCreator();
  creator.create();
}

module.exports = DailyNoteCreator;
