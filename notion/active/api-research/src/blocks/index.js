const { Client } = require('@notionhq/client');
require('dotenv').config();

/**
 * 内容块操作模块
 * 提供Notion内容块相关的操作方法
 */
class BlockOperations {
  constructor() {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      throw new Error('NOTION_API_KEY environment variable is required. Please check your .env file.');
    }
    this.client = new Client({ auth: apiKey });
  }

  /**
   * 获取块信息
   * @param {string} blockId - 块ID
   * @returns {Promise<Object>} 块信息
   */
  async retrieve(blockId) {
    try {
      if (!blockId) {
        throw new Error('Block ID is required');
      }

      const response = await this.client.blocks.retrieve({
        block_id: blockId,
      });
      return response;
    } catch (error) {
      console.error('Block retrieve failed:', error.message);
      throw error;
    }
  }

  /**
   * 获取块的子块
   * @param {string} blockId - 父块ID
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 子块列表
   */
  async getChildren(blockId, options = {}) {
    try {
      if (!blockId) {
        throw new Error('Block ID is required');
      }

      const queryOptions = {
        block_id: blockId,
        ...options,
      };

      const response = await this.client.blocks.children.list(queryOptions);
      return response;
    } catch (error) {
      console.error('Block children list failed:', error.message);
      throw error;
    }
  }

  /**
   * 追加子块
   * @param {string} blockId - 父块ID
   * @param {Array} children - 子块数组
   * @param {string} after - 在指定块之后插入
   * @returns {Promise<Object>} 操作结果
   */
  async appendChildren(blockId, children, after = null) {
    try {
      if (!blockId) {
        throw new Error('Block ID is required');
      }

      if (!Array.isArray(children) || children.length === 0) {
        throw new Error('Children array is required and cannot be empty');
      }

      const params = {
        block_id: blockId,
        children,
      };

      if (after) {
        params.after = after;
      }

      const response = await this.client.blocks.children.append(params);
      return response;
    } catch (error) {
      console.error('Block children append failed:', error.message);
      throw error;
    }
  }

  /**
   * 更新块
   * @param {string} blockId - 块ID
   * @param {Object} updates - 更新内容
   * @returns {Promise<Object>} 更新结果
   */
  async update(blockId, updates) {
    try {
      if (!blockId) {
        throw new Error('Block ID is required');
      }

      const response = await this.client.blocks.update({
        block_id: blockId,
        ...updates,
      });
      return response;
    } catch (error) {
      console.error('Block update failed:', error.message);
      throw error;
    }
  }

  /**
   * 删除块
   * @param {string} blockId - 块ID
   * @returns {Promise<Object>} 删除结果
   */
  async delete(blockId) {
    try {
      if (!blockId) {
        throw new Error('Block ID is required');
      }

      const response = await this.client.blocks.delete({
        block_id: blockId,
      });
      return response;
    } catch (error) {
      console.error('Block delete failed:', error.message);
      throw error;
    }
  }

  /**
   * 创建段落块
   * @param {string} text - 文本内容
   * @returns {Object} 段落块对象
   */
  createParagraph(text) {
    return {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: text,
            },
          },
        ],
      },
    };
  }

  /**
   * 创建标题块
   * @param {string} text - 标题文本
   * @param {number} level - 标题级别 (1-3)
   * @returns {Object} 标题块对象
   */
  createHeading(text, level = 1) {
    const headingType = `heading_${level}`;
    return {
      object: 'block',
      type: headingType,
      [headingType]: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: text,
            },
          },
        ],
      },
    };
  }

  /**
   * 创建任务块
   * @param {string} text - 任务文本
   * @param {boolean} checked - 是否完成
   * @returns {Object} 任务块对象
   */
  createTodo(text, checked = false) {
    return {
      object: 'block',
      type: 'to_do',
      to_do: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: text,
            },
          },
        ],
        checked,
      },
    };
  }

  /**
   * 创建列表块
   * @param {string} text - 列表项文本
   * @param {boolean} numbered - 是否为编号列表
   * @returns {Object} 列表块对象
   */
  createListItem(text, numbered = false) {
    const listType = numbered ? 'numbered_list_item' : 'bulleted_list_item';
    return {
      object: 'block',
      type: listType,
      [listType]: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: text,
            },
          },
        ],
      },
    };
  }
}

module.exports = {
  BlockOperations,
  blockOps: new BlockOperations(),
};
