/**
 * Notion API Research - 主入口文件
 *
 * 这个模块提供了完整的Notion API操作功能，
 * 包括数据库、页面、内容块等各种操作。
 */

const { NotionClient, notionClient, getClient } = require('./client');
const { DatabaseOperations, databaseOps } = require('./database');
const { PageOperations, pageOps } = require('./pages');
const { BlockOperations, blockOps } = require('./blocks');
const utils = require('./utils');

/**
 * Notion API 客户端主类
 * 整合所有操作模块，提供统一的API接口
 */
class NotionAPI {
  constructor() {
    this.client = notionClient;
    this.databases = databaseOps;
    this.pages = pageOps;
    this.blocks = blockOps;
    this.utils = utils;
  }

  /**
   * 测试API连接
   * @returns {Promise<boolean>} 连接是否成功
   */
  async testConnection() {
    return this.client.testConnection();
  }

  /**
   * 获取原始客户端实例（高级用法）
   * @returns {Client} Notion客户端实例
   */
  getRawClient() {
    return this.client.getClient();
  }
}

// 创建默认实例
const notionAPI = new NotionAPI();

module.exports = {
  // 主类和实例
  NotionAPI,
  notionAPI,

  // 单独的模块导出（方便按需导入）
  NotionClient,
  DatabaseOperations,
  PageOperations,
  BlockOperations,

  // 预实例化的操作对象
  databaseOps,
  pageOps,
  blockOps,

  // 工具函数
  utils,

  // 便捷函数
  getClient,
};
