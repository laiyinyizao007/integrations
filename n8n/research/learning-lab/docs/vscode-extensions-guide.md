# VSCode n8n插件使用指南

> 您已安装的5个n8n VSCode扩展的完整使用教程

## 📦 已安装的n8n VSCode扩展

基于您的VSCode环境，您已安装了以下5个n8n相关扩展：

### 1. **n8n VSCode Connector** (`your-publisher.n8n-vscode-connector`)
*我们开发的自定义扩展 - 连接和管理n8n实例*

### 2. **n8n Utils** (`ivov.n8n-utils`)
*n8n工具集 - 提供各种实用功能*

### 3. **n8n2py** (`n8n2py-me.n8n2py-vscode`)
*n8n转Python工具 - 将工作流转换为Python代码*

### 4. **n8n Prompt Assistant** (`romankromos188.n8n-prompt-assistant`)
*n8n提示助手 - AI辅助工作流开发*

### 5. **n8n Atom** (`thorclient.n8n-atom-vscode`)
*n8n Atom风格主题和工具*

---

## 🔌 1. n8n VSCode Connector (核心扩展)

### 功能概述
- ✅ **远程连接**: 连接到本地或云端n8n实例
- ✅ **工作流管理**: 浏览、执行、监控工作流
- ✅ **状态监控**: 实时查看执行状态和结果
- ✅ **批量操作**: 支持多工作流管理

### 安装和配置

#### 步骤1：编译安装（如果还没安装）
```bash
cd ../n8n-vscode-connector
npm install
npm run compile
code --install-extension n8n-vscode-connector-1.0.0.vsix
```

#### 步骤2：配置环境变量
```bash
# 创建.env文件
cd ../n8n-vscode-connector
cat > .env << EOF
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your-api-key-here
N8N_TIMEOUT=30000
EOF
```

#### 步骤3：启动n8n服务
```bash
cd ../Averivendell_n8n
./start.sh
```

### 使用方法

#### 基本操作
1. **打开命令面板**: `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)

2. **连接到n8n实例**:
   ```
   n8n: Connect to Instance
   ```
   - 扩展会自动读取`.env`文件
   - 显示连接状态：✅ 已连接

3. **浏览工作流**:
   ```
   n8n: List Workflows
   ```
   **输出示例**:
   ```
   📋 n8n工作流列表
   ├── 🔄 Hello World Workflow (ID: abc123)
   ├── 📊 GitHub API Integration (ID: def456)
   └── 🤖 Telegram Bot (ID: ghi789)
   ```

4. **执行工作流**:
   ```
   n8n: Execute Workflow
   ```
   - 选择要执行的工作流
   - 可选：提供输入参数（JSON格式）
   - 查看实时执行结果

5. **查看工作流详情**:
   ```
   n8n: View Workflow Details
   ```
   - 显示节点数量、最后执行时间
   - 执行历史和状态信息

#### 高级功能

##### 编程接口使用
```typescript
import { N8nClient } from '../n8n-vscode-connector/src/n8n-client';

// 创建客户端
const client = new N8nClient('http://localhost:5678', 'api-key');

// 获取工作流列表
const workflows = await client.getWorkflows();

// 执行工作流
const result = await client.executeWorkflow('workflow-id', {
  input: 'test data'
});

// 监控执行状态
const executions = await client.getExecutions();
```

##### 批量操作
```typescript
// 批量测试所有工作流
async function testAllWorkflows() {
  const workflows = await client.getWorkflows();

  for (const workflow of workflows) {
    console.log(`🧪 测试: ${workflow.name}`);
    const result = await client.executeWorkflow(workflow.id);
    console.log(`📊 结果: ${result.status}`);
  }
}
```

### 故障排除

#### 连接失败
```bash
# 检查n8n服务状态
curl http://localhost:5678/rest/workflows

# 验证环境变量
cat ../n8n-vscode-connector/.env

# 重新加载VSCode
Ctrl+Shift+P → Developer: Reload Window
```

#### API认证失败
```bash
# 获取API密钥（在n8n界面）
# Settings → API → Generate API Key

# 更新.env文件
echo "N8N_API_KEY=your-new-key" >> ../n8n-vscode-connector/.env
```

---

## 🛠️ 2. n8n Utils (工具集)

### 功能概述
- ✅ **代码片段**: 常用n8n节点代码片段
- ✅ **语法检查**: n8n工作流JSON验证
- ✅ **格式化**: 自动格式化工作流代码
- ✅ **快速插入**: 常用节点模板

### 使用方法

#### 代码片段
1. **创建新文件**: `workflow.json`
2. **输入触发词**:
   - `n8n-workflow` → 基础工作流模板
   - `n8n-http` → HTTP请求节点
   - `n8n-function` → 函数节点
   - `n8n-set` → 设置节点

#### 语法验证
- 自动检测JSON语法错误
- 提供n8n特定的验证规则
- 实时错误提示和修复建议

#### 格式化功能
```json
// 格式化前
{"name":"test","nodes":[{"name":"Start","type":"start"}]}

// 格式化后 (Ctrl+Shift+I)
{
  "name": "test",
  "nodes": [
    {
      "name": "Start",
      "type": "start"
    }
  ]
}
```

#### 快速操作
- **右键菜单**: 在JSON文件中右键 → "n8n Utils" 选项
- **命令面板**: `n8n-utils: Validate Workflow`
- **键盘快捷键**: `Ctrl+Alt+N` (插入节点模板)

---

## 🐍 3. n8n2py (n8n转Python工具)

### 功能概述
- ✅ **工作流转换**: 将n8n工作流转换为Python代码
- ✅ **代码生成**: 自动生成可执行的Python脚本
- ✅ **依赖管理**: 自动包含所需Python包
- ✅ **本地执行**: 无需n8n即可运行工作流

### 使用方法

#### 转换工作流
1. **打开n8n工作流JSON文件**
2. **右键点击** → "Convert to Python"
3. **或使用命令**: `n8n2py: Convert Workflow`

#### 生成的Python代码示例
```python
# 转换后的Python代码
import requests
import json

def execute_workflow():
    # HTTP Request节点
    response = requests.get('https://api.github.com/user')
    data = response.json()

    # Function节点
    result = {
        'username': data.get('login'),
        'name': data.get('name'),
        'timestamp': str(datetime.now())
    }

    return result

if __name__ == '__main__':
    result = execute_workflow()
    print(json.dumps(result, indent=2))
```

#### 高级功能

##### 自定义转换
```python
# 在Python代码中添加自定义逻辑
def custom_processing(data):
    # 添加您的业务逻辑
    processed = data.copy()
    processed['custom_field'] = 'added_by_python'
    return processed

# 在工作流中调用
result = custom_processing(api_response)
```

##### 批量转换
```bash
# 转换目录中所有工作流
n8n2py convert --input workflows/ --output python_workflows/

# 指定输出格式
n8n2py convert --format script workflow.json
n8n2py convert --format module workflow.json
```

##### 依赖分析
- 自动检测工作流中使用的服务
- 生成`requirements.txt`
- 包含所有必要的Python包

### 实际应用场景

#### 场景1：离线执行
```python
# 将n8n工作流转换为可在服务器上独立运行的Python脚本
# 适用于生产环境部署，无需维护n8n实例
```

#### 场景2：代码集成
```python
# 将工作流逻辑集成到现有Python项目中
# 保持n8n的图形化开发优势，同时获得代码的灵活性
```

#### 场景3：性能优化
```python
# 对于高频执行的工作流，转换为Python可获得更好的性能
# 减少网络开销和序列化开销
```

---

## 🤖 4. n8n Prompt Assistant (AI助手)

### 功能概述
- ✅ **智能提示**: AI辅助工作流设计
- ✅ **代码生成**: 根据描述生成工作流代码
- ✅ **最佳实践**: 提供n8n开发建议
- ✅ **错误修复**: 自动修复常见问题

### 使用方法

#### AI辅助开发
1. **打开命令面板**: `Ctrl+Shift+P`
2. **输入**: `n8n-assistant: Create Workflow`
3. **描述需求**:
   ```
   创建一个工作流：接收Telegram消息，调用API，回复结果
   ```

#### 生成的工作流代码
```json
{
  "name": "Telegram API Bot",
  "nodes": [
    {
      "name": "Telegram Trigger",
      "type": "n8n-nodes-base.telegram",
      "parameters": {
        "mode": "webhook",
        "botToken": "{{$node[\"Bot Token\"].json[\"token\"]}}"
      }
    },
    {
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.example.com/data",
        "method": "GET"
      }
    },
    {
      "name": "Send Reply",
      "type": "n8n-nodes-base.telegram",
      "parameters": {
        "mode": "sendMessage",
        "text": "{{$json[\"result\"]}}"
      }
    }
  ]
}
```

#### 智能建议
- **性能优化**: 自动检测并建议改进
- **错误处理**: 添加适当的错误处理节点
- **安全建议**: 检查敏感信息处理

#### 交互式对话
```
您: 我需要创建一个定时任务来备份数据库

助手: 我来帮您创建数据库备份工作流...

建议的工作流结构：
1. Schedule Trigger - 每天凌晨2点执行
2. Function - 生成备份文件名
3. Execute Command - 执行数据库备份
4. Email - 发送备份完成通知

需要我生成完整的JSON配置吗？
```

---

## 🎨 5. n8n Atom (主题和工具)

### 功能概述
- ✅ **Atom风格主题**: 经典的深色代码主题
- ✅ **语法高亮**: n8n工作流JSON特殊语法
- ✅ **代码折叠**: 支持工作流结构折叠
- ✅ **图标主题**: n8n相关的文件图标

### 使用方法

#### 主题设置
1. **打开设置**: `Ctrl+,`
2. **搜索**: `theme`
3. **选择颜色主题**: "n8n Atom"
4. **选择图标主题**: "n8n Icons"

#### 语法高亮特性
```json
{
  "name": "workflow",
  "nodes": [
    {
      // 节点类型高亮
      "type": "n8n-nodes-base.httpRequest",
      // 参数键值对高亮
      "parameters": {
        "url": "https://api.example.com",
        "method": "GET"
      },
      // 位置信息高亮
      "position": [100, 200]
    }
  ],
  // 连接线高亮
  "connections": {
    "Start": {
      "main": [[{"node": "HTTP Request"}]]
    }
  }
}
```

#### 代码折叠
- **折叠节点**: 点击节点左侧的折叠图标
- **折叠连接**: 折叠整个connections部分
- **折叠参数**: 折叠复杂的parameters对象

#### 文件图标
- `.json`文件显示n8n工作流图标
- 工作流文件在资源管理器中特殊标识
- 支持工作流文件的快速预览

---

## 🚀 综合使用指南

### 推荐工作流

#### 开发新工作流
```
1. 使用 n8n Prompt Assistant 描述需求
   → AI生成初始工作流结构

2. 使用 n8n Utils 格式化和验证代码
   → 确保语法正确

3. 使用 n8n VSCode Connector 测试执行
   → 验证功能正常

4. 使用 n8n2py 转换为Python代码
   → 获得代码版本用于集成
```

#### 维护现有工作流
```
1. 使用 n8n VSCode Connector 查看状态
   → 监控执行情况

2. 使用 n8n Utils 进行代码整理
   → 保持代码整洁

3. 使用 n8n Atom 获得更好编辑体验
   → 舒适的开发环境
```

### 快捷键设置

#### 推荐键盘快捷键
```json
// settings.json 中添加
{
  "keybindings": [
    {
      "key": "ctrl+alt+n",
      "command": "n8n-utils.insertNode"
    },
    {
      "key": "ctrl+alt+w",
      "command": "n8n-vscode-connector.listWorkflows"
    },
    {
      "key": "ctrl+alt+e",
      "command": "n8n-vscode-connector.executeWorkflow"
    },
    {
      "key": "ctrl+alt+p",
      "command": "n8n2py.convert"
    }
  ]
}
```

### 扩展设置

#### 个性化配置
```json
// settings.json
{
  // n8n VSCode Connector
  "n8n-vscode-connector.autoConnect": true,
  "n8n-vscode-connector.refreshInterval": 30000,

  // n8n Utils
  "n8n-utils.autoFormat": true,
  "n8n-utils.validateOnSave": true,

  // n8n2py
  "n8n2py.defaultFormat": "script",
  "n8n2py.includeComments": true,

  // n8n Prompt Assistant
  "n8n-assistant.model": "gpt-4",
  "n8n-assistant.language": "zh-CN"
}
```

---

## 🐛 常见问题解决

### 扩展冲突
```
问题: 多个扩展提供相似功能
解决: 在设置中禁用冲突的功能
```

### 性能问题
```
问题: VSCode变慢
解决:
- 禁用不常用的扩展
- 调整刷新间隔
- 清理扩展缓存
```

### 更新扩展
```bash
# 更新所有扩展
code --update-extensions

# 重新安装特定扩展
code --uninstall-extension extension-id
code --install-extension extension-id
```

---

## 📚 学习资源

- **官方文档**: https://docs.n8n.io/
- **扩展仓库**: 查看各扩展的GitHub仓库
- **社区论坛**: https://community.n8n.io/
- **示例项目**: `n8n-learning-project/` 目录

---

## 🎯 效率提升技巧

### 1. 组合使用
- **开发**: Prompt Assistant + Utils + VSCode Connector
- **维护**: VSCode Connector + Atom主题
- **部署**: n8n2py转换 + 自定义脚本

### 2. 自动化工作流
```json
// 使用扩展API创建自动化脚本
{
  "scripts": {
    "dev": "npm run start:n8n && npm run watch:extension",
    "test": "npm run convert:workflows && npm run validate:all",
    "deploy": "npm run backup && npm run push:production"
  }
}
```

### 3. 团队协作
- **共享配置**: 将`.vscode/settings.json`纳入版本控制
- **统一环境**: 使用相同的扩展版本
- **代码规范**: 制定工作流开发规范

---

**🎉 现在您已经掌握了所有5个n8n VSCode扩展的使用方法！**

通过合理组合这些扩展，您可以：
- 🚀 **大幅提升** 工作流开发效率
- 🔧 **无缝集成** 到开发工作流
- 🎨 **获得最佳** 编辑和调试体验
- 🤖 **利用AI** 辅助开发

开始在VSCode中体验强大的n8n开发环境吧！
