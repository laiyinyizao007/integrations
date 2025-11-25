# n8n Workflows GitHub Backup Guide

## 概述

本指南介绍如何将n8n工作流备份推送到GitHub私有仓库，实现安全的版本控制和备份存储。

## 📋 前提条件

- 已完成n8n工作流备份（见 `../n8n-vscode-connector/` 目录）
- Git已安装并配置
- GitHub账户

## 🚀 快速开始

### 步骤1: 创建GitHub私有仓库

1. 访问 [GitHub.com](https://github.com)
2. 点击 **"New repository"**
3. 填写信息：
   - **Repository name**: `n8n-workflows-backup` (或您喜欢的名称)
   - **Description**: `Backup of n8n workflows from Hugging Face Space`
   - **Visibility**: `Private` ⭐ **重要：选择私有仓库**
4. **不要** 初始化README、.gitignore或license
5. 点击 **"Create repository"**

### 步骤2: 复制仓库URL

在创建的仓库页面，复制仓库URL：
```
https://github.com/YOUR_USERNAME/n8n-workflows-backup.git
```

### 步骤3: 推送到GitHub

#### 方法A: 使用自动化脚本（推荐）

```bash
cd n8n-workflows-backup
./push-to-github.sh
```

当提示输入仓库URL时，粘贴您复制的URL。

#### 方法B: 手动推送

```bash
cd n8n-workflows-backup

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/n8n-workflows-backup.git

# 推送到GitHub
git push -u origin master
```

## 🔧 故障排除

### 认证问题

如果推送失败，可能需要配置GitHub认证：

#### 使用Personal Access Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 生成新的token（选择 `repo` 权限）
3. 使用token作为密码：
```bash
git push https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/n8n-workflows-backup.git
```

#### 使用SSH密钥

```bash
# 更改远程URL为SSH格式
git remote set-url origin git@github.com:YOUR_USERNAME/n8n-workflows-backup.git
git push -u origin master
```

### 分支名称问题

如果您的Git仓库使用 `main` 而不是 `master`：

```bash
# 重命名分支
git branch -m master main
git push -u origin main
```

## 📊 备份内容

### 包含的文件

- **`workflows-list.json`**: 完整的25个工作流列表
- **`*_metadata.json`**: 10个示例工作流的元数据
- **`README.md`**: 备份说明和恢复指南
- **`.gitignore`**: 安全配置，排除敏感信息

### 安全特性

- ✅ **私有仓库**: 只有您能访问
- ✅ **无敏感数据**: 不包含API密钥或凭据
- ✅ **元数据优先**: 只备份工作流结构和配置
- ✅ **版本控制**: 完整的Git历史记录

## 🔄 定期备份

### 设置自动备份

创建定时任务（cron）：

```bash
# 编辑crontab
crontab -e

# 添加每周备份（每周日凌晨2点）
0 2 * * 0 cd /path/to/n8n-vscode-connector && node quick-backup.js ../n8n-workflows-backup && cd ../n8n-workflows-backup && ./push-to-github.sh
```

### 手动更新备份

```bash
# 1. 运行备份
cd ../n8n-vscode-connector
node quick-backup.js ../n8n-workflows-backup

# 2. 推送到GitHub
cd ../n8n-workflows-backup
./push-to-github.sh
```

## 📖 恢复工作流

### 从GitHub恢复

1. 克隆备份仓库：
```bash
git clone https://github.com/YOUR_USERNAME/n8n-workflows-backup.git
cd n8n-workflows-backup
```

2. 查看可用工作流：
```bash
cat workflows-list.json | jq '.[] | {id, name, active}'
```

3. 恢复到n8n：
   - 打开您的n8n实例
   - 转到 Workflows
   - 点击 "Import from File"
   - 选择相应的JSON文件

## 🛡️ 安全注意事项

### 为什么使用私有仓库？

- 工作流可能包含业务逻辑
- 防止意外暴露配置信息
- 保护知识产权

### 备份不包含的内容

- ❌ API密钥和凭据
- ❌ 敏感配置数据
- ❌ 运行时状态信息

### 推荐的安全实践

1. **定期轮换**: 定期更新GitHub Personal Access Tokens
2. **访问控制**: 限制仓库访问权限
3. **监控**: 启用GitHub安全警报
4. **加密**: 考虑加密敏感备份文件

## 📞 支持

如果遇到问题：

1. 检查 `push-to-github.sh` 的错误输出
2. 验证GitHub认证配置
3. 确认仓库URL正确
4. 查看Git状态：`git status` 和 `git log`

## 📈 备份统计

- **总工作流数**: 25
- **备份类型**: 快速元数据备份
- **示例文件**: 10个工作流元数据
- **存储大小**: 约50KB
- **最后更新**: $(date)

---

**🎉 恭喜！您的n8n工作流现在已经安全地备份到GitHub私有仓库中。**
