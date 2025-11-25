# Averivendell n8n - 本地 Docker 部署

## 🎯 项目简介

**Averivendell n8n** 是专为本地开发和测试优化的 n8n 工作流自动化平台 Docker 部署方案。与云端部署（如 Hugging Face Spaces）相比，本地部署提供了更强大的功能、更高的性能和更好的开发体验。

### 🌟 核心优势

- **🚀 完整功能**：支持所有 n8n 节点和功能，无任何限制
- **💾 数据持久化**：本地存储，确保数据安全和隐私
- **⚡ 高性能**：无网络延迟，本地处理所有工作流
- **🔧 完全控制**：自定义配置、数据库选择、扩展安装
- **🎨 VSCode 集成**：无缝集成到开发环境
- **🔒 隐私保护**：所有数据存储在本地，不依赖第三方服务

### 📊 与云端部署对比

| 特性 | Averivendell n8n (本地) | Hugging Face Spaces (云端) |
|------|-------------------------|---------------------------|
| **功能完整性** | ✅ 100% 完整 | ⚠️ 受限（DNS封锁、自动休眠） |
| **数据持久化** | ✅ 本地存储 | ❌ 临时存储 |
| **性能** | ✅ 本地高速 | ⚠️ 网络延迟 |
| **隐私** | ✅ 完全私有 | ❌ 依赖第三方 |
| **自定义** | ✅ 完全控制 | ❌ 受平台限制 |
| **成本** | ✅ 免费 | ⚠️ 可能产生费用 |
| **Telegram集成** | ✅ 完全支持 | ❌ DNS封锁 |
| **开发体验** | ✅ VSCode集成 | ❌ 分离环境 |

## 🎯 适用场景

### ✅ 推荐使用本地部署的场景

1. **开发和测试**
   - 工作流开发和调试
   - 新节点测试
   - 复杂工作流原型设计

2. **完整功能需求**
   - Telegram/WhatsApp 集成
   - 自定义节点开发
   - 大量数据处理

3. **隐私和安全要求**
   - 敏感数据处理
   - 内部工具开发
   - 企业级应用

4. **性能要求**
   - 高频工作流执行
   - 大数据量处理
   - 实时响应需求

### ⚠️ 适合云端部署的场景

1. **演示和分享**
   - 向他人展示工作流
   - 临时测试功能
   - 原型快速验证

2. **轻量使用**
   - 简单的工作流
   - 不频繁的使用
   - 学习和探索

3. **临时需求**
   - 一次性任务
   - 短期项目
   - 概念验证

### 🔄 部署策略建议

```
复杂工作流开发 → 本地部署 (Averivendell n8n)
├── 功能完整，无限制
├── 高效开发环境
└── 数据持久化

原型验证/演示 → 云端部署 (Hugging Face)
├── 快速启动
├── 易于分享
└── 零配置
```

## 🚀 快速开始

### 前置要求

1. **安装 Docker 和 Docker Compose**
   - 确保 Docker Desktop 已安装并运行
   - 在 WSL 2 中启用 Docker 集成

2. **验证 Docker 安装**
   ```bash
   docker --version
   docker compose version
   ```

### 部署步骤

1. **启动 n8n**
   ```bash
   cd Averivendell_n8n
   docker compose up -d
   ```

2. **查看启动状态**
   ```bash
   docker compose ps
   ```

3. **查看日志**
   ```bash
   docker compose logs -f n8n
   ```

4. **访问 n8n**
   - 打开浏览器访问: http://localhost:5678
   - 用户名: `admin`
   - 密码: `avery_n8n_2025`

## 📁 项目结构

```
Averivendell_n8n/
├── docker-compose.yml    # Docker Compose 配置
├── .env                  # 环境变量配置
├── n8n_data/            # 数据持久化目录
└── README.md            # 本文档
```

## ⚙️ 配置说明

### 基本配置

- **端口**: 5678
- **数据库**: SQLite (默认)
- **认证**: 基础认证已启用

### 环境变量

主要配置项已在 `.env` 文件中设置：

- `N8N_BASIC_AUTH_USER=admin`
- `N8N_BASIC_AUTH_PASSWORD=avery_n8n_2025`
- `N8N_ENCRYPTION_KEY=avery_n8n_secret_key_2025`

### 数据持久化

所有 n8n 数据存储在 `./n8n_data` 目录中，包括：
- 工作流配置
- 凭据
- 执行历史
- 数据库文件

## 🛠️ 管理命令

### 启动服务
```bash
docker compose up -d
```

### 停止服务
```bash
docker compose down
```

### 重启服务
```bash
docker compose restart
```

### 查看日志
```bash
# 查看所有服务日志
docker compose logs

# 查看 n8n 日志
docker compose logs n8n

# 实时查看日志
docker compose logs -f n8n
```

### 更新 n8n
```bash
# 拉取最新镜像
docker compose pull

# 重启服务
docker compose up -d
```

## 🔧 高级配置

### 使用 PostgreSQL 数据库

如果需要使用 PostgreSQL 而不是 SQLite：

1. 取消注释 `docker-compose.yml` 中的 postgres 服务
2. 修改 `.env` 文件中的数据库配置：
   ```env
   DB_TYPE=postgresdb
   DB_POSTGRESDB_HOST=postgres
   DB_POSTGRESDB_DATABASE=n8n
   DB_POSTGRESDB_USER=n8n
   DB_POSTGRESDB_PASSWORD=n8n_password
   ```

3. 重启服务：
   ```bash
   docker compose down
   docker compose up -d
   ```

### 添加 Redis 缓存

如果需要 Redis 用于队列和缓存：

1. 取消注释 `docker-compose.yml` 中的 redis 服务
2. 重启服务

## 🔒 安全注意事项

1. **更改默认密码**: 生产环境请修改 `N8N_BASIC_AUTH_PASSWORD`
2. **加密密钥**: 生产环境请修改 `N8N_ENCRYPTION_KEY`
3. **网络访问**: 默认只绑定到 localhost，如需外部访问请修改配置

## 🐛 故障排除

### 常见问题

1. **端口冲突**
   - 检查 5678 端口是否被占用
   - 修改 `docker-compose.yml` 中的端口映射

2. **权限问题**
   - 确保 Docker 有权限访问 `./n8n_data` 目录

3. **启动失败**
   - 检查 Docker Desktop 是否运行
   - 查看详细日志: `docker compose logs`

### 日志位置

- Docker 日志: `docker compose logs`
- n8n 应用日志: `./n8n_data/.n8n/logs/`

## 🎨 在 VSCode 中预览 n8n

不想打开单独的浏览器窗口？可以在 VSCode 中直接预览 n8n！

### 方法 1：使用 HTML 预览页面

1. **启动 n8n 服务**：
   ```bash
   cd Averivendell_n8n
   ./start.sh
   ```

2. **在 VSCode 中打开预览**：
   - 在 VSCode 中打开 `n8n-preview.html` 文件
   - 右键点击文件，选择 "Open with Live Server"（需要安装 Live Server 扩展）
   - 或者使用 VSCode 的内置预览功能

3. **享受集成体验**：
   - n8n 界面直接嵌入在 VSCode 标签页中
   - 自动状态检查和连接监控
   - 一键刷新和状态查询

### 方法 2：使用 VSCode 任务

1. **打开命令面板**：`Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
2. **运行任务**：
   - "Tasks: Run Task" → 选择 "启动 n8n"
   - "Tasks: Run Task" → 选择 "在浏览器中打开 n8n"

### 方法 3：使用 VSCode 的 Simple Browser

1. **打开命令面板**：`Ctrl+Shift+P`
2. **输入**：`Simple Browser: Show`
3. **输入 URL**：`http://localhost:5678`

## 📋 VSCode 集成特性

### HTML 预览页面特性

- ✅ **无缝集成**：n8n 界面嵌入 VSCode 标签页
- ✅ **状态监控**：实时显示连接状态
- ✅ **自动检查**：定期验证 n8n 服务状态
- ✅ **错误处理**：友好的错误提示和恢复选项
- ✅ **一键操作**：刷新、状态检查等便捷功能

### VSCode 任务支持

项目包含完整的 VSCode 任务配置：

- **启动 n8n**：一键启动 Docker 容器
- **停止 n8n**：优雅关闭服务
- **重启 n8n**：重新启动服务
- **查看日志**：实时查看 Docker 日志
- **打开浏览器**：在系统浏览器中打开 n8n

## 📚 相关资源

- [n8n 官方文档](https://docs.n8n.io/)
- [n8n Docker 文档](https://docs.n8n.io/hosting/installation/docker/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [VSCode Live Server 扩展](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## 📞 支持

如果遇到问题，请检查：
1. Docker Desktop 是否正常运行
2. WSL 2 集成是否启用
3. 端口 5678 是否被占用
4. 日志中的错误信息
5. VSCode 扩展是否正确安装（Live Server）

### VSCode 特定问题

**预览页面无法加载**：
- 确保 n8n 服务正在运行
- 检查浏览器控制台的 CORS 错误
- 尝试刷新页面或重启 n8n 服务

**Live Server 不工作**：
- 安装 Live Server 扩展
- 确保端口 5500 未被占用
- 检查 VSCode 设置中的 Live Server 配置

---

**部署时间**: 2025-11-11
**维护者**: AI Assistant
