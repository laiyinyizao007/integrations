# n8n VSCode Connector

一个VSCode扩展，用于连接和操作部署在Hugging Face Spaces上的n8n实例。

## 功能特性

- 🔗 **连接管理**: 轻松连接到Hugging Face Spaces上的n8n实例
- 📋 **工作流浏览**: 查看和搜索所有工作流
- ▶️ **工作流执行**: 直接从VSCode执行n8n工作流
- 📊 **执行监控**: 查看工作流执行状态和结果
- 🔐 **安全配置**: 支持API密钥认证
- 🎨 **用户友好**: 直观的图形界面和状态显示

## 安装

### 从源码构建

1. 克隆项目
```bash
git clone <repository-url>
cd n8n-vscode-connector
```

2. 安装依赖
```bash
npm install
```

3. 编译扩展
```bash
npm run compile
```

4. 安装到VSCode
```bash
code --install-extension n8n-vscode-connector-1.0.0.vsix
```

或者在VSCode中：
- 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
- 输入 "Extensions: Install from VSIX"
- 选择编译生成的 `.vsix` 文件

## 使用指南

### 快速开始（推荐）

1. **设置环境变量**：
```bash
cd n8n-vscode-connector
./setup-env.sh
```

2. **编辑 `.env` 文件**：
```bash
N8N_BASE_URL=https://your-huggingface-space.hf.space
N8N_API_KEY=your-api-key-here  # 如果需要
```

3. **重新启动VSCode**，扩展将自动连接到您的n8n实例。

### 手动配置连接

如果不使用环境变量：

1. 打开VSCode命令面板 (`Ctrl+Shift+P`)
2. 输入 "n8n: Connect to Instance"
3. 输入您的n8n实例URL (例如: `https://your-space.hf.space`)
4. 根据提示配置API密钥（如果需要）

### 2. 浏览工作流

1. 运行命令 "n8n: List Workflows"
2. 从列表中选择工作流查看详情
3. 或使用 "n8n: View Workflow Details" 通过ID查看

### 3. 执行工作流

1. 运行命令 "n8n: Execute Workflow"
2. 选择要执行的活跃工作流
3. 可选择提供输入数据（JSON格式）
4. 查看执行结果和状态

## 配置选项

扩展支持两种配置方式：**环境变量**（推荐）和 **VSCode设置**。

### 环境变量配置（推荐）

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件：
```bash
# 设置您的n8n实例URL
N8N_BASE_URL=https://your-huggingface-space.hf.space

# 如果需要API密钥（可选）
N8N_API_KEY=your-api-key-here

# 连接超时（可选，默认30000ms）
N8N_TIMEOUT=30000
```

3. 扩展启动时会自动读取环境变量并连接。

### VSCode设置配置

如果不使用环境变量，可以通过VSCode设置配置：

1. 打开VSCode设置 (`Ctrl+,`)
2. 搜索 "n8n"
3. 配置以下选项：
   - `n8n-vscode-connector.baseUrl`: n8n实例的基础URL
   - `n8n-vscode-connector.apiKey`: API密钥（可选，用于认证）

### 配置优先级

扩展按以下优先级读取配置：
1. **环境变量**（`.env` 文件）
2. **VSCode全局设置**
3. **交互式输入**（运行连接命令时）

## API 参考

### N8nClient 类

```typescript
import { N8nClient } from './n8n-client';

const client = new N8nClient('https://your-space.hf.space', 'your-api-key');

// 测试连接
await client.testConnection();

// 获取工作流
const workflows = await client.getWorkflows();

// 执行工作流
const execution = await client.executeWorkflow('workflow-id', { input: 'data' });
```

### 支持的n8n API端点

- `GET /rest/workflows` - 获取所有工作流
- `GET /rest/workflows/{id}` - 获取单个工作流
- `POST /rest/workflows/{id}/execute` - 执行工作流
- `GET /rest/executions` - 获取执行历史
- `GET /rest/executions/{id}` - 获取执行详情
- `GET /rest/credentials` - 获取凭据列表

## Hugging Face Spaces 部署

### ⚠️ 重要限制说明

在使用HuggingFace Spaces部署n8n前，请务必阅读：[HF Spaces n8n限制和使用指南](docs/HF_N8N_LIMITATIONS.md)

**核心限制**：
- ❌ **不能直接连接Telegram/WhatsApp**（DNS被封）
- ❌ **本地磁盘不持久**（需要外部数据库）
- ⚠️ **自动休眠机制**（需要定时唤醒）

### 部署n8n到Hugging Face Spaces

1. 创建新的Hugging Face Space
2. 选择Docker模板
3. 使用以下配置：

**Dockerfile**:
```dockerfile
FROM n8nio/n8n:latest

# 设置环境变量
ENV N8N_PORT=7860
ENV N8N_PROTOCOL=https
ENV N8N_HOST=0.0.0.0

# 暴露端口
EXPOSE 7860

# 启动命令
CMD ["n8n", "start"]
```

**requirements.txt** (如果需要Python依赖):
```
n8n
```

4. 推送代码到Hugging Face
5. Space将自动构建和部署

### 配置n8n

在n8n界面中：

1. 设置API密钥（可选）
   - 进入Settings > API
   - 生成新的API密钥

2. 配置工作流
   - 创建您的工作流
   - 确保工作流设置为活跃状态

3. **重要**：配置外部数据库
   - 使用Supabase、Railway或Neon
   - 避免使用本地SQLite（会丢失）

## 故障排除

### 连接问题

**问题**: 无法连接到n8n实例
**解决方案**:
- 检查URL是否正确
- 确保n8n实例正在运行
- 验证网络连接
- 检查防火墙设置

**问题**: API密钥认证失败
**解决方案**:
- 确认API密钥正确
- 检查n8n实例是否启用了API访问
- 验证密钥权限

### 工作流执行问题

**问题**: 工作流执行失败
**解决方案**:
- 检查工作流配置
- 验证输入数据格式
- 查看n8n实例日志
- 确认所有依赖节点正确配置

### 常见错误

- **409 Conflict**: 多个bot实例同时运行，停止其他实例
- **401 Unauthorized**: API密钥无效或缺失
- **404 Not Found**: 工作流ID不存在
- **500 Internal Server Error**: n8n实例内部错误

## 开发

### 项目结构

```
n8n-vscode-connector/
├── src/
│   ├── extension.ts      # VSCode扩展入口点
│   └── n8n-client.ts     # n8n API客户端
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
└── README.md            # 文档
```

### 构建和测试

```bash
# 安装依赖
npm install

# 编译
npm run compile

# 监听模式编译
npm run watch

# 运行测试
npm test

# 代码检查
npm run lint
```

### 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

## 相关链接

- [n8n官方文档](https://docs.n8n.io/)
- [n8n API参考](https://docs.n8n.io/api/)
- [Hugging Face Spaces](https://huggingface.co/spaces)
- [VSCode扩展API](https://code.visualstudio.com/api)

## 更新日志

### v1.0.0
- 初始版本发布
- 支持连接Hugging Face Spaces上的n8n实例
- 工作流浏览和执行功能
- 基本的错误处理和日志记录
