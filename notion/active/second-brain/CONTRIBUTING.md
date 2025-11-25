# 贡献指南

感谢你对 Notion 第二大脑项目的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 报告 Bug

如果你发现了 bug，请创建一个 Issue，包含以下信息：

1. **标题**：简洁描述问题
2. **环境信息**：
   - Node.js 版本
   - 操作系统
   - Notion API 版本
3. **复现步骤**：详细说明如何重现问题
4. **期望行为**：描述你期望的正确行为
5. **实际行为**：描述实际发生的情况
6. **截图/日志**：如果有的话

### 提出新功能

如果你有新功能的想法：

1. 先搜索 Issues，看是否已有类似建议
2. 创建一个 Feature Request Issue
3. 详细描述：
   - 功能目的
   - 使用场景
   - 可能的实现方案

### 提交代码

1. **Fork 项目**

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **编写代码**
   - 遵循项目代码风格
   - 添加必要的注释
   - 确保代码通过 lint 检查

4. **测试**
   ```bash
   npm test
   npm run lint
   ```

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

   提交信息格式：
   - `feat:` 新功能
   - `fix:` 修复 bug
   - `docs:` 文档更新
   - `style:` 代码格式调整
   - `refactor:` 重构
   - `test:` 测试相关
   - `chore:` 构建/工具相关

6. **推送到 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 清晰描述改动内容
   - 关联相关 Issue
   - 等待 Review

## 代码规范

### JavaScript 风格

- 使用 2 空格缩进
- 使用单引号
- 语句末尾加分号
- 使用有意义的变量名
- 函数应有 JSDoc 注释

示例：
```javascript
/**
 * 创建每日笔记
 * @param {Date} date - 日期
 * @returns {Promise<Object>} Notion 页面对象
 */
async function createDailyNote(date) {
  // 实现
}
```

### 文件组织

```
src/
├── api/          # API 封装
├── automation/   # 自动化脚本
├── templates/    # 模板定义
└── utils/        # 工具函数
```

### 错误处理

- 使用 try-catch 捕获异常
- 提供有意义的错误消息
- 使用 Logger 记录错误

```javascript
try {
  await someOperation();
} catch (error) {
  Logger.error(`操作失败: ${error.message}`);
  throw error;
}
```

## 添加新模板

1. 在 `config/templates.json` 中定义模板结构
2. 按照 Notion Block 格式编写
3. 添加模板说明文档
4. 更新 README

## 文档贡献

- 修正错别字
- 改进示例
- 添加使用技巧
- 翻译文档

## 社区准则

- 尊重他人
- 保持友善
- 乐于助人
- 接受建设性批评

## 许可

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

## 问题？

如有任何疑问，欢迎：
- 创建 Issue 讨论
- 发送邮件
- 加入社区讨论

感谢你的贡献！🎉
