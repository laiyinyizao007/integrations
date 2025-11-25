const { Client } = require('@notionhq/client');
require('dotenv').config();

/**
 * 页面操作模块
 * 提供Notion页面相关的操作方法
 */
class PageOperations {
  constructor() {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      throw new Error('NOTION_API_KEY environment variable is required. Please check your .env file.');
    }
    this.client = new Client({ auth: apiKey });
  }

  /**
   * 创建页面
   * @param {Object} params - 创建参数
   * @returns {Promise<Object>} 创建结果
   */
  async create(params) {
    try {
      const response = await this.client.pages.create(params);
      return response;
    } catch (error) {
      console.error('Page create failed:', error.message);
      throw error;
    }
  }

  /**
   * 获取页面信息
   * @param {string} pageId - 页面ID
   * @param {Object} options - 获取选项
   * @returns {Promise<Object>} 页面信息
   */
  async retrieve(pageId, options = {}) {
    try {
      if (!pageId) {
        throw new Error('Page ID is required');
      }

      const response = await this.client.pages.retrieve({
        page_id: pageId,
        ...options,
      });
      return response;
    } catch (error) {
      console.error('Page retrieve failed:', error.message);
      throw error;
    }
  }

  /**
   * 更新页面
   * @param {string} pageId - 页面ID
   * @param {Object} updates - 更新内容
   * @returns {Promise<Object>} 更新结果
   */
  async update(pageId, updates) {
    try {
      if (!pageId) {
        throw new Error('Page ID is required');
      }

      const response = await this.client.pages.update({
        page_id: pageId,
        ...updates,
      });
      return response;
    } catch (error) {
      console.error('Page update failed:', error.message);
      throw error;
    }
  }

  /**
   * 在数据库中创建页面
   * @param {string} databaseId - 数据库ID
   * @param {Object} properties - 页面属性
   * @param {Array} children - 页面内容块
   * @returns {Promise<Object>} 创建结果
   */
  async createInDatabase(databaseId, properties = {}, children = []) {
    return this.create({
      parent: {
        database_id: databaseId,
      },
      properties,
      children,
    });
  }

  /**
   * 更新页面属性
   * @param {string} pageId - 页面ID
   * @param {Object} properties - 属性更新
   * @returns {Promise<Object>} 更新结果
   */
  async updateProperties(pageId, properties) {
    return this.update(pageId, { properties });
  }

  /**
   * 更新页面图标
   * @param {string} pageId - 页面ID
   * @param {Object} icon - 图标对象
   * @returns {Promise<Object>} 更新结果
   */
  async updateIcon(pageId, icon) {
    return this.update(pageId, { icon });
  }

  /**
   * 更新页面封面
   * @param {string} pageId - 页面ID
   * @param {Object} cover - 封面对象
   * @returns {Promise<Object>} 更新结果
   */
  async updateCover(pageId, cover) {
    return this.update(pageId, { cover });
  }

  /**
   * 归档/取消归档页面
   * @param {string} pageId - 页面ID
   * @param {boolean} archived - 是否归档
   * @returns {Promise<Object>} 更新结果
   */
  async setArchived(pageId, archived = true) {
    return this.update(pageId, { archived });
  }
}

module.exports = {
  PageOperations,
  pageOps: new PageOperations(),
};
