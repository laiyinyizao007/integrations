# 快速开始指南

> ⏱️ 预计时间：20-30 分钟

本指南帮助你快速在 GCP 上部署 n8n。

## 📋 前置检查清单

在开始之前，确保你已准备好：

- [ ] GCP 账号（需要绑定信用卡，但使用免费层不收费）
- [ ] Cloudflare 账号
- [ ] 一个域名（托管在 Cloudflare）
- [ ] 本地已安装：Terraform、gcloud CLI、Python 3
- [ ] SSH 密钥对

## 🚀 部署步骤

### 步骤 1: 准备 GCP 项目（5 分钟）

```bash
# 1. 登录 GCP
gcloud auth login

# 2. 创建新项目（或使用现有项目）
gcloud projects create n8n-automation-project --name="n8n Automation"

# 3. 设置当前项目
gcloud config set project n8n-automation-project

# 4. 启用 Compute Engine API
gcloud services enable compute.googleapis.com
```

### 步骤 2: 克隆并配置项目（3 分钟）

```bash
# 1. 克隆项目
cd ~
git clone https://github.com/YOUR_USERNAME/n8n-gcp-deployment.git
cd n8n-gcp-deployment

# 2. 获取 SSH 公钥
cat ~/.ssh/id_rsa.pub
# 复制输出的内容

# 3. 编辑 setup.py
nano setup.py

# 修改以下配置：
# n8n_hostname = "n8n.yourdomain.com"  # 改为你的域名
# ssh_key = "username:ssh-rsa AAAAB3..."  # 粘贴你的 SSH 公钥
# ssh_private_key_path = "/home/username/.ssh/id_rsa"  # 你的私钥路径
# ssh_user = "username"  # 你的用户名
# region = "asia-east1"  # 可选，默认香港

# 保存并退出（Ctrl+X, Y, Enter）
```

### 步骤 3: 运行部署脚本（3 分钟）

```bash
# 1. 检查前置条件
python3 setup.py --check

# 2. 运行部署脚本
python3 setup.py

# 脚本会自动：
# - 获取项目 ID
# - 创建服务账号密钥
# - 创建静态 IP
# - 生成 Terraform 配置
```

### 步骤 4: Terraform 部署（5-10 分钟）

```bash
# 1. 初始化 Terraform
terraform init

# 2. 预览部署计划
terraform plan
# 检查输出，确认配置正确

# 3. 执行部署
terraform apply
# 输入 yes 确认

# 等待部署完成...
# 记下输出的静态 IP 地址
```

### 步骤 5: SSH 到服务器（1 分钟）

```bash
# 使用 Terraform 输出的 SSH 命令
ssh -i ~/.ssh/id_rsa username@YOUR_STATIC_IP

# 如果连接被拒绝，等待 1-2 分钟后重试
```

### 步骤 6: 安装服务器组件（5-8 分钟）

```bash
# 1. 安装 Docker 和 n8n
sudo sh /opt/setup_server.sh

# 等待安装完成...
# 当提示安装额外的包时，输入 y

# 2. 验证 Docker 运行
sudo docker ps
# 应该看到 n8n 和 fastapi 容器在运行
```

### 步骤 7: 配置 Cloudflare Tunnel（3-5 分钟）

```bash
# 运行 Cloudflare 配置脚本
sudo sh /opt/setup_cloudflare.sh

# 按照提示操作：
# 1. 会显示一个 URL（类似 https://dash.cloudflare.com/...）
# 2. 复制这个 URL 到浏览器打开
# 3. 在 Cloudflare 页面选择你的域名
# 4. 点击 "Authorize"
# 5. 返回终端，脚本会自动完成配置
```

### 步骤 8: 访问 n8n（2-5 分钟）

```bash
# 1. 退出 SSH
exit

# 2. 等待 DNS 传播（通常 2-5 分钟）

# 3. 在浏览器访问
https://n8n.yourdomain.com

# 4. 首次访问时设置：
# - 管理员邮箱
# - 管理员密码
# - 完成设置向导
```

## ✅ 验证部署

### 检查 n8n 是否正常运行

```bash
# SSH 到服务器
ssh -i ~/.ssh/id_rsa username@YOUR_STATIC_IP

# 1. 检查容器状态
sudo docker ps
# 应该看到 n8n 和 fastapi 容器状态为 "Up"

# 2. 检查 n8n 日志
sudo docker logs -f $(sudo docker ps -q -f name=n8n)
# 按 Ctrl+C 停止查看

# 3. 检查 Cloudflare Tunnel
sudo systemctl status cloudflared
# 应该显示 "active (running)"

# 4. 检查服务
sudo systemctl status docker-compose.service
```

### 测试 n8n 功能

1. 登录 n8n：https://n8n.yourdomain.com
2. 创建一个简单的工作流：
   - 点击 "New Workflow"
   - 添加 "Webhook" 节点
   - 添加 "Set" 节点
   - 连接节点
   - 点击 "Execute Workflow"
3. 如果工作流执行成功，说明部署正常！

## 🎯 下一步

### 基础配置

1. **配置备份**
   ```bash
   # 导出工作流
   # 在 n8n 界面: Settings > Export
   ```

2. **设置环境变量**
   ```bash
   # 编辑 docker-compose.yml
   cd /opt
   sudo nano docker-compose.yml
   # 修改 N8N_* 环境变量
   # 重启服务
   sudo docker compose restart
   ```

### 学习资源

- [n8n 官方文档](https://docs.n8n.io/)
- [n8n 社区论坛](https://community.n8n.io/)
- [n8n 工作流模板](https://n8n.io/workflows)
- [n8n YouTube 频道](https://www.youtube.com/c/n8n-io)

### 常见工作流示例

1. **自动化数据同步**
   - Google Sheets → Database
   - Email → Notion
   - Webhook → Multiple Services

2. **监控和告警**
   - 网站监控 → Telegram 通知
   - 服务器状态 → Email 告警
   - API 错误 → Slack 消息

3. **内容管理**
   - RSS → 社交媒体发布
   - 博客自动发布
   - 图片处理流水线

## ⚙️ 维护任务

### 每周检查

```bash
# SSH 到服务器
ssh -i ~/.ssh/id_rsa username@YOUR_IP

# 检查磁盘使用
df -h

# 查看容器状态
sudo docker ps

# 查看系统资源
top
```

### 每月更新

```bash
# SSH 到服务器
ssh -i ~/.ssh/id_rsa username@YOUR_IP

# 运行更新脚本
sudo sh /opt/updater.sh

# 脚本会自动：
# - 更新系统包
# - 更新 Docker
# - 更新 n8n
# - 更新 Cloudflare Tunnel
# - 重启服务
```

### 备份重要数据

```bash
# 1. 导出 n8n 工作流
# 在 n8n Web 界面: Settings > Export

# 2. 备份 n8n 数据卷
sudo docker run --rm \
  -v n8n_data:/data \
  -v $(pwd):/backup \
  ubuntu tar czf /backup/n8n-backup.tar.gz /data

# 3. 下载备份到本地
scp -i ~/.ssh/id_rsa username@YOUR_IP:~/n8n-backup.tar.gz .
```

## 🆘 遇到问题？

### 快速诊断

```bash
# 全面检查
ssh -i ~/.ssh/id_rsa username@YOUR_IP
sudo docker ps  # 检查容器
sudo systemctl status cloudflared  # 检查 Tunnel
sudo docker logs $(sudo docker ps -q -f name=n8n)  # 查看日志
```

### 常见问题

**Q: 无法访问 n8n**
```bash
# 1. 检查 DNS 是否已传播
nslookup n8n.yourdomain.com

# 2. 检查 Cloudflare Tunnel
ssh -i ~/.ssh/id_rsa username@YOUR_IP
sudo journalctl -u cloudflared -n 50
```

**Q: n8n 容器无法启动**
```bash
# 查看详细错误
cd /opt
sudo docker compose logs n8n

# 重新构建
sudo docker compose build --no-cache
sudo docker compose up -d
```

**Q: 磁盘空间不足**
```bash
# 清理 Docker
sudo docker system prune -a --volumes

# 清理系统
sudo apt clean
sudo apt autoclean
```

### 获取帮助

- 查看完整文档：[README.md](./README.md)
- 查看故障排除：README.md 中的故障排除部分
- 提交 Issue：[GitHub Issues](https://github.com/YOUR_USERNAME/n8n-gcp-deployment/issues)

## 🎉 完成！

恭喜！你已经成功在 GCP 上部署了 n8n。

现在你可以：
- ✅ 创建自动化工作流
- ✅ 连接各种服务和 API
- ✅ 构建强大的自动化流程
- ✅ 享受免费的云端自动化平台

**开始探索 n8n 的强大功能吧！** 🚀

---

**下一步阅读**：
- [完整文档](./README.md)
- [n8n 官方指南](https://docs.n8n.io/getting-started/)
- [工作流示例](https://n8n.io/workflows)
