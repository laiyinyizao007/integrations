#!/usr/bin/env node

const NotionClient = require('../src/api/notion-client');
const Logger = require('../src/utils/logger');
const fs = require('fs');
const path = require('path');

class BackupManager {
  constructor() {
    this.client = new NotionClient();
    this.config = this.loadConfig();
    this.backupDir = path.join(__dirname, '../backups', this.getTimestamp());
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

  getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').split('T')[0];
  }

  async run() {
    Logger.section('数据备份');

    try {
      // 创建备份目录
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }

      // 备份所有数据库
      await this.backupAllDatabases();

      Logger.success(`\n备份完成！`);
      Logger.info(`备份位置: ${this.backupDir}`);
    } catch (error) {
      Logger.error(`备份失败: ${error.message}`);
      throw error;
    }
  }

  async backupAllDatabases() {
    const databases = Object.entries(this.config.databaseIds);

    for (const [dbName, dbId] of databases) {
      try {
        Logger.info(`备份 ${dbName}...`);

        const items = await this.client.queryDatabase(dbId);
        const backupData = {
          database: dbName,
          database_id: dbId,
          backup_time: new Date().toISOString(),
          item_count: items.length,
          items: items,
        };

        const filename = `${dbName}.json`;
        const filepath = path.join(this.backupDir, filename);
        fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));

        Logger.success(`✓ ${dbName} (${items.length} 项)`);
      } catch (error) {
        Logger.error(`✗ ${dbName} 备份失败: ${error.message}`);
      }
    }
  }
}

// 运行脚本
if (require.main === module) {
  const backup = new BackupManager();
  backup.run();
}

module.exports = BackupManager;
