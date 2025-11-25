const { Client } = require('@notionhq/client');
require('dotenv').config();

/**
 * 搜索所有可用的页面和数据库
 */
async function searchAll() {
  try {
    const client = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    console.log('正在搜索所有页面和数据库...');

    // 搜索所有内容（页面和数据库）
    const response = await client.search({
      query: '', // 空查询返回所有内容
      filter: {
        value: 'page_or_database',
        property: 'object'
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time'
      }
    });

    console.log(`\n找到 ${response.results.length} 个项目:\n`);

    const pages = [];
    const databases = [];

    response.results.forEach((item, index) => {
      const title = item.properties?.Name?.title?.[0]?.plain_text || 
                   item.properties?.title?.title?.[0]?.plain_text ||
                   item.title?.[0]?.plain_text ||
                   '无标题';

      console.log(`${index + 1}. [${item.object.toUpperCase()}] ${title}`);
      console.log(`   ID: ${item.id}`);
      console.log(`   URL: ${item.url}`);
      console.log(`   最后编辑: ${item.last_edited_time}`);
      console.log('');

      if (item.object === 'page') {
        pages.push({
          id: item.id,
          title: title,
          url: item.url,
          lastEdited: item.last_edited_time
        });
      } else if (item.object === 'database') {
        databases.push({
          id: item.id,
          title: title,
          url: item.url,
          lastEdited: item.last_edited_time
        });
      }
    });

    console.log(`\n总结:`);
    console.log(`- 页面数量: ${pages.length}`);
    console.log(`- 数据库数量: ${databases.length}`);

    return { pages, databases, total: response.results.length };

  } catch (error) {
    console.error('搜索失败:', error.message);
    throw error;
  }
}

// 如果直接运行此文件
if (require.main === module) {
  searchAll()
    .then((result) => {
      console.log('\n搜索完成');
      console.log(`总共找到 ${result.total} 个项目`);
    })
    .catch(console.error);
}

module.exports = { searchAll };
