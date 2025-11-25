#!/usr/bin/env node

const cron = require('node-cron');
const Logger = require('../src/utils/logger');
const DailyNoteCreator = require('./daily-note');
const AutoArchiver = require('./auto-archive');
const BackupManager = require('./backup');
require('dotenv').config();

class AutomationRunner {
  constructor() {
    this.tasks = [];
  }

  start() {
    Logger.section('启动自动化任务');

    // 每日笔记 - 每天早上9点（或自定义时间）
    if (process.env.DAILY_NOTE_ENABLED !== 'false') {
      const dailyNoteTime = process.env.DAILY_NOTE_TIME || '09:00';
      const [hour, minute] = dailyNoteTime.split(':');

      const dailyNoteTask = cron.schedule(`${minute} ${hour} * * *`, async () => {
        Logger.info('执行每日笔记创建任务...');
        try {
          const creator = new DailyNoteCreator();
          await creator.create();
        } catch (error) {
          Logger.error(`每日笔记创建失败: ${error.message}`);
        }
      });

      this.tasks.push({ name: '每日笔记', schedule: `每天 ${dailyNoteTime}`, task: dailyNoteTask });
      Logger.success(`✓ 每日笔记任务已启动 (每天 ${dailyNoteTime})`);
    }

    // 自动归档 - 每周日晚上8点
    if (process.env.AUTO_ARCHIVE_ENABLED !== 'false') {
      const archiveTask = cron.schedule('0 20 * * 0', async () => {
        Logger.info('执行自动归档任务...');
        try {
          const archiver = new AutoArchiver();
          await archiver.run();
        } catch (error) {
          Logger.error(`自动归档失败: ${error.message}`);
        }
      });

      this.tasks.push({ name: '自动归档', schedule: '每周日 20:00', task: archiveTask });
      Logger.success('✓ 自动归档任务已启动 (每周日 20:00)');
    }

    // 自动备份 - 每天凌晨2点
    if (process.env.BACKUP_ENABLED !== 'false') {
      const backupSchedule = process.env.BACKUP_SCHEDULE || '0 2 * * *';

      const backupTask = cron.schedule(backupSchedule, async () => {
        Logger.info('执行自动备份任务...');
        try {
          const backup = new BackupManager();
          await backup.run();
        } catch (error) {
          Logger.error(`自动备份失败: ${error.message}`);
        }
      });

      this.tasks.push({ name: '自动备份', schedule: '每天 02:00', task: backupTask });
      Logger.success('✓ 自动备份任务已启动 (每天 02:00)');
    }

    if (this.tasks.length === 0) {
      Logger.warning('没有启用的自动化任务');
      Logger.info('请检查 .env 文件中的配置');
      return;
    }

    Logger.log('\n所有自动化任务已启动，按 Ctrl+C 停止\n');

    // 保持进程运行
    process.on('SIGINT', () => {
      Logger.warning('\n正在停止所有任务...');
      this.tasks.forEach(({ name, task }) => {
        task.stop();
        Logger.info(`✓ ${name} 已停止`);
      });
      Logger.success('所有任务已停止');
      process.exit(0);
    });
  }

  showSchedule() {
    Logger.section('已启动的自动化任务');
    this.tasks.forEach(({ name, schedule }) => {
      Logger.log(`  ${name}: ${schedule}`);
    });
  }
}

// 运行自动化
if (require.main === module) {
  const runner = new AutomationRunner();
  runner.start();
  runner.showSchedule();
}

module.exports = AutomationRunner;
