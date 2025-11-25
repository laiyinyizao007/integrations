const { pageOps, blockOps } = require('../src');
const { createRichText } = require('../src/utils');

/**
 * 更新Notion页面示例
 * 演示如何更新现有页面的属性和内容
 */
async function updatePage(pageId) {
  try {
    if (!pageId) {
      throw new Error('页面ID是必需的');
    }

    console.log(`正在更新页面 ${pageId}...`);

    // 更新页面属性
    const titleText = createRichText('更新的页面标题 - ' + new Date().toLocaleString('zh-CN'));
    const response = await pageOps.updateProperties(pageId, {
      Name: {
        title: [titleText],
      },
      // 更新其他属性示例
      // Status: {
      //   select: {
      //     name: '完成'
      //   }
      // },
      // '最后更新': {
      //   date: {
      //     start: new Date().toISOString()
      //   }
      // }
    });

    console.log('页面属性更新成功!');

    // 添加新的内容块到页面
    const children = [
      blockOps.createHeading('更新内容', 2),
      blockOps.createParagraph(`页面已于 ${new Date().toLocaleString('zh-CN')} 更新`),
      blockOps.createTodo('这是一个通过API添加的任务项'),
    ];

    const blockResponse = await blockOps.appendChildren(pageId, children);

    console.log('页面内容更新成功!');
    console.log(`添加了 ${blockResponse.results.length} 个内容块`);

    return { pageResponse: response, blockResponse };

  } catch (error) {
    console.error('更新页面失败:', error.message);
    throw error;
  }
}

/**
 * 获取页面内容示例
 */
async function getPageContent(pageId) {
  try {
    if (!pageId) {
      throw new Error('页面ID是必需的');
    }

    console.log(`正在获取页面 ${pageId} 的内容...`);

    const response = await blockOps.getChildren(pageId);

    console.log(`页面包含 ${response.results.length} 个内容块:`);
    response.results.forEach((block, index) => {
      console.log(`${index + 1}. ${block.type}: ${block[block.type]?.rich_text?.[0]?.plain_text || '无文本内容'}`);
    });

    return response;

  } catch (error) {
    console.error('获取页面内容失败:', error.message);
    throw error;
  }
}

// 如果直接运行此文件，需要提供页面ID作为参数
if (require.main === module) {
  const pageId = process.argv[2];

  if (!pageId) {
    console.log('用法: node update-page.js <页面ID>');
    console.log('示例: node update-page.js 12345678-1234-1234-1234-123456789012');
    process.exit(1);
  }

  updatePage(pageId)
    .then(() => getPageContent(pageId))
    .then(() => console.log('操作完成'))
    .catch(console.error);
}

module.exports = { updatePage, getPageContent };
