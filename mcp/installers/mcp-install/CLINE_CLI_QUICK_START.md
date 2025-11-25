# cline-cli 快速开始指南

## ✅ 安装状态

**安装时间**: 2025-01-08  
**版本**: @yaegaki/cline-cli  
**状态**: ✅ 已安装并配置完成  
**测试**: ✅ 已通过测试

## 🚀 立即开始使用

### 基本命令

```bash
# 在当前目录执行任务
cline-cli task "你的任务描述"

# 指定工作目录
cline-cli task "任务描述" --workspace /path/to/project

# 完全自动模式（不需要确认）
cline-cli task "任务描述" --full-auto
```

### 实用示例

#### 1. 代码开发
```bash
cd /home/averyubuntu/projects/my-project
cline-cli task "创建一个 Express.js API，包含用户认证"
```

#### 2. 代码审查
```bash
cline-cli task "审查 src/ 目录中的代码，提出改进建议"
```

#### 3. Bug 修复
```bash
cline-cli task "修复 TypeError 错误，文件位于 src/utils/auth.js"
```

#### 4. 添加测试
```bash
cline-cli task "为 src/api.js 添加单元测试"
```

#### 5. 文档生成
```bash
cline-cli task "为这个项目生成 README.md 文档"
```

## 📝 配置文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 主配置 | `~/.cline_cli/cline_cli_settings.json` | API 配置、自动批准设置 |
| MCP 配置 | `~/.cline_cli/storage/settings/cline_mcp_settings.json` | MCP 服务器配置（可选） |

### 当前配置
- **API Provider**: Anthropic (自定义 BaseURL)
- **模型**: claude-sonnet-4-5-20250929
- **自动批准**: ✅ 启用（读文件、编辑文件、安全命令、MCP）
- **最大请求数**: 50

## 💡 便捷别名

在 `~/.bashrc` 中添加：

```bash
# cline-cli 快捷命令
alias ct='cline-cli task'
alias cta='cline-cli task --full-auto'

# 重新加载
source ~/.bashrc
```

使用别名后：
```bash
ct "创建README"          # 普通模式
cta "重构代码"          # 全自动模式
```

## 🎯 工作流示例

### 工作流 1: 创建新项目
```bash
mkdir ~/projects/my-app && cd ~/projects/my-app
cline-cli task "创建一个 React + TypeScript 项目，包含基础配置"
```

### 工作流 2: 代码重构
```bash
cd ~/projects/existing-project
cline-cli task "重构 src/utils 目录，提高可维护性" --full-auto
```

### 工作流 3: 添加功能
```bash
cd ~/projects/my-api
cline-cli task "添加用户认证功能，使用 JWT"
```

### 工作流 4: 调试问题
```bash
cd ~/projects/buggy-app
cline-cli task "调查并修复应用启动时的错误"
```

## ⚙️ 高级选项

### 查看帮助
```bash
cline-cli --help
cline-cli task --help
```

### 恢复上次任务
```bash
cline-cli task --resume
```

### 提供自定义指令
```bash
cline-cli task "创建组件" --custom-instructions "使用函数组件和 TypeScript"
```

## ⚠️ 注意事项

1. **自动批准已启用**: 当前配置会自动批准大多数操作
2. **API 成本**: 每次任务会消耗 API 调用额度
3. **工作目录**: 默认使用当前目录，建议明确指定 `--workspace`
4. **功能限制**: 
   - ❌ 不支持 `browser_action`
   - ❌ 不支持 `execute_command`

## 📚 更多文档

- **详细指南**: `/home/averyubuntu/projects/mcp-install/CLINE_CLI_DIRECT_USAGE.md`
- **GitHub**: https://github.com/yaegaki/cline-cli
- **Cline 官方**: https://cline.bot

## ✅ 验证安装

```bash
# 检查版本
cline-cli --version

# 查看配置
cat ~/.cline_cli/cline_cli_settings.json

# 简单测试
cd /tmp
echo "Hello" > test.txt
cline-cli task "读取 test.txt 并告诉我内容"
```

---

**最后更新**: 2025-01-08  
**状态**: ✅ 可以使用
