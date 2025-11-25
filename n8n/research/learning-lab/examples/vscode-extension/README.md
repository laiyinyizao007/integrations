# n8n VSCode扩展使用示例

> 演示如何在VSCode中集成和管理n8n工作流

## 🎯 功能概述

通过n8n-vscode-connector扩展，您可以：

- ✅ **无缝连接** - 从VSCode直接连接到n8n实例
- ✅ **工作流管理** - 浏览、执行和监控工作流
- ✅ **开发效率** - 无需切换浏览器窗口
- ✅ **状态监控** - 实时查看执行状态

## 📋 前置要求

### 1. 安装扩展

```bash
# 编译并安装扩展
cd ../../n8n-vscode-connector
npm run compile
code --install-extension n8n-vscode-connector-1.0.0.vsix
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置
cat > .env << EOF
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your-api-key-here  # 可选，用于认证
EOF
```

### 3. 启动n8n服务

```bash
# 启动本地n8n实例
cd ../../Averivendell_n8n
./start.sh
```

## 🚀 使用指南

### 1. 连接到n8n实例

1. **打开命令面板**:
   ```
   Ctrl+Shift+P (Windows/Linux) 或 Cmd+Shift+P (Mac)
   ```

2. **运行连接命令**:
   ```
   n8n: Connect to Instance
   ```

3. **验证连接**:
   - 扩展会自动读取 `.env` 文件中的配置
   - 状态栏显示连接状态
   - 成功时显示 ✅ 已连接

### 2. 浏览工作流

```bash
# 命令: n8n: List Workflows
# 功能: 显示所有工作流列表
# 输出: 工作流ID、名称、状态等信息
```

**示例输出**:
```
📋 n8n工作流列表
├── 🔄 Hello World Workflow (ID: abc123)
├── 📊 GitHub API Integration (ID: def456)
└── 🤖 Telegram Bot (ID: ghi789)
```

### 3. 执行工作流

```bash
# 命令: n8n: Execute Workflow
# 功能: 手动触发工作流执行
# 参数: 可选择提供输入数据 (JSON格式)
```

**执行步骤**:
1. 选择要执行的工作流
2. 可选：提供输入参数
3. 点击执行
4. 查看执行结果

### 4. 查看工作流详情

```bash
# 命令: n8n: View Workflow Details
# 功能: 显示工作流的详细信息
# 信息包括: 节点数量、最后执行时间、状态等
```

## 💻 编程接口使用

### 基本连接和认证

```typescript
import { N8nClient } from '../../n8n-vscode-connector/src/n8n-client';

// 创建客户端实例
const client = new N8nClient('http://localhost:5678', 'your-api-key');

// 测试连接
const isConnected = await client.testConnection();
console.log('连接状态:', isConnected ? '✅ 成功' : '❌ 失败');
```

### 工作流管理

```typescript
// 获取所有工作流
const workflows = await client.getWorkflows();
console.log('工作流数量:', workflows.length);

// 按名称查找工作流
const targetWorkflow = workflows.find(w => w.name.includes('Hello World'));

// 执行工作流
if (targetWorkflow) {
  const execution = await client.executeWorkflow(targetWorkflow.id, {
    input: 'test data'
  });
  console.log('执行ID:', execution.id);
  console.log('执行状态:', execution.status);
}
```

### 执行监控

```typescript
// 获取执行历史
const executions = await client.getExecutions();
console.log('最近执行:', executions.slice(0, 5));

// 获取特定执行详情
const executionDetail = await client.getExecution('execution-id');
console.log('执行详情:', {
  status: executionDetail.status,
  startedAt: executionDetail.startedAt,
  finishedAt: executionDetail.finishedAt,
  data: executionDetail.data
});
```

## 🔧 高级配置

### 环境变量配置

```bash
# .env 文件完整配置
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your-api-key-here
N8N_TIMEOUT=30000
N8N_RETRIES=3
```

### VSCode设置覆盖

如果不使用环境变量，可以在VSCode设置中配置：

```json
{
  "n8n-vscode-connector.baseUrl": "http://localhost:5678",
  "n8n-vscode-connector.apiKey": "your-api-key-here"
}
```

### 自定义超时和重试

```typescript
// 自定义客户端配置
const client = new N8nClient('http://localhost:5678', 'api-key', {
  timeout: 60000,    // 60秒超时
  retries: 5,        // 重试5次
  retryDelay: 1000   // 重试间隔1秒
});
```

## 📊 实际应用场景

### 场景1：开发中的工作流测试

```typescript
// 在开发过程中快速测试工作流
async function testWorkflow(workflowId: string, testData: any) {
  const client = new N8nClient();
  await client.connect();

  console.log('🧪 测试工作流:', workflowId);
  const result = await client.executeWorkflow(workflowId, testData);

  console.log('📊 测试结果:', result.status);
  console.log('📄 输出数据:', result.data);

  return result;
}
```

### 场景2：CI/CD集成

```typescript
// 在构建流程中验证工作流
async function validateWorkflows() {
  const client = new N8nClient();
  const workflows = await client.getWorkflows();

  for (const workflow of workflows) {
    console.log(`🔍 验证工作流: ${workflow.name}`);

    // 执行测试运行
    const testRun = await client.executeWorkflow(workflow.id, { test: true });

    if (testRun.status !== 'success') {
      throw new Error(`工作流 ${workflow.name} 验证失败`);
    }
  }

  console.log('✅ 所有工作流验证通过');
}
```

### 场景3：监控和告警

```typescript
// 监控工作流执行状态
async function monitorWorkflows() {
  const client = new N8nClient();
  const executions = await client.getExecutions();

  const failedExecutions = executions.filter(e => e.status === 'error');

  if (failedExecutions.length > 0) {
    console.log('🚨 发现失败的执行:', failedExecutions.length);

    // 发送告警通知
    await sendAlert({
      title: 'n8n工作流执行失败',
      details: failedExecutions.map(e => ({
        workflowId: e.workflowId,
        error: e.error?.message
      }))
    });
  }
}
```

## 🐛 故障排除

### 连接问题

**问题**: 扩展显示"连接失败"

**解决**:
```bash
# 1. 检查n8n服务状态
curl http://localhost:5678/rest/workflows

# 2. 验证环境变量
cat .env

# 3. 检查VSCode扩展日志
# 帮助 → 切换开发人员工具 → 控制台
```

### 认证问题

**问题**: API密钥认证失败

**解决**:
```bash
# 1. 确认API密钥正确
# 在n8n界面: Settings → API → Generate API Key

# 2. 检查密钥格式
echo $N8N_API_KEY

# 3. 验证密钥权限
curl -H "X-N8N-API-KEY: $N8N_API_KEY" http://localhost:5678/rest/workflows
```

### 执行问题

**问题**: 工作流执行失败

**解决**:
```typescript
// 获取详细错误信息
const execution = await client.getExecution('execution-id');
console.log('错误详情:', execution.error);

// 检查工作流配置
const workflow = await client.getWorkflow('workflow-id');
console.log('工作流节点:', workflow.nodes);
```

## 📈 性能优化

### 连接池管理

```typescript
class N8nConnectionPool {
  private clients: N8nClient[] = [];

  async getClient(): Promise<N8nClient> {
    // 实现连接池逻辑
    // 重用现有连接，避免频繁创建
  }

  async executeWithPool(workflowId: string, data: any) {
    const client = await this.getClient();
    try {
      return await client.executeWorkflow(workflowId, data);
    } finally {
      this.returnClient(client);
    }
  }
}
```

### 批量操作

```typescript
// 批量执行多个工作流
async function batchExecute(workflowIds: string[], data: any) {
  const results = await Promise.allSettled(
    workflowIds.map(id =>
      client.executeWorkflow(id, data)
    )
  );

  return results.map((result, index) => ({
    workflowId: workflowIds[index],
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : result.reason
  }));
}
```

## 🎯 最佳实践

### 1. 错误处理

```typescript
async function safeExecuteWorkflow(workflowId: string, data: any) {
  try {
    const result = await client.executeWorkflow(workflowId, data);

    if (result.status === 'error') {
      throw new Error(`工作流执行失败: ${result.error?.message}`);
    }

    return result;
  } catch (error) {
    console.error('工作流执行错误:', error);

    // 重试逻辑
    if (error.code === 'TIMEOUT') {
      return await retryExecute(workflowId, data);
    }

    throw error;
  }
}
```

### 2. 资源管理

```typescript
class N8nManager {
  private client: N8nClient;

  constructor() {
    this.client = new N8nClient();
  }

  async initialize() {
    await this.client.connect();
  }

  async cleanup() {
    // 清理资源
    await this.client.disconnect();
  }

  // 使用示例
  async executeWorkflow(workflowId: string, data: any) {
    await this.initialize();
    try {
      return await this.client.executeWorkflow(workflowId, data);
    } finally {
      await this.cleanup();
    }
  }
}
```

### 3. 日志记录

```typescript
// 启用详细日志
const client = new N8nClient('http://localhost:5678', 'api-key', {
  logging: true,
  logLevel: 'debug'
});

// 自定义日志
client.on('execution', (execution) => {
  console.log(`工作流 ${execution.workflowId} 执行状态: ${execution.status}`);
});

client.on('error', (error) => {
  console.error('n8n客户端错误:', error);
});
```

## 📚 相关资源

- [n8n API文档](https://docs.n8n.io/api/)
- [VSCode扩展API](https://code.visualstudio.com/api)
- [工作流示例](../../workflows/)
- [故障排除](../../docs/troubleshooting.md)

---

**开始在VSCode中管理您的n8n工作流吧！** 🚀

通过这个扩展，您可以无缝地将n8n集成到开发工作流中，大大提高自动化效率。
