# 🚀 n8n + Ngrok 快速开始指南

## ⚡ 5分钟快速配置

### 第1步: 赋予脚本执行权限
```bash
cd /home/averyubuntu/projects/Averivendell_n8n
chmod +x update-ngrok-url.sh restart-n8n.sh
```

### 第2步: 启动 ngrok
在项目根目录运行：
```bash
cd /home/averyubuntu/projects
./start-ngrok.sh 5678
```

保持这个终端窗口打开。

### 第3步: 更新 n8n 配置
打开**新终端**，运行：
```bash
cd /home/averyubuntu/projects/Averivendell_n8n
bash update-ngrok-url.sh
```

### 第4步: 重启 n8n
```bash
bash restart-n8n.sh
```

### 第5步: 访问 n8n
脚本会显示访问地址，或者查看 ngrok Web 界面：
```
http://localhost:4040
```

复制 HTTPS URL 并在浏览器中打开。

## 📋 常用命令

### 查看 ngrok URL
```bash
# 方法1: ngrok Web界面
open http://localhost:4040

# 方法2: 命令行查询
curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'

# 方法3: 使用工具
cd /home/averyubuntu/projects/grok-auto-url
./scripts/ngrok-cli.sh url
```

### 查看 n8n 日志
```bash
cd /home/averyubuntu/projects/Averivendell_n8n
docker compose logs -f n8n
```

### 停止服务
```bash
# 停止 n8n
cd /home/averyubuntu/projects/Averivendell_n8n
docker compose down

# 停止 ngrok
pkill ngrok
```

## 🔄 每次系统重启后

由于 ngrok 免费版 URL 会变化，每次重启后需要：

```bash
# 1. 启动 ngrok
cd /home/averyubuntu/projects
./start-ngrok.sh 5678 &

# 2. 等待3秒
sleep 3

# 3. 更新配置并重启 n8n
cd Averivendell_n8n
bash update-ngrok-url.sh
bash restart-n8n.sh
```

或者创建一键启动脚本（可选）：
```bash
# 创建 start-all.sh
cat > /home/averyubuntu/projects/Averivendell_n8n/start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 启动 n8n + ngrok..."
cd /home/averyubuntu/projects
./start-ngrok.sh 5678 > /dev/null 2>&1 &
sleep 3
cd Averivendell_n8n
bash update-ngrok-url.sh
bash restart-n8n.sh
EOF

chmod +x /home/averyubuntu/projects/Averivendell_n8n/start-all.sh
```

然后每次只需运行：
```bash
cd /home/averyubuntu/projects/Averivendell_n8n
./start-all.sh
```

## 🎯 验证工作正常

### 1. 检查 ngrok
```bash
curl -s http://localhost:4040/api/tunnels | jq
```

应该看到 tunnel 信息。

### 2. 检查 n8n
```bash
cd /home/averyubuntu/projects/Averivendell_n8n
docker compose ps
```

应该看到 `Averivendell_n8n` 容器状态为 `Up`。

### 3. 测试访问
访问 ngrok URL，应该能看到 n8n 登录页面。

默认登录信息（在 `.env` 中配置）：
- 用户名: `admin`
- 密码: `avery_n8n_2025`

## ❗ 故障排查

### ngrok 无法启动
```bash
# 检查是否已有 ngrok 进程
ps aux | grep ngrok

# 如有冲突，停止所有
pkill ngrok

# 重新启动
./start-ngrok.sh 5678
```

### n8n 无法访问
```bash
# 检查容器状态
docker compose ps

# 查看日志
docker compose logs n8n

# 重启
docker compose restart
```

### URL 无法自动获取
手动配置：
1. 访问 http://localhost:4040
2. 复制 HTTPS URL
3. 编辑 `.env` 文件：
```bash
nano .env
# 找到 WEBHOOK_URL=... 
# 替换为你的 ngrok URL
```
4. 重启 n8n：
```bash
bash restart-n8n.sh
```

## 📚 更多信息

详细配置和高级功能，请查看：
- [NGROK_SETUP.md](./NGROK_SETUP.md) - 完整配置指南
- [README.md](./README.md) - 项目总体说明

---

**快速帮助**: 如有问题，先查看 `NGROK_SETUP.md` 的故障排查部分。
