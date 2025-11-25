const { pageOps, blockOps } = require('../src');
const { createRichText } = require('../src/utils');

/**
 * 创建Notion页面示例
 * 演示如何在数据库中创建新页面
 */
async function createPage() {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID environment variable is required');
    }

    console.log('正在创建新页面...');

    // 使用工具函数创建富文本
    const titleText = createRichText('测试页面 - ' + new Date().toLocaleString('zh-CN'));
    const headingText = createRichText('API 创建的测试页面');
    const paragraphText = createRichText('这是一个通过 Notion API 创建的测试页面。');
    const timestampText = createRichText(`创建时间: ${new Date().toLocaleString('zh-CN')}`);

    // 使用块操作模块创建内容块
    const children = [
      blockOps.createHeading('API 创建的测试页面', 1),
      blockOps.createParagraph('这是一个通过 Notion API 创建的测试页面。'),
      blockOps.createParagraph(`创建时间: ${new Date().toLocaleString('zh-CN')}`),
      blockOps.createTodo('这是一个通过API添加的任务项'),
    ];

    const response = await pageOps.createInDatabase(databaseId, {
      Name: {
        title: [titleText],
      },
      // 根据你的数据库结构添加其他属性
      // Status: {
      //   select: {
      //     name: '待办'
      //   }
      // },
      // Priority: {
      //   select: {
      //     name: '高'
      //   }
      // },
      // Tags: {
      //   multi_select: [
      //     { name: 'API测试' },
      //     { name: '示例' }
      //   ]
      // }
    }, children);

    console.log('页面创建成功!');
    console.log(`页面ID: ${response.id}`);
    console.log(`页面URL: ${response.url}`);

    return response;

  } catch (error) {
    console.error('创建页面失败:', error.message);
    throw error;
  }
}

// 如果直接运行此文件
if (require.main === module) {
  createPage()
    .then(() => console.log('页面创建完成'))
    .catch(console.error);
}

module.exports = { createPage };
