# n8n快速开始指南

> 从零开始学习n8n工作流自动化

## 🎯 本指南目标

在30分钟内掌握n8n的基础使用方法，包括：
- 环境设置和启动
- 第一个工作流创建
- 基本节点使用
- 工作流测试和调试

## 📋 前置要求

### 1. 环境检查

确保以下工具已安装：

```bash
# 检查Docker
docker --version
docker compose version

# 检查VSCode扩展
code --list-extensions | grep -i live
```

### 2. 启动本地n8n

```bash
# 进入Averivendell_n8n目录
cd ../Averivendell_n8n

# 启动n8n服务
./start.sh

# 或者手动启动
docker compose up -d

# 检查服务状态
docker compose ps
```

### 3. 访问n8n界面

- **地址**: http://localhost:5678
- **用户名**: admin
- **密码**: avery_n8n_2025

## 🚀 创建您的第一个工作流

### 步骤1：创建新工作流

1. 登录n8n后，点击 **"Add Workflow"**
2. 输入工作流名称：`My First Workflow`
3. 点击 **"Create"**

### 步骤2：添加起始节点

1. 在工作流画布上点击 **"+"** 按钮
2. 选择 **"Start"** 节点
3. 将节点拖放到画布中央

### 步骤3：添加HTTP请求节点

1. 再次点击 **"+"** 按钮
2. 搜索 **"HTTP Request"**
3. 将节点拖放到画布上

### 步骤4：配置HTTP请求

1. 点击HTTP Request节点
2. 在右侧面板配置：
   - **Method**: GET
   - **URL**: `https://api.github.com/user`
   - **Headers**: 添加 `Authorization: Bearer YOUR_GITHUB_TOKEN` (可选)

### 步骤5：连接节点

1. 从Start节点的输出点拖拽到HTTP Request节点的输入点
2. 确保连接线变为实线（表示连接成功）

### 步骤6：测试工作流

1. 点击右上角 **"Execute Workflow"** 按钮
2. 查看HTTP Request节点的输出
3. 确认收到了GitHub API的响应

## 🛠️ 核心概念理解

### 工作流结构

```
触发器 → 处理节点 → 输出节点
```

**触发器 (Trigger)**: 启动工作流的节点
- Manual Trigger: 手动触发
- Schedule Trigger: 定时触发
- Webhook: HTTP请求触发
- 各种服务触发器 (GitHub, Telegram等)

**处理节点 (Processing)**: 处理数据的节点
- HTTP Request: API调用
- Function: JavaScript代码执行
- Set: 设置数据
- Switch: 条件判断

**输出节点 (Output)**: 输出结果的节点
- Return Data: 返回数据
- Email: 发送邮件
- Telegram: 发送消息

### 数据流

n8n中的数据以JSON格式在节点间传递：

```json
{
  "items": [
    {
      "json": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "binary": {}
    }
  ]
}
```

- **items**: 数据项数组
- **json**: 结构化数据
- **binary**: 二进制数据（文件等）

## 📚 基础节点使用指南

### 1. Start节点

**用途**: 工作流的起点

**配置**:
- 通常不需要额外配置
- 可以设置初始数据

### 2. HTTP Request节点

**用途**: 调用REST API

**关键配置**:
```json
{
  "method": "GET|POST|PUT|DELETE",
  "url": "https://api.example.com/endpoint",
  "headers": {
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
  },
  "body": {
    "key": "value"
  }
}
```

### 3. Function节点

**用途**: 执行JavaScript代码

**示例代码**:
```javascript
// 获取输入数据
const data = $input.item.json;

// 处理数据
const result = {
  message: `Hello ${data.name}!`,
  timestamp: new Date().toISOString()
};

// 返回结果
return result;
```

### 4. Set节点

**用途**: 设置或修改数据

**配置示例**:
- **Mode**: Keep Only Set (只保留设置的字段)
- **Values to Set**:
  - Name: `processed_at`
  - Type: `string`
  - Value: `{{new Date().toISOString()}}`

## 🔧 VSCode集成使用

### 1. 安装Live Server扩展

```bash
# 在VSCode中安装
code --install-extension ritwickdey.liveserver
```

### 2. 预览n8n界面

1. 在VSCode中打开 `../Averivendell_n8n/n8n-preview.html`
2. 右键点击文件
3. 选择 **"Open with Live Server"**
4. 在浏览器中访问显示的地址

### 3. 使用n8n-vscode-connector扩展

1. **安装扩展**:
   ```bash
   cd ../n8n-vscode-connector
   npm run compile
   code --install-extension n8n-vscode-connector-1.0.0.vsix
   ```

2. **配置连接**:
   ```bash
   cd ../n8n-vscode-connector
   cp .env.example .env
   # 编辑 .env 文件设置 N8N_BASE_URL=http://localhost:5678
   ```

3. **使用命令**:
   - `Ctrl+Shift+P` → "n8n: Connect to Instance"
   - "n8n: List Workflows" - 查看工作流
   - "n8n: Execute Workflow" - 执行工作流

## 🐛 常见问题解决

### 问题1：n8n无法启动

**症状**: `docker compose up -d` 后服务未启动

**解决**:
```bash
# 检查端口占用
netstat -tlnp | grep 5678

# 停止占用进程或修改端口
# 编辑 docker-compose.yml 更改端口映射

# 查看详细日志
docker compose logs n8n
```

### 问题2：工作流执行失败

**症状**: 节点显示红色错误

**解决**:
1. 点击错误节点查看错误信息
2. 检查节点配置是否正确
3. 验证输入数据格式
4. 查看n8n日志：`docker compose logs -f n8n`

### 问题3：VSCode扩展无法连接

**症状**: 扩展显示连接失败

**解决**:
```bash
# 确认n8n正在运行
curl http://localhost:5678/rest/workflows

# 检查.env文件配置
cat ../n8n-vscode-connector/.env

# 重新加载VSCode窗口
# Ctrl+Shift+P → "Developer: Reload Window"
```

## 🎯 下一步学习

完成本指南后，您可以：

1. **探索更多节点**: 尝试不同的触发器和处理节点
2. **学习数据处理**: 掌握Set、Function、Switch等节点
3. **集成外部服务**: 连接Telegram、GitHub、数据库等
4. **查看进阶指南**: `workflow-guide.md`

## 📚 相关资源

- [n8n官方文档](https://docs.n8n.io/)
- [工作流示例](../workflows/basics/)
- [VSCode扩展使用](../examples/vscode-extension/)

---

**恭喜！** 🎉 您已经完成了n8n的基础学习。现在可以开始创建更复杂的工作流了！
