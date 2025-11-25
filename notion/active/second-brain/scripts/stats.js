#!/usr/bin/env node

const NotionClient = require('../src/api/notion-client');
const Logger = require('../src/utils/logger');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

class StatsGenerator {
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

  async run() {
    Logger.section('统计报告');

    try {
      const stats = {
        projects: await this.getProjectStats(),
        notes: await this.getNoteStats(),
        resources: await this.getResourceStats(),
        inbox: await this.getInboxStats(),
        dailyNotes: await this.getDailyNoteStats(),
      };

      this.displayStats(stats);
    } catch (error) {
      Logger.error(`生成统计失败: ${error.message}`);
      throw error;
    }
  }

  async getProjectStats() {
    const projectsDb = this.config.databaseIds.Projects;
    if (!projectsDb) return null;

    const allProjects = await this.client.queryDatabase(projectsDb);
    const statusCount = {};

    allProjects.forEach((project) => {
      const status = project.properties['状态']?.select?.name || '未知';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return {
      total: allProjects.length,
      byStatus: statusCount,
    };
  }

  async getNoteStats() {
    const notesDb = this.config.databaseIds.Notes;
    if (!notesDb) return null;

    const allNotes = await this.client.queryDatabase(notesDb);
    const typeCount = {};

    allNotes.forEach((note) => {
      const type = note.properties['类型']?.select?.name || '未知';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return {
      total: allNotes.length,
      byType: typeCount,
    };
  }

  async getResourceStats() {
    const resourcesDb = this.config.databaseIds.Resources;
    if (!resourcesDb) return null;

    const allResources = await this.client.queryDatabase(resourcesDb);
    const typeCount = {};
    const statusCount = {};

    allResources.forEach((resource) => {
      const type = resource.properties['类型']?.select?.name || '未知';
      const status = resource.properties['阅读状态']?.select?.name || '未知';
      typeCount[type] = (typeCount[type] || 0) + 1;
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return {
      total: allResources.length,
      byType: typeCount,
      byStatus: statusCount,
    };
  }

  async getInboxStats() {
    const inboxDb = this.config.databaseIds.Inbox;
    if (!inboxDb) return null;

    const allItems = await this.client.queryDatabase(inboxDb);
    const statusCount = {};

    allItems.forEach((item) => {
      const status = item.properties['处理状态']?.select?.name || '未知';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return {
      total: allItems.length,
      byStatus: statusCount,
    };
  }

  async getDailyNoteStats() {
    const dailyNotesDb = this.config.databaseIds.Daily_Notes;
    if (!dailyNotesDb) return null;

    const allNotes = await this.client.queryDatabase(dailyNotesDb);

    return {
      total: allNotes.length,
    };
  }

  displayStats(stats) {
    console.log(chalk.bold('\n📊 数据统计\n'));

    // 项目统计
    if (stats.projects) {
      console.log(chalk.bold.cyan('🎯 项目'));
      console.log(`   总数: ${chalk.yellow(stats.projects.total)}`);
      Object.entries(stats.projects.byStatus).forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`);
      });
      console.log();
    }

    // 笔记统计
    if (stats.notes) {
      console.log(chalk.bold.cyan('📝 笔记'));
      console.log(`   总数: ${chalk.yellow(stats.notes.total)}`);
      Object.entries(stats.notes.byType).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
      console.log();
    }

    // 资源统计
    if (stats.resources) {
      console.log(chalk.bold.cyan('📚 资源'));
      console.log(`   总数: ${chalk.yellow(stats.resources.total)}`);
      console.log('   按类型:');
      Object.entries(stats.resources.byType).forEach(([type, count]) => {
        console.log(`     ${type}: ${count}`);
      });
      console.log('   按阅读状态:');
      Object.entries(stats.resources.byStatus).forEach(([status, count]) => {
        console.log(`     ${status}: ${count}`);
      });
      console.log();
    }

    // Inbox 统计
    if (stats.inbox) {
      console.log(chalk.bold.cyan('📥 收件箱'));
      console.log(`   总数: ${chalk.yellow(stats.inbox.total)}`);
      Object.entries(stats.inbox.byStatus).forEach(([status, count]) => {
        const color = status === '待处理' ? 'red' : 'green';
        console.log(`   ${status}: ${chalk[color](count)}`);
      });
      console.log();
    }

    // 每日笔记统计
    if (stats.dailyNotes) {
      console.log(chalk.bold.cyan('📅 每日笔记'));
      console.log(`   总数: ${chalk.yellow(stats.dailyNotes.total)}`);
      console.log();
    }

    // 总结
    console.log(chalk.bold.green('✨ 总结'));
    const totalItems =
      (stats.projects?.total || 0) +
      (stats.notes?.total || 0) +
      (stats.resources?.total || 0);
    console.log(`   知识库总条目: ${chalk.yellow(totalItems)}`);

    const pendingInbox = stats.inbox?.byStatus['待处理'] || 0;
    if (pendingInbox > 0) {
      console.log(
        chalk.yellow(`   ⚠️  待处理收件箱: ${pendingInbox} 项，记得及时整理！`)
      );
    } else {
      console.log(chalk.green('   ✓ 收件箱已清空，干得好！'));
    }
    console.log();
  }
}

// 运行脚本
if (require.main === module) {
  const stats = new StatsGenerator();
  stats.run();
}

module.exports = StatsGenerator;
