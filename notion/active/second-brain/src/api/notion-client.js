const { Client } = require('@notionhq/client');
require('dotenv').config();

class NotionClient {
  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_API_TOKEN,
    });
  }

  /**
   * 创建数据库
   */
  async createDatabase(parentPageId, title, icon, properties) {
    try {
      const response = await this.client.databases.create({
        parent: {
          type: 'page_id',
          page_id: parentPageId,
        },
        icon: {
          type: 'emoji',
          emoji: icon,
        },
        title: [
          {
            type: 'text',
            text: {
              content: title,
            },
          },
        ],
        properties: properties,
      });
      return response;
    } catch (error) {
      console.error(`创建数据库失败: ${title}`, error.message);
      throw error;
    }
  }

  /**
   * 创建页面
   */
  async createPage(parentId, title, icon, properties = {}, children = []) {
    try {
      const response = await this.client.pages.create({
        parent: {
          type: 'page_id',
          page_id: parentId,
        },
        icon: {
          type: 'emoji',
          emoji: icon,
        },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
          ...properties,
        },
        children: children,
      });
      return response;
    } catch (error) {
      console.error(`创建页面失败: ${title}`, error.message);
      throw error;
    }
  }

  /**
   * 创建数据库记录
   */
  async createDatabaseItem(databaseId, properties, children = []) {
    try {
      const response = await this.client.pages.create({
        parent: {
          type: 'database_id',
          database_id: databaseId,
        },
        properties: properties,
        children: children,
      });
      return response;
    } catch (error) {
      console.error('创建数据库记录失败', error.message);
      throw error;
    }
  }

  /**
   * 查询数据库
   */
  async queryDatabase(databaseId, filter = {}, sorts = []) {
    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: filter,
        sorts: sorts,
      });
      return response.results;
    } catch (error) {
      console.error('查询数据库失败', error.message);
      throw error;
    }
  }

  /**
   * 更新页面
   */
  async updatePage(pageId, properties) {
    try {
      const response = await this.client.pages.update({
        page_id: pageId,
        properties: properties,
      });
      return response;
    } catch (error) {
      console.error('更新页面失败', error.message);
      throw error;
    }
  }

  /**
   * 追加块内容
   */
  async appendBlocks(blockId, children) {
    try {
      const response = await this.client.blocks.children.append({
        block_id: blockId,
        children: children,
      });
      return response;
    } catch (error) {
      console.error('追加内容失败', error.message);
      throw error;
    }
  }

  /**
   * 获取页面内容
   */
  async getPage(pageId) {
    try {
      const response = await this.client.pages.retrieve({
        page_id: pageId,
      });
      return response;
    } catch (error) {
      console.error('获取页面失败', error.message);
      throw error;
    }
  }

  /**
   * 获取块内容
   */
  async getBlocks(blockId) {
    try {
      const response = await this.client.blocks.children.list({
        block_id: blockId,
      });
      return response.results;
    } catch (error) {
      console.error('获取块内容失败', error.message);
      throw error;
    }
  }

  /**
   * 搜索
   */
  async search(query, filter = {}) {
    try {
      const response = await this.client.search({
        query: query,
        filter: filter,
      });
      return response.results;
    } catch (error) {
      console.error('搜索失败', error.message);
      throw error;
    }
  }
}

module.exports = NotionClient;
