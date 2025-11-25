const { Client } = require('@notionhq/client');
require('dotenv').config();

/**
 * 数据库操作模块
 * 提供Notion数据库相关的操作方法
 */
class DatabaseOperations {
  constructor() {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      throw new Error('NOTION_API_KEY environment variable is required. Please check your .env file.');
    }
    this.client = new Client({ auth: apiKey });
  }

  /**
   * 查询数据库
   * @param {string} databaseId - 数据库ID
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 查询结果
   */
  async query(databaseId, options = {}) {
    try {
      if (!databaseId) {
        throw new Error('Database ID is required');
      }

      const queryOptions = {
        database_id: databaseId,
        ...options,
      };

      const response = await this.client.databases.query(queryOptions);
      return response;
    } catch (error) {
      console.error('Database query failed:', error.message);
      throw error;
    }
  }

  /**
   * 获取数据库信息
   * @param {string} databaseId - 数据库ID
   * @returns {Promise<Object>} 数据库信息
   */
  async retrieve(databaseId) {
    try {
      if (!databaseId) {
        throw new Error('Database ID is required');
      }

      const response = await this.client.databases.retrieve({
        database_id: databaseId,
      });
      return response;
    } catch (error) {
      console.error('Database retrieve failed:', error.message);
      throw error;
    }
  }

  /**
   * 创建数据库
   * @param {Object} params - 创建参数
   * @returns {Promise<Object>} 创建结果
   */
  async create(params) {
    try {
      const response = await this.client.databases.create(params);
      return response;
    } catch (error) {
      console.error('Database create failed:', error.message);
      throw error;
    }
  }

  /**
   * 更新数据库
   * @param {string} databaseId - 数据库ID
   * @param {Object} updates - 更新内容
   * @returns {Promise<Object>} 更新结果
   */
  async update(databaseId, updates) {
    try {
      if (!databaseId) {
        throw new Error('Database ID is required');
      }

      const response = await this.client.databases.update({
        database_id: databaseId,
        ...updates,
      });
      return response;
    } catch (error) {
      console.error('Database update failed:', error.message);
      throw error;
    }
  }

  /**
   * 按条件过滤查询
   * @param {string} databaseId - 数据库ID
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 其他查询选项
   * @returns {Promise<Object>} 查询结果
   */
  async queryWithFilter(databaseId, filter, options = {}) {
    return this.query(databaseId, {
      filter,
      ...options,
    });
  }

  /**
   * 按条件排序查询
   * @param {string} databaseId - 数据库ID
   * @param {Array} sorts - 排序条件
   * @param {Object} options - 其他查询选项
   * @returns {Promise<Object>} 查询结果
   */
  async queryWithSort(databaseId, sorts, options = {}) {
    return this.query(databaseId, {
      sorts,
      ...options,
    });
  }
}

module.exports = {
  DatabaseOperations,
  databaseOps: new DatabaseOperations(),
};
