const { Client } = require('@notionhq/client');
require('dotenv').config();

/**
 * Notion API 客户端类
 * 提供统一的Notion API访问接口
 */
class NotionClient {
  constructor() {
    this.client = null;
    this.initialize();
  }

  /**
   * 初始化Notion客户端
   */
  initialize() {
    const apiKey = process.env.NOTION_API_KEY;

    if (!apiKey) {
      throw new Error('NOTION_API_KEY environment variable is required. Please check your .env file.');
    }

    this.client = new Client({
      auth: apiKey,
    });
  }

  /**
   * 获取Notion客户端实例
   * @returns {Client} Notion API客户端实例
   */
  getClient() {
    if (!this.client) {
      throw new Error('Notion client not initialized');
    }
    return this.client;
  }

  /**
   * 测试API连接
   * @returns {Promise<boolean>} 连接是否成功
   */
  async testConnection() {
    try {
      // 尝试获取用户信息来测试连接
      await this.client.users.list();
      return true;
    } catch (error) {
      console.error('Notion API connection test failed:', error.message);
      return false;
    }
  }
}

// 创建单例实例
const notionClient = new NotionClient();

module.exports = {
  NotionClient,
  notionClient,
  getClient: () => notionClient.getClient(),
};
