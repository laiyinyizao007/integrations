# 直接使用 @yaegaki/cline-cli

## ✅ 简介

@yaegaki/cline-cli 是一个独立的命令行工具，可以直接在终端中使用 Cline AI，无需通过 MCP 服务器。这样更简单、稳定，避免了端口冲突问题。

**项目地址**: https://github.com/yaegaki/cline-cli

## 🚀 快速开始

### 1. 安装 cline-cli

#### 方式 1: 全局安装（推荐）
```bash
npm install -g @yaegaki/cline-cli
```

#### 方式 2: 使用 npx（无需安装）
```bash
npx -y @yaegaki/cline-cli --help
```

### 2. 初始化配置

```bash
cline-cli init
```

这会创建配置文件：`~/.cline_cli/cline_cli_settings.json`

### 3. 配置 API Key 和模型

编辑配置文件：
```bash
nano ~/.cline_cli/cline_cli_settings.json
```

配置示例：
```json
{
  "globalState": {
    "apiProvider": "anthropic",
    "apiModelId": "claude-3-7-sonnet-20250219",
    "autoApprovalSettings": {
      "enabled": true,
      "actions": {
        "readFiles": true,
        "editFiles": false,
        "executeSafeCommands": true,
        "useMcp": false
      },
      "maxRequests": 20
    }
  },
  "settings": {
    "cline.enableCheckpoints": false
  }
}
```

### 4. 设置 API Key

#### 方式 1: 环境变量（推荐）
```bash
export API_KEY="你的 Anthropic API Key"

# 永久设置（添加到 ~/.bashrc 或 ~/.zshrc）
echo 'export API_KEY="你的 Anthropic API Key"' >> ~/.bashrc
source ~/.bashrc
```

#### 方式 2: 每次命令时指定
```bash
API_KEY=你的key cline-cli task "任务描述"
```

## 📖 基本用法

### 创建新任务

```bash
# 基本用法
cline-cli task "创建一个 Python 脚本来计算斐波那契数列"

# 指定工作目录
cline-cli task "创建一个 React 组件" --workspace /path/to/project

# 完全自动模式（不需要确认）
cline-cli task "重构代码" --full-auto

# 提供自定义指令
cline-cli task "添加功能" --custom-instructions "使用 TypeScript，遵循 ESLint 规则"
```

### 恢复任务

```bash
# 恢复上一个任务
cline-cli task "继续上次的工作" --resume

# 如果任务存在则恢复，否则创建新任务
cline-cli task "开发登录功能" --resume-or-new
```

### 交互模式

```bash
# 启动交互模式
cline-cli task

# 然后输入任务描述
```

## 🎯 实用示例

### 示例 1: 创建项目

```bash
cline-cli task "创建一个 Express.js API 项目，包含用户认证功能" \
  --workspace /home/averyubuntu/projects/my-api \
  --full-auto
```

### 示例 2: 代码重构

```bash
cd /home/averyubuntu/projects/my-project
cline-cli task "重构 src/utils 目录中的代码，提高可读性"
```

### 示例 3: 修复 Bug

```bash
cline-cli task "修复 TypeError: Cannot read property 'name' of undefined 错误" \
  --workspace /home/averyubuntu/projects/buggy-app
```

### 示例 4: 添加测试

```bash
cline-cli task "为 src/auth.js 添加 Jest 单元测试" \
  --custom-instructions "测试覆盖率至少 80%"
```

## ⚙️ 高级配置

### 使用不同的 API Provider

#### OpenAI
```json
{
  "globalState": {
    "apiProvider": "openai",
    "apiModelId": "gpt-4",
    "openAiBaseUrl": "https://api.openai.com/v1"
  }
}
```

#### Google Vertex AI
```json
{
  "globalState": {
    "apiProvider": "vertex",
    "apiModelId": "claude-3-7-sonnet@20250219",
    "vertexProjectId": "your-gcp-project-id",
    "vertexRegion": "us-central1"
  }
}
```

### 自动批准设置

```json
{
  "globalState": {
    "autoApprovalSettings": {
      "enabled": true,
      "actions": {
        "readFiles": true,       // 自动批准读取文件
        "editFiles": false,      // 需要确认编辑文件
        "executeSafeCommands": true,  // 自动批准安全命令
        "useMcp": false          // 需要确认 MCP 使用
      },
      "maxRequests": 20          // 最大自动批准请求数
    }
  }
}
```

## 📋 常用命令

```bash
# 查看帮助
cline-cli --help

# 查看版本
cline-cli version

# 查看配置
cat ~/.cline_cli/cline_cli_settings.json

# 查看 MCP 配置（如果使用）
cat ~/.cline_cli/cline_mcp_settings.json
```

## 🔧 配置文件位置

| 文件 | 位置 | 用途 |
|------|------|------|
| cline-cli 配置 | `~/.cline_cli/cline_cli_settings.json` | 主配置文件 |
| MCP 配置 | `~/.cline_cli/cline_mcp_settings.json` | MCP 服务器配置（可选） |

## 💡 使用技巧

### 1. 使用别名简化命令

在 `~/.bashrc` 或 `~/.zshrc` 中添加：
```bash
alias ct='cline-cli task'
alias cta='cline-cli task --full-auto'
alias ctr='cline-cli task --resume'
```

然后就可以：
```bash
ct "创建README文件"
cta "重构代码"
ctr "继续开发"
```

### 2. 创建任务模板

创建一个脚本文件：
```bash
#!/bin/bash
# ~/bin/cline-create-component.sh

COMPONENT_NAME=$1
cline-cli task "创建 React 组件 $COMPONENT_NAME，包含：
- TypeScript 定义
- Props 接口
- 样式文件
- 单元测试
- Storybook 故事" \
  --workspace $(pwd) \
  --custom-instructions "使用函数组件和 Hooks"
```

### 3. 与 Git 集成

```bash
# 提交前检查
cline-cli task "检查代码质量和潜在问题" --workspace $(pwd)

# 生成提交信息
git diff | cline-cli task "根据这些更改生成一个清晰的提交信息"
```

## ⚠️ 注意事项

1. **开发状态**: cline-cli 仍在开发中，功能可能会变化
2. **功能限制**: 
   - ❌ 不支持 `browser_action`
   - ❌ 不支持 `execute_command`
3. **API 成本**: 每次任务会产生 API 调用费用
4. **工作目录**: 默认使用当前目录，建议使用 `--workspace` 明确指定

## 🐛 故障排查

### 问题 1: command not found

```bash
# 检查是否已安装
npm list -g @yaegaki/cline-cli

# 重新安装
npm install -g @yaegaki/cline-cli
```

### 问题 2: API Key 错误

```bash
# 检查环境变量
echo $API_KEY

# 设置环境变量
export API_KEY="your-key"
```

### 问题 3: 配置文件错误

```bash
# 重新初始化
rm -rf ~/.cline_cli
cline-cli init
```

## 📚 相关资源

- **GitHub**: https://github.com/yaegaki/cline-cli
- **Cline 官方**: https://cline.bot
- **Anthropic API**: https://console.anthropic.com/

## 🆚 与 MCP 方式对比

| 特性 | 直接使用 cline-cli | 通过 MCP (mcp-cline) |
|------|-------------------|---------------------|
| 安装简单度 | ✅ 简单 | ⚠️ 复杂 |
| 端口冲突 | ✅ 无 | ❌ 容易发生 |
| 稳定性 | ✅ 高 | ⚠️ 一般 |
| 与 VS Code 集成 | ❌ 无 | ✅ 有 |
| 独立使用 | ✅ 可以 | ❌ 依赖 Cline 扩展 |
| 推荐场景 | 命令行工作流 | VS Code 内集成 |

## ✅ 推荐工作流

```bash
# 1. 在项目目录中
cd /home/averyubuntu/projects/my-project

# 2. 创建 .cline-task 文件记录常用任务
cat > .cline-tasks << 'EOF'
# 开发任务
dev-feature: cline-cli task "开发新功能" --workspace $(pwd)
fix-bug: cline-cli task "修复Bug" --workspace $(pwd)
add-tests: cline-cli task "添加测试" --workspace $(pwd)
refactor: cline-cli task "重构代码" --workspace $(pwd) --full-auto
EOF

# 3. 直接运行任务
bash .cline-tasks
```

---

**创建时间**: 2025-01-08  
**版本**: v1.0  
**状态**: ✅ 推荐使用
