const { databaseOps } = require('../src');

/**
 * 查询Notion数据库示例
 * 演示如何查询数据库中的页面
 */
async function queryDatabase() {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID environment variable is required');
    }

    console.log('正在查询数据库...');

    const response = await databaseOps.query(databaseId, {
      // 可以添加过滤器和排序
      // filter: {
      //   property: 'Status',
      //   select: {
      //     equals: 'In Progress'
      //   }
      // },
      // sorts: [
      //   {
      //     property: 'Created',
      //     direction: 'descending'
      //   }
      // ]
    });

    console.log(`找到 ${response.results.length} 个页面:`);
    response.results.forEach((page, index) => {
      console.log(`${index + 1}. ${page.properties.Name?.title?.[0]?.plain_text || '无标题'}`);
      console.log(`   ID: ${page.id}`);
      console.log(`   创建时间: ${page.created_time}`);
      console.log('');
    });

    return response;

  } catch (error) {
    console.error('查询数据库失败:', error.message);
    throw error;
  }
}

// 如果直接运行此文件
if (require.main === module) {
  queryDatabase()
    .then(() => console.log('查询完成'))
    .catch(console.error);
}

module.exports = { queryDatabase };
