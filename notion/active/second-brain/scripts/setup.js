#!/usr/bin/env node

const NotionClient = require('../src/api/notion-client');
const Logger = require('../src/utils/logger');
const ora = require('ora');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const paraConfig = require('../config/para.json');

class SetupWizard {
  constructor() {
    this.client = new NotionClient();
    this.config = {
      rootPageId: null,
      databaseIds: {},
    };
  }

  async run() {
    Logger.section('Notion 第二大脑系统 - 初始化向导');

    try {
      // 步骤 1: 欢迎和确认
      await this.welcome();

      // 步骤 2: 获取根页面 ID
      await this.getRootPage();

      // 步骤 3: 创建 PARA 结构
      await this.createPARAStructure();

      // 步骤 4: 创建数据库
      await this.createDatabases();

      // 步骤 5: 创建仪表盘
      await this.createDashboard();

      // 步骤 6: 保存配置
      await this.saveConfig();

      Logger.success('\n初始化完成！');
      Logger.info('\n接下来你可以：');
      Logger.log('  1. 运行 npm run daily-note 创建每日笔记');
      Logger.log('  2. 访问 Notion 查看创建的结构');
      Logger.log('  3. 阅读 docs/setup-guide.md 了解更多');
    } catch (error) {
      Logger.error(`\n初始化失败: ${error.message}`);
      process.exit(1);
    }
  }

  async welcome() {
    Logger.log('欢迎使用 Notion 第二大脑系统！\n');
    Logger.log('本向导将帮助你：');
    Logger.log('  ✓ 创建 PARA 方法的四大分类');
    Logger.log('  ✓ 设置核心数据库（笔记、资源、项目等）');
    Logger.log('  ✓ 创建仪表盘和模板\n');

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: '准备好开始了吗？',
        default: true,
      },
    ]);

    if (!confirm) {
      Logger.warning('初始化已取消');
      process.exit(0);
    }
  }

  async getRootPage() {
    Logger.log('\n请提供一个 Notion 页面 ID 作为根页面（所有内容将创建在此页面下）');
    Logger.info('提示: 打开 Notion 页面，URL 中的 32 位字符串就是页面 ID');
    Logger.info('例如: https://notion.so/My-Page-123abc... 中的 123abc...\n');

    const { pageId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'pageId',
        message: '根页面 ID:',
        validate: (input) => {
          if (!input || input.length < 32) {
            return '请输入有效的页面 ID';
          }
          return true;
        },
      },
    ]);

    // 移除可能的连字符
    this.config.rootPageId = pageId.replace(/-/g, '');

    // 验证页面是否可访问
    const spinner = ora('验证页面访问权限...').start();
    try {
      await this.client.getPage(this.config.rootPageId);
      spinner.succeed('页面验证成功');
    } catch (error) {
      spinner.fail('页面访问失败');
      Logger.error('请确保：');
      Logger.log('  1. 页面 ID 正确');
      Logger.log('  2. 已在 Notion 中授权此 Integration 访问该页面');
      throw error;
    }
  }

  async createPARAStructure() {
    Logger.section('创建 PARA 结构');

    const paraCategories = ['Projects', 'Areas', 'Resources', 'Archives'];

    for (const category of paraCategories) {
      const spinner = ora(`创建 ${category} 页面...`).start();
      try {
        const config = paraConfig.structure[category];
        const page = await this.client.createPage(
          this.config.rootPageId,
          category,
          config.icon,
          {},
          [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: config.description,
                    },
                  },
                ],
              },
            },
          ]
        );
        this.config[`${category.toLowerCase()}PageId`] = page.id;
        spinner.succeed(`${category} 页面创建成功`);
        await this.delay(350); // 避免 API 速率限制
      } catch (error) {
        spinner.fail(`${category} 页面创建失败`);
        throw error;
      }
    }
  }

  async createDatabases() {
    Logger.section('创建核心数据库');

    // 创建 PARA 数据库
    const paraCategories = ['Projects', 'Areas', 'Resources', 'Archives'];
    for (const category of paraCategories) {
      await this.createDatabase(category, paraConfig.structure[category]);
    }

    // 创建附加数据库
    const additionalDbs = ['Notes', 'Inbox', 'Daily_Notes'];
    for (const dbName of additionalDbs) {
      await this.createDatabase(dbName, paraConfig.additional_databases[dbName]);
    }
  }

  async createDatabase(name, config) {
    const spinner = ora(`创建 ${name} 数据库...`).start();
    try {
      const properties = this.buildProperties(config.properties);
      const database = await this.client.createDatabase(
        this.config.rootPageId,
        name,
        config.icon,
        properties
      );
      this.config.databaseIds[name] = database.id;
      spinner.succeed(`${name} 数据库创建成功`);
      await this.delay(350);
    } catch (error) {
      spinner.fail(`${name} 数据库创建失败`);
      throw error;
    }
  }

  buildProperties(propertiesConfig) {
    const properties = {};

    for (const [propName, propConfig] of Object.entries(propertiesConfig)) {
      switch (propConfig.type) {
        case 'title':
          properties[propName] = { title: {} };
          break;
        case 'rich_text':
          properties[propName] = { rich_text: {} };
          break;
        case 'number':
          properties[propName] = {
            number: propConfig.format ? { format: propConfig.format } : {},
          };
          break;
        case 'select':
          properties[propName] = {
            select: {
              options: propConfig.options || [],
            },
          };
          break;
        case 'multi_select':
          properties[propName] = {
            multi_select: {
              options: [],
            },
          };
          break;
        case 'date':
          properties[propName] = { date: {} };
          break;
        case 'url':
          properties[propName] = { url: {} };
          break;
        case 'created_time':
          properties[propName] = { created_time: {} };
          break;
        case 'last_edited_time':
          properties[propName] = { last_edited_time: {} };
          break;
        case 'relation':
          // 关系属性需要在所有数据库创建后再建立
          break;
      }
    }

    return properties;
  }

  async createDashboard() {
    Logger.section('创建仪表盘');

    const spinner = ora('创建仪表盘页面...').start();
    try {
      const dashboardBlocks = [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: '🏠 我的第二大脑' } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: '欢迎来到你的知识管理中心！',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ text: { content: '📥 快速收集' } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: 'Inbox 数据库链接将在这里',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ text: { content: '🎯 当前项目' } }],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ text: { content: '📝 最近笔记' } }],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ text: { content: '🔗 快速链接' } }],
          },
        },
      ];

      const dashboard = await this.client.createPage(
        this.config.rootPageId,
        '仪表盘',
        '🏠',
        {},
        dashboardBlocks
      );
      this.config.dashboardPageId = dashboard.id;
      spinner.succeed('仪表盘创建成功');
    } catch (error) {
      spinner.fail('仪表盘创建失败');
      throw error;
    }
  }

  async saveConfig() {
    const spinner = ora('保存配置...').start();
    try {
      const configPath = path.join(__dirname, '../.notion-config.json');
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
      spinner.succeed('配置已保存到 .notion-config.json');
    } catch (error) {
      spinner.fail('配置保存失败');
      throw error;
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// 运行向导
if (require.main === module) {
  const wizard = new SetupWizard();
  wizard.run();
}

module.exports = SetupWizard;
