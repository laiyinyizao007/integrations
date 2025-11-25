#!/usr/bin/env node

const NotionClient = require('../src/api/notion-client');
const Logger = require('../src/utils/logger');
const fs = require('fs');
const path = require('path');

class AutoArchiver {
  constructor() {
    this.client = new NotionClient();
    this.config = this.loadConfig();
    this.archiveThresholdDays = parseInt(process.env.AUTO_ARCHIVE_DAYS) || 30;
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

  async run() {
    Logger.section('自动归档');

    try {
      // 归档已完成的项目
      await this.archiveCompletedProjects();

      Logger.success('\n归档完成！');
    } catch (error) {
      Logger.error(`归档失败: ${error.message}`);
      throw error;
    }
  }

  async archiveCompletedProjects() {
    Logger.info('检查已完成的项目...');

    const projectsDb = this.config.databaseIds.Projects;
    const archivesDb = this.config.databaseIds.Archives;

    if (!projectsDb || !archivesDb) {
      Logger.warning('Projects 或 Archives 数据库未找到');
      return;
    }

    try {
      // 查询已完成的项目
      const completedProjects = await this.client.queryDatabase(projectsDb, {
        property: '状态',
        select: {
          equals: '已完成',
        },
      });

      if (completedProjects.length === 0) {
        Logger.info('没有需要归档的项目');
        return;
      }

      Logger.info(`找到 ${completedProjects.length} 个已完成项目`);

      for (const project of completedProjects) {
        const title = project.properties['名称']?.title?.[0]?.plain_text || '无标题';

        // 检查完成日期
        const lastEditedTime = new Date(project.last_edited_time);
        const daysSinceCompleted = Math.floor(
          (Date.now() - lastEditedTime.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceCompleted >= this.archiveThresholdDays) {
          Logger.info(`归档项目: ${title} (已完成 ${daysSinceCompleted} 天)`);

          // 创建归档记录
          await this.client.createDatabaseItem(archivesDb, {
            名称: {
              title: [
                {
                  text: {
                    content: title,
                  },
                },
              ],
            },
            原分类: {
              select: {
                name: '项目',
              },
            },
            归档原因: {
              select: {
                name: '已完成',
              },
            },
            归档日期: {
              date: {
                start: new Date().toISOString().split('T')[0],
              },
            },
          });

          // 可选: 删除原项目（或者保留，根据需求）
          // await this.client.updatePage(project.id, { archived: true });

          Logger.success(`✓ ${title}`);
        }
      }
    } catch (error) {
      Logger.error(`归档项目时出错: ${error.message}`);
      throw error;
    }
  }
}

// 运行脚本
if (require.main === module) {
  const archiver = new AutoArchiver();
  archiver.run();
}

module.exports = AutoArchiver;
