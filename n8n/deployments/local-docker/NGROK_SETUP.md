# n8n Ngrok 配置指南

## 🎯 目标
将 ngrok 生成的公网 URL 配置到 n8n 环境中，使 n8n 可以接收外部 webhook 请求。

## 📋 配置步骤

### 方法 1: 自动配置（推荐）

#### 1. 启动 ngrok
在项目根目录运行：
```bash
./start-ngrok.sh 5678
```

或者使用 grok-auto-url 项目：
```bash
cd grok-auto-url
./scripts/ngrok-cli.sh start
```

#### 2. 自动更新配置
```bash
cd Averivendell_n8n
bash update-ngrok-url.sh
```

这个脚本会：
- 自动从 ngrok API 获取 URL
- 更新 `.env` 文件中的 `WEBHOOK_URL`
- 创建备份文件

#### 3. 重启 n8n 服务
```bash
bash restart-n8n.sh
```

### 方法 2: 手动配置

#### 1. 启动 ngrok
```bash
./start-ngrok.sh 5678
```

#### 2. 获取 ngrok URL
**选项 A**: 访问 ngrok Web 界面
```
http://localhost:4040
```

**选项 B**: 使用 API 查询
```bash
curl http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'
```

**选项 C**: 使用 grok-auto-url 工具
```bash
cd grok-auto-url
./scripts/ngrok-cli.sh url
```

#### 3. 编辑 .env 文件
打开 `Averivendell_n8n/.env`，找到：
```bash
WEBHOOK_URL=https://YOUR_NGROK_URL_HERE/
```

替换为实际的 ngrok URL：
```bash
WEBHOOK_URL=https://1234-56-78-90-123.ngrok-free.app/
```

#### 4. 重启 n8n
```bash
cd Averivendell_n8n
docker compose down
docker compose up -d
```

## 📁 文件说明

### `.env`
n8n 的环境变量配置文件，包含：
- 基础配置（端口、协议等）
- **WEBHOOK_URL**: ngrok 公网地址
- 安全配置（密钥、认证等）
- 数据库配置

### `update-ngrok-url.sh`
自动更新 ngrok URL 的脚本：
- 从 ngrok API 获取当前 URL
- 更新 `.env` 文件
- 创建备份

### `restart-n8n.sh`
快速重启 n8n 服务的脚本：
- 停止当前容器
- 重新启动
- 显示状态和访问地址

## 🔍 验证配置

### 1. 检查 n8n 状态
```bash
cd Averivendell_n8n
docker compose ps
```

应该看到 n8n 容器正在运行。

### 2. 检查环境变量
```bash
docker compose exec n8n env | grep WEBHOOK_URL
```

应该显示你配置的 ngrok URL。

### 3. 访问 n8n
打开浏览器访问 ngrok URL：
```
https://xxxx-xx-xx-xxx-xxx.ngrok-free.app
```

应该能看到 n8n 登录界面。

### 4. 测试 Webhook
在 n8n 中创建一个 Webhook 工作流：
1. 添加 Webhook 触发器节点
2. 获取 webhook URL（应该是 ngrok 地址）
3. 使用 curl 测试：
```bash
curl -X POST https://your-ngrok-url/webhook-test/xxxxx \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## ⚙️ 高级配置

### 固定 ngrok 域名（需要付费账户）
如果有 ngrok 付费账户，可以使用固定域名：

1. 编辑 `~/.ngrok2/ngrok.yml`：
```yaml
authtoken: YOUR_AUTH_TOKEN
tunnels:
  n8n:
    addr: 5678
    proto: http
    domain: your-fixed-domain.ngrok.io
```

2. 启动固定域名 tunnel：
```bash
ngrok start n8n
```

3. 更新 `.env`：
```bash
WEBHOOK_URL=https://your-fixed-domain.ngrok.io/
```

### 使用其他隧道服务
除了 ngrok，也可以使用：
- **Cloudflare Tunnel**: 免费，需要域名
- **LocalTunnel**: 免费开源
- **Serveo**: 免费，基于 SSH

## 🐛 故障排查

### 问题 1: 无法获取 ngrok URL
**症状**: `update-ngrok-url.sh` 提示无法获取 URL

**解决方案**:
1. 确认 ngrok 正在运行：
```bash
ps aux | grep ngrok
```

2. 检查 ngrok Web 界面：
```bash
curl http://localhost:4040/api/tunnels
```

3. 手动启动 ngrok：
```bash
./start-ngrok.sh 5678
```

### 问题 2: n8n 无法访问
**症状**: 访问 ngrok URL 时出现错误

**解决方案**:
1. 检查 n8n 容器状态：
```bash
docker compose ps
docker compose logs n8n
```

2. 确认端口映射正确：
```bash
docker compose port n8n 5678
```

3. 测试本地访问：
```bash
curl http://localhost:5678
```

### 问题 3: Webhook 不工作
**症状**: Webhook 请求没有触发工作流

**解决方案**:
1. 检查 WEBHOOK_URL 配置：
```bash
cat .env | grep WEBHOOK_URL
```

2. 在 n8n 中检查 webhook URL：
   - 应该以 ngrok URL 开头
   - 格式: `https://xxxx.ngrok-free.app/webhook/...`

3. 查看 n8n 日志：
```bash
docker compose logs -f n8n
```

### 问题 4: ngrok 限制
**免费版限制**:
- 每次启动 URL 会变化
- 连接数限制
- 带宽限制
- 每分钟请求数限制

**解决方案**:
- 升级到付费版获取固定域名
- 或使用其他隧道服务

## 📚 相关资源

### 文档
- [n8n 官方文档](https://docs.n8n.io/)
- [ngrok 文档](https://ngrok.com/docs)
- [Docker Compose 文档](https://docs.docker.com/compose/)

### 项目文件
- `docker-compose.yml` - n8n 容器配置
- `.env` - 环境变量
- `README.md` - 项目总体说明

### 相关脚本
- `start-ngrok.sh` - 启动 ngrok（项目根目录）
- `grok-auto-url/` - ngrok 自动管理工具
- `update-ngrok-url.sh` - 更新配置脚本
- `restart-n8n.sh` - 重启服务脚本

## 🎉 完成！

配置完成后，你的 n8n 实例可以：
- ✅ 通过公网访问
- ✅ 接收外部 webhook
- ✅ 与外部服务集成
- ✅ 在任何地方使用

## 💡 提示

1. **ngrok URL 变化时**: 重新运行 `update-ngrok-url.sh` 并重启 n8n

2. **开发环境**: 每次系统重启后需要重新获取 ngrok URL

3. **生产环境**: 建议使用固定域名或 VPS 部署

4. **安全性**: 
   - 修改 `.env` 中的默认密码
   - 使用强密码和密钥
   - 定期更新 n8n 版本

---

**更新日期**: 2025-11-12
**适用版本**: n8n latest, ngrok v3+
