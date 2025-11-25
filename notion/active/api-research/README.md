# Notion API 研究项目

这个项目用于研究和学习如何使用 Notion API 进行各种操作，包括查询数据库、创建页面、更新页面内容等。

## 📋 项目状态

- **版本**: v1.0.0 (稳定版)
- **最后更新**: 2025-11-08
- **MCP集成**: ✅ 已配置并测试通过
- **可用资源**: 1个数据库，1个页面

## 项目结构

```
notion-api-research/
├── src/                      # 源代码目录
│   ├── client/               # 客户端模块
│   │   └── index.js          # Notion 客户端初始化
│   ├── database/             # 数据库操作模块
│   │   └── index.js          # 数据库相关操作
│   ├── pages/                # 页面操作模块
│   │   └── index.js          # 页面相关操作
│   ├── blocks/               # 内容块操作模块
│   │   └── index.js          # 内容块相关操作
│   ├── utils/                # 工具函数库
│   │   └── index.js          # 通用工具函数
│   └── index.js              # 主入口文件
├── examples/                 # 示例代码
│   ├── query-database.js     # 数据库查询示例
│   ├── create-page.js        # 创建页面示例
│   └── update-page.js        # 更新页面示例
├── tests/                    # 测试文件
│   ├── unit/                 # 单元测试
│   └── integration/          # 集成测试
├── docs/                     # 详细文档
│   ├── api/                  # API 文档
│   ├── guides/               # 使用指南
│   └── examples/             # 示例文档
├── config/                   # 配置文件
│   └── default.json          # 默认配置
├── lib/                      # 第三方库扩展
├── .env.example              # 环境变量示例
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

## 环境设置

### 1. 获取 Notion API 密钥

1. 访问 [Notion Developers](https://developers.notion.com/)
2. 创建一个新的集成 (Create a new integration)
3. 复制生成的 API 密钥 (Token)

### 2. 配置环境变量

1. 复制 `.env.example` 到 `.env`:
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入你的配置:
   ```env
   NOTION_API_KEY=你的_notion_api_密钥
   NOTION_DATABASE_ID=你的数据库ID
   NOTION_PAGE_ID=你的页面ID（可选）
   ```

### 3. 获取数据库和页面ID

- **数据库ID**: 在Notion中打开你的数据库，URL中的ID部分
  ```
  https://www.notion.so/workspace/数据库ID?v=...
  ```

- **页面ID**: 在Notion中打开页面，URL中的ID部分
  ```
  https://www.notion.so/页面标题-页面ID
  ```

## 安装依赖

```bash
npm install
```

## MCP 配置

项目已配置 Notion MCP Server，支持通过 MCP 协议直接操作 Notion 资源。

### MCP 环境变量

```env
NOTION_TOKEN=your_notion_integration_token_here
```

### 可用资源

#### 🗄️ 数据库

**Averivendell**
- **ID**: `2a584b1a-1c79-8031-a2d2-ea51bad3a7fc`
- **URL**: https://www.notion.so/2a584b1a1c798031a2d2ea51bad3a7fc
- **属性**: Name (标题字段)
- **状态**: ✅ 可操作

#### 📄 页面

**VScode**
- **ID**: `2a284b1a-1c79-802b-8b1a-fc66b2cfd798`
- **URL**: https://www.notion.so/VScode-2a284b1a1c79802b8b1afc66b2cfd798
- **状态**: ✅ 可操作

### MCP 支持的操作

- ✅ 搜索页面和数据库
- ✅ 查询数据库内容
- ✅ 创建和更新页面
- ✅ 管理内容块
- ✅ 添加评论

## 快速开始

详细的设置和使用指南请参考：[快速开始指南](docs/guides/getting-started.md)

## 使用示例

### 查询数据库

```bash
node examples/query-database.js
```

这个示例会查询指定数据库中的所有页面，并显示基本信息。

### 创建页面

```bash
node examples/create-page.js
```

这个示例会在指定数据库中创建一个新的页面，包含标题和一些示例内容。

### 更新页面

```bash
node examples/update-page.js <页面ID>
```

这个示例会更新指定页面的属性和内容。页面ID可以通过查询数据库获得。

## API 操作说明

### 基本概念

- **数据库 (Database)**: Notion 中的表格结构
- **页面 (Page)**: Notion 中的页面，可以包含在数据库中
- **块 (Block)**: 页面中的内容元素（如段落、标题、列表等）
- **属性 (Properties)**: 数据库中页面的元数据字段

### 常用操作

1. **查询数据库**: `notion.databases.query()`
2. **创建页面**: `notion.pages.create()`
3. **更新页面**: `notion.pages.update()`
4. **获取页面**: `notion.pages.retrieve()`
5. **添加内容块**: `notion.blocks.children.append()`
6. **获取内容块**: `notion.blocks.children.list()`

## 权限设置

在使用 API 前，需要在 Notion 中为你的集成授权访问：

1. 在你的数据库或页面中，点击右上角的 "Share" 按钮
2. 邀请你的集成 (搜索你创建的集成名称)
3. 给予适当的权限 (读取/写入)

## 注意事项

- API 有速率限制，请合理使用
- 某些操作需要特定的权限
- 数据库结构会影响可用的属性类型
- 页面ID和数据库ID格式为36位UUID

## 扩展功能

你可以基于这些示例扩展更多功能：

- 批量操作页面
- 复杂的查询过滤器
- 富文本内容处理
- 文件和图片上传
- 评论管理
- 用户管理

## 参考资料

- [Notion API 官方文档](https://developers.notion.com/)
- [Notion API 参考](https://developers.notion.com/reference)
- [@notionhq/client GitHub](https://github.com/makenotion/notion-sdk-js)

## 许可证

ISC
