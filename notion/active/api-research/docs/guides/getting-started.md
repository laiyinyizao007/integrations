# 快速开始指南

本指南将帮助你快速上手 Notion API 研究项目。

## 前置条件

- Node.js 14.0.0 或更高版本
- 一个 Notion 账户
- 基本的 JavaScript 知识

## 步骤 1: 设置 Notion 集成

### 1.1 创建 Notion 集成

1. 访问 [Notion Developers](https://developers.notion.com/)
2. 点击 "Create a new integration"
3. 填写集成信息：
   - **Name**: 你的集成名称（如 "My Notion API Research"）
   - **Associated workspace**: 选择你的工作区
   - **Type**: 选择 "Internal"（内部集成）
4. 点击 "Submit" 创建集成
5. **重要**: 复制生成的 "Internal Integration Token"，这是你的 API 密钥

### 1.2 配置数据库权限

1. 在 Notion 中创建一个新的数据库或使用现有的数据库
2. 点击数据库右上角的 "Share" 按钮
3. 在 "Invite" 字段中搜索你刚创建的集成名称
4. 选择集成并给予适当的权限：
   - 读取权限用于查询数据
   - 写入权限用于创建和更新内容

### 1.3 获取数据库 ID

在浏览器中打开你的数据库，URL 格式如下：
```
https://www.notion.so/workspace/DATABASE_ID?v=VIEW_ID
```

复制 URL 中的 `DATABASE_ID` 部分（36位字符的 UUID）。

## 步骤 2: 项目设置

### 2.1 克隆和安装

```bash
# 进入项目目录
cd notion-api-research

# 安装依赖
npm install
```

### 2.2 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env
```

编辑 `.env` 文件：

```env
NOTION_API_KEY=你的_internal_integration_token
NOTION_DATABASE_ID=你的数据库ID
NOTION_PAGE_ID=你的页面ID（可选，用于测试）
```

## 步骤 3: 运行示例

### 3.1 测试连接

首先运行一个简单的测试来验证配置是否正确：

```bash
# 运行数据库查询示例
npm run query-db
```

如果看到数据库中的页面列表，说明配置成功！

### 3.2 创建测试页面

```bash
# 创建一个新的测试页面
npm run create-page
```

### 3.3 更新页面内容

```bash
# 更新现有页面（需要页面ID）
node examples/update-page.js YOUR_PAGE_ID
```

## 步骤 4: 开发模式

### 4.1 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并监听文件变化
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

### 4.2 使用模块化 API

```javascript
// 在你的代码中导入模块
const { notionAPI, databaseOps, pageOps, blockOps } = require('./src');

// 或者按需导入
const { DatabaseOperations } = require('./src/database');
const dbOps = new DatabaseOperations();

// 查询数据库
const pages = await dbOps.query('your-database-id');

// 创建页面
const newPage = await pageOps.createInDatabase('your-database-id', {
  Name: {
    title: [
      {
        text: {
          content: '新页面标题'
        }
      }
    ]
  }
});
```

## 步骤 5: 故障排除

### 常见问题

#### 1. "NOTION_API_KEY environment variable is required"

**原因**: 未设置环境变量或 `.env` 文件不存在

**解决**:
- 确保 `.env` 文件存在
- 确保 `NOTION_API_KEY` 已正确设置
- 重启你的应用

#### 2. "API token is invalid"

**原因**: API 密钥错误或集成已被删除

**解决**:
- 检查 API 密钥是否正确
- 在 Notion Developers 中确认集成仍然存在
- 重新生成 API 密钥

#### 3. "Database not found" 或 "Page not found"

**原因**: 数据库/页面 ID 错误或权限不足

**解决**:
- 确认 ID 格式正确（36位 UUID）
- 确认集成已被邀请到数据库/页面
- 确认具有适当的权限

#### 4. "Rate limited"

**原因**: API 调用过于频繁

**解决**:
- 添加延迟 between API 调用
- 使用批量操作减少请求次数
- 考虑实现请求队列

### 调试技巧

1. **启用详细日志**:
   ```javascript
   console.log('API Response:', response);
   ```

2. **测试单个 API 调用**:
   ```javascript
   // 在代码中添加 try-catch 块
   try {
     const result = await notionAPI.databases.query({
       database_id: process.env.NOTION_DATABASE_ID
     });
     console.log('Success:', result);
   } catch (error) {
     console.error('Error:', error);
   }
   ```

3. **验证环境变量**:
   ```javascript
   console.log('API Key exists:', !!process.env.NOTION_API_KEY);
   console.log('Database ID exists:', !!process.env.NOTION_DATABASE_ID);
   ```

## 下一步

现在你已经成功设置了 Notion API 研究项目！接下来你可以：

1. **探索更多 API**: 查看 `examples/` 目录中的其他示例
2. **自定义功能**: 根据你的需求修改和扩展代码
3. **学习高级用法**: 研究过滤器、排序和复杂查询
4. **构建应用**: 使用这些模块构建你自己的 Notion 集成应用

## 资源链接

- [Notion API 官方文档](https://developers.notion.com/)
- [Notion API 参考](https://developers.notion.com/reference)
- [JavaScript SDK 文档](https://github.com/makenotion/notion-sdk-js)
