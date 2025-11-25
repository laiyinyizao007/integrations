# Cline CLI 工具完整对比指南

## 📋 概述

你当前安装了两个不同的 Cline CLI 工具：

| 工具 | 版本 | 类型 | 项目地址 |
|------|------|------|----------|
| **cline** | v1.0.5 | 官方 CLI | https://github.com/cline/cline |
| **@yaegaki/cline-cli** | v0.1.1 | 社区版 | https://github.com/yaegaki/cline-cli |

---

## 🔍 核心区别

### 1. cline (官方 CLI)

**特点**：
- ✅ 官方支持，功能完整
- ✅ 需要连接 Cline Core 服务器 (gRPC)
- ✅ 完整的任务管理系统
- ✅ 支持多实例管理
- ✅ PLAN/ACT 双模式
- ✅ 丰富的配置选项
- ⚠️ 需要运行 Cline Core 后台服务

**架构**：
```
cline CLI → gRPC → Cline Core Server → Anthropic API
```

### 2. @yaegaki/cline-cli (社区版)

**特点**：
- ✅ 独立运行，无需后台服务
- ✅ 简单直接，配置简便
- ✅ 直接调用 Anthropic API
- ✅ 轻量级，快速启动
- ⚠️ 功能相对简单
- ⚠️ 不支持某些高级特性

**架构**：
```
cline-cli → Anthropic API (直接)
```

---

## 📊 功能对比表

| 功能 | cline (官方) | @yaegaki/cline-cli |
|------|-------------|-------------------|
| **基本任务执行** | ✅ | ✅ |
| **自动批准** | ✅ | ✅ |
| **PLAN/ACT 模式** | ✅ | ❌ |
| **任务管理** | ✅ 完整 | ⚠️ 简单 |
| **实例管理** | ✅ | ❌ |
| **日志管理** | ✅ | ❌ |
| **配置管理** | ✅ | ⚠️ 基础 |
| **文件附加** | ✅ | ❌ |
| **图片附加** | ✅ | ❌ |
| **交互模式** | ✅ | ⚠️ 简单 |
| **需要后台服务** | ✅ 是 | ❌ 否 |
| **启动速度** | ⚠️ 较慢 | ✅ 快速 |
| **配置复杂度** | ⚠️ 复杂 | ✅ 简单 |

---

## 🚀 使用指南

### A. cline (官方 CLI)

#### 1. 基本用法

```bash
# 直接执行任务
cline "创建一个 Python 脚本"

# PLAN 模式（默认）
cline "重构代码" --mode plan

# ACT 模式（自动执行）
cline "添加功能" --mode act

# 完全自主模式
cline "修复 Bug" --oneshot

# YOLO 模式（非交互）
cline "生成文档" --yolo
```

#### 2. 附加文件

```bash
# 附加单个文件
cline "审查这个文件" --file src/app.js

# 附加多个文件
cline "比较这些文件" --file file1.js --file file2.js

# 附加图片
cline "分析这个截图" --image screenshot.png
```

#### 3. 任务管理

```bash
# 列出所有任务
cline task list

# 查看任务详情
cline task show <task-id>

# 继续任务
cline task resume <task-id>

# 取消任务
cline task cancel <task-id>

# 删除任务
cline task delete <task-id>
```

#### 4. 配置管理

```bash
# 认证配置
cline auth

# 查看配置
cline config show

# 设置配置
cline config set <key> <value>

# 重置配置
cline config reset
```

#### 5. 实例管理

```bash
# 列出实例
cline instance list

# 启动新实例
cline instance start

# 停止实例
cline instance stop <instance-id>
```

#### 6. 日志管理

```bash
# 查看日志
cline logs

# 跟踪日志
cline logs --follow

# 清理日志
cline logs clean
```

#### 7. 管道输入

```bash
# 从标准输入读取
echo "创建 TODO 应用" | cline

# 从文件读取
cat prompt.txt | cline --yolo
```

---

### B. @yaegaki/cline-cli (社区版)

#### 1. 基本用法

```bash
# 执行任务
cline-cli task "创建一个 Python 脚本"

# 指定工作目录
cline-cli task "重构代码" --workspace /path/to/project

# 完全自动模式
cline-cli task "添加功能" --full-auto
```

#### 2. 恢复任务

```bash
# 恢复上次任务
cline-cli task --resume

# 恢复或创建新任务
cline-cli task "开发功能" --resume-or-new
```

#### 3. 自定义指令

```bash
# 提供额外指令
cline-cli task "创建组件" \
  --custom-instructions "使用 TypeScript，遵循 ESLint"
```

---

## 💡 推荐使用场景

### 使用 cline (官方 CLI) 的场景

✅ **需要完整的任务管理**
```bash
# 多任务并行处理
cline "任务1" &
cline "任务2" &
cline task list  # 查看所有任务
```

✅ **需要 PLAN/ACT 分离**
```bash
# 先规划
cline "开发新功能" --mode plan

# 后执行
cline task resume <task-id> --mode act
```

✅ **需要附加文件或图片**
```bash
cline "审查这些文件" \
  --file src/auth.js \
  --file src/api.js \
  --image architecture.png
```

✅ **团队协作，需要统一的任务记录**
```bash
# 所有任务都有记录和 ID
cline task list
cline logs  # 查看历史
```

---

### 使用 @yaegaki/cline-cli 的场景

✅ **快速简单的一次性任务**
```bash
# 快速启动，无需配置后台服务
cline-cli task "创建 README"
```

✅ **脚本自动化**
```bash
#!/bin/bash
# 在脚本中使用，简单直接
cline-cli task "自动化任务" --full-auto
```

✅ **不需要任务历史**
```bash
# 执行完就忘记，不留记录
cline-cli task "临时分析代码"
```

✅ **配置简单，直接使用**
```bash
# 一次配置，到处使用
cline-cli init
cline-cli task "任务描述"
```

---

## ⚙️ 配置对比

### cline (官方) 配置

```bash
# 配置文件位置（根据系统不同）
~/.config/cline/config.yaml
~/.cline/config.yaml

# 认证
cline auth

# 查看配置
cline config show

# 设置
cline config set api.provider anthropic
cline config set api.model claude-sonnet-4-5-20250929
```

### @yaegaki/cline-cli 配置

```bash
# 配置文件位置
~/.cline_cli/cline_cli_settings.json

# 初始化
cline-cli init

# 手动编辑配置
nano ~/.cline_cli/cline_cli_settings.json
```

**配置示例**：
```json
{
  "globalState": {
    "apiProvider": "anthropic",
    "apiModelId": "claude-sonnet-4-5-20250929",
    "anthropicBaseUrl": "https://claude.csdrew.site/api",
    "anthropicApiKey": "your-api-key",
    "autoApprovalSettings": {
      "enabled": true,
      "actions": {
        "readFiles": true,
        "editFiles": true,
        "executeSafeCommands": true
      },
      "maxRequests": 50
    }
  }
}
```

---

## 🎯 实战示例对比

### 场景 1: 创建新项目

**使用 cline (官方)**:
```bash
# PLAN 模式先规划
cline "创建一个 Express.js API 项目" \
  --mode plan \
  --file requirements.txt

# 审查计划后执行
cline task resume <task-id> --mode act
```

**使用 @yaegaki/cline-cli**:
```bash
# 直接执行
cd ~/projects
cline-cli task "创建一个 Express.js API 项目" --full-auto
```

---

### 场景 2: 代码审查

**使用 cline (官方)**:
```bash
# 附加多个文件进行审查
cline "审查这些文件的代码质量" \
  --file src/auth.js \
  --file src/api.js \
  --file src/db.js \
  --mode plan
```

**使用 @yaegaki/cline-cli**:
```bash
# 在项目目录中审查
cd ~/projects/my-app
cline-cli task "审查 src/ 目录中的代码质量"
```

---

### 场景 3: Bug 修复

**使用 cline (官方)**:
```bash
# 带上下文信息
cline "修复登录功能的 TypeError" \
  --file src/auth.js \
  --file logs/error.log \
  --oneshot
```

**使用 @yaegaki/cline-cli**:
```bash
# 简单直接
cd ~/projects/my-app
cline-cli task "修复 src/auth.js 中的 TypeError" --full-auto
```

---

## 🔄 两者结合使用

### 策略：根据需求选择合适的工具

```bash
# 1. 重要项目 → 使用官方 CLI（有记录）
cd ~/projects/production-app
cline "添加用户认证功能" --mode plan

# 2. 快速任务 → 使用社区版（快速）
cline-cli task "生成 README" --full-auto

# 3. 代码审查 → 使用官方 CLI（附加文件）
cline "审查代码" --file *.js --mode plan

# 4. 脚本自动化 → 使用社区版（简单）
cline-cli task "自动化测试" --full-auto
```

---

## 📝 别名建议

在 `~/.bashrc` 中添加：

```bash
# 官方 CLI 别名
alias c='cline'
alias cp='cline --mode plan'
alias ca='cline --mode act'
alias co='cline --oneshot'
alias cy='cline --yolo'
alias ctask='cline task'
alias clist='cline task list'
alias clogs='cline logs'

# 社区版 CLI 别名
alias ct='cline-cli task'
alias cta='cline-cli task --full-auto'
alias ctr='cline-cli task --resume'

# 重新加载
source ~/.bashrc
```

**使用示例**：
```bash
# 官方 CLI
cp "规划功能"  # plan 模式
co "快速修复"  # oneshot 模式
clist          # 列出任务

# 社区版
ct "创建文件"  # 普通任务
cta "重构"     # 自动模式
```

---

## 🐛 故障排查

### cline (官方) 常见问题

**Q: 提示 "Cannot connect to Cline Core"**
```bash
# 检查 Cline Core 是否运行
# 需要在 VS Code 中启动 Cline 扩展

# 或检查地址配置
cline config show | grep address

# 修改地址
cline config set core.address localhost:50052
```

**Q: 任务卡住不动**
```bash
# 查看任务状态
cline task list

# 取消任务
cline task cancel <task-id>

# 查看日志
cline logs --follow
```

---

### @yaegaki/cline-cli 常见问题

**Q: API 认证失败**
```bash
# 检查配置
cat ~/.cline_cli/cline_cli_settings.json

# 重新初始化
cline-cli init

# 手动设置 API Key
nano ~/.cline_cli/cline_cli_settings.json
```

**Q: 任务执行超时**
```bash
# 增加最大请求数
# 编辑配置文件：
"autoApprovalSettings": {
  "maxRequests": 100  # 增加这个值
}
```

---

## 📚 参考文档

### cline (官方)
- **使用手册**: `man cline`
- **GitHub**: https://github.com/cline/cline
- **官网**: https://cline.bot

### @yaegaki/cline-cli
- **详细指南**: `/home/averyubuntu/projects/mcp-install/CLINE_CLI_DIRECT_USAGE.md`
- **GitHub**: https://github.com/yaegaki/cline-cli
- **NPM**: https://www.npmjs.com/package/@yaegaki/cline-cli

---

## 🎓 最佳实践

### 1. 混合使用策略

```bash
# 早上规划任务（官方 CLI）
cline "今天的开发任务" --mode plan

# 快速执行小任务（社区版）
cline-cli task "生成文档" --full-auto

# 晚上审查代码（官方 CLI）
cline "代码审查" --file src/*.js --mode plan
```

### 2. 项目工作流

```bash
# 1. 项目初始化（社区版 - 快速）
mkdir my-app && cd my-app
cline-cli task "初始化 Node.js 项目"

# 2. 功能开发（官方 - 完整）
cline "添加用户认证" --mode plan
cline task resume <task-id> --mode act

# 3. 测试和修复（社区版 - 简单）
cline-cli task "添加单元测试" --full-auto
```

### 3. 团队协作

```bash
# 团队成员 A：使用官方 CLI 创建任务
cline "开发支付模块" --mode plan

# 任务 ID: task-123

# 团队成员 B：继续任务
cline task resume task-123 --mode act

# 查看团队所有任务
cline task list
```

---

## ✅ 快速决策指南

**选择 cline (官方) 如果**:
- ✅ 需要任务历史和管理
- ✅ 多人协作项目
- ✅ 需要分步规划和执行
- ✅ 需要附加文件/图片
- ✅ 不介意配置复杂度

**选择 @yaegaki/cline-cli 如果**:
- ✅ 个人快速任务
- ✅ 脚本自动化
- ✅ 一次性临时工作
- ✅ 不需要任务历史
- ✅ 想要简单配置

**建议**: **两个都保留，根据场景灵活选择！**

---

**最后更新**: 2025-01-08  
**文档版本**: v1.0
