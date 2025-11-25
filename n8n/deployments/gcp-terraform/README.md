# n8n GCP 自动化部署项目

> 在 Google Cloud Platform (GCP) 免费层上自动部署 n8n 工作流自动化平台

基于 [danielraffel/n8n-gcp](https://github.com/danielraffel/n8n-gcp) 项目，添加了中文支持和优化配置。

## 📋 项目概述

本项目提供了一套完整的自动化脚本，用于在 GCP 的 e2-micro 免费实例上部署 n8n，包括：

- ✅ 自动化的 GCP 基础设施配置（使用 Terraform）
- ✅ Docker 和 Docker Compose 自动安装
- ✅ 自定义 n8n 镜像（包含 socket.io 支持）
- ✅ Cloudflare Tunnel SSL 加密
- ✅ FastAPI 集成（可选）
- ✅ 中文文档和优化配置

## 🎯 功能特性

### 自动化部署
- Python 脚本自动化整个部署流程
- Terraform 管理 GCP 基础设施
- 一键式服务器配置

### 免费使用
- 使用 GCP 免费层 e2-micro 实例
- 30GB 标准持久磁盘
- 标准网络层静态 IP

### 安全性
- Cloudflare Tunnel 提供 SSL 加密
- 不需要开放防火墙端口
- 自动 HTTPS 访问

### 可扩展性
- 自定义 Docker 镜像
- 支持社区节点
- FastAPI 后端集成
- 数据持久化存储

## 📦 前置要求

### 必需工具

1. **Terraform** - 基础设施即代码工具
   ```bash
   # 安装 Terraform
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   unzip terraform_1.6.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   terraform --version
   ```

2. **Google Cloud SDK** - GCP 命令行工具
   ```bash
   # 安装 gcloud
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

3. **Python 3** - 运行部署脚本
   ```bash
   python3 --version  # 应该显示 Python 3.x
   ```

4. **SSH 密钥** - 用于服务器访问
   ```bash
   # 生成 SSH 密钥（如果还没有）
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

### GCP 账号准备

1. 创建或登录 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Compute Engine API
4. 配置 gcloud CLI：
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

### Cloudflare 账号

1. 注册 [Cloudflare](https://www.cloudflare.com/) 账号
2. 添加你的域名到 Cloudflare
3. 将域名的 DNS 服务器指向 Cloudflare

## 🚀 快速开始

### 1. 克隆项目

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/n8n-gcp-deployment.git
cd n8n-gcp-deployment
```

### 2. 配置部署参数

编辑 `setup.py`，修改以下必填配置：

```python
# 必填配置
n8n_hostname = "n8n.yourdomain.com"  # 你的域名
ssh_key = "username:ssh-rsa YOUR_SSH_PUBLIC_KEY"  # SSH 公钥
ssh_private_key_path = "/home/username/.ssh/gcp"  # SSH 私钥路径
ssh_user = "username"  # SSH 用户名

# 可选配置（根据需要修改）
region = "asia-east1"  # GCP 区域（香港）
```

**获取 SSH 公钥：**
```bash
cat ~/.ssh/id_rsa.pub
# 复制输出，格式：username:ssh-rsa AAAAB3NzaC1yc2EA...
```

### 3. 运行部署脚本

```bash
# 检查前置条件
python3 setup.py --check

# 开始部署
python3 setup.py
```

脚本会自动：
- 获取 GCP 项目 ID
- 创建服务账号密钥
- 创建或获取静态 IP
- 生成 Terraform 配置文件

### 4. 初始化 Terraform

```bash
terraform init
```

### 5. 预览部署计划

```bash
terraform plan
```

检查输出，确认配置正确。

### 6. 执行部署

```bash
terraform apply
```

输入 `yes` 确认部署。部署大约需要 5-10 分钟。

### 7. SSH 到服务器

```bash
# Terraform 输出会显示 SSH 命令
ssh -i ~/.ssh/gcp username@YOUR_STATIC_IP
```

### 8. 安装服务器组件

```bash
# 安装 Docker 和 n8n
sudo sh /opt/setup_server.sh

# 配置 Cloudflare Tunnel
sudo sh /opt/setup_cloudflare.sh
```

**Cloudflare 配置步骤：**
1. 脚本会显示一个 URL
2. 在浏览器中打开该 URL
3. 选择你的域名
4. 点击 "Authorize" 授权
5. 返回终端，配置会自动完成

### 9. 访问 n8n

等待 DNS 传播（通常 2-5 分钟），然后访问：

```
https://n8n.yourdomain.com
```

首次访问时设置管理员账号和密码。

## 📂 项目结构

```
n8n-gcp-deployment/
├── setup.py                    # 主部署脚本
├── setup.tf                    # Terraform 配置（自动生成）
├── service-account-key.json    # GCP 服务账号密钥（自动生成）
├── README.md                   # 本文件
├── QUICK_START.md              # 快速开始指南
├── .env.example                # 环境变量示例
├── .gitignore                  # Git 忽略文件
├── scripts/                    # 服务器脚本目录
│   ├── setup_server.sh         # 服务器安装脚本
│   ├── setup_cloudflare.sh     # Cloudflare Tunnel 配置
│   └── updater.sh              # 系统更新脚本
├── config/                     # 配置文件目录
│   ├── Dockerfile              # n8n 自定义镜像
│   ├── docker-compose.yml      # Docker Compose 配置
│   ├── docker-entrypoint.sh    # Docker 入口脚本
│   └── docker-compose.service  # Systemd 服务文件
├── docs/                       # 文档目录
└── terraform/                  # Terraform 模块（可选）
```

## 🔧 配置说明

### n8n 环境变量

在 `config/docker-compose.yml` 中配置：

```yaml
environment:
  - N8N_HOST=n8n.yourdomain.com
  - WEBHOOK_URL=https://n8n.yourdomain.com/
  - N8N_PORT=5678
  - TZ=Asia/Shanghai
  - NODE_FUNCTION_ALLOW_EXTERNAL=socket.io,socket.io-client
```

### GCP 区域选择

支持的区域（免费层）：
- `us-west1` - 美国俄勒冈州
- `us-central1` - 美国爱荷华州
- `us-east1` - 美国南卡罗来纳州
- `asia-east1` - 台湾（推荐，亚洲地区延迟低）

### 自定义 Docker 镜像

编辑 `config/Dockerfile` 添加其他 npm 包：

```dockerfile
# 安装额外的包
RUN npm install -g package-name
```

## 📖 常用命令

### 服务管理

```bash
# 查看服务状态
sudo systemctl status docker-compose.service

# 重启服务
sudo systemctl restart docker-compose.service

# 查看日志
sudo docker compose logs -f

# 查看 n8n 日志
sudo docker logs -f $(sudo docker ps -q -f name=n8n)
```

### 更新系统

```bash
# SSH 到服务器
ssh -i ~/.ssh/gcp username@YOUR_IP

# 运行更新脚本
sudo sh /opt/updater.sh
```

更新脚本会：
- 更新 Docker 和 Cloudflare Tunnel
- 拉取最新的 n8n 镜像
- 重新构建并重启服务
- 清理未使用的镜像

### Cloudflare Tunnel 管理

```bash
# 查看 tunnel 列表
sudo cloudflared tunnel list

# 查看 tunnel 状态
sudo systemctl status cloudflared

# 查看 tunnel 日志
sudo journalctl -u cloudflared -f

# 重启 tunnel
sudo systemctl restart cloudflared
```

### Docker 管理

```bash
# 查看运行中的容器
sudo docker ps

# 查看所有容器
sudo docker ps -a

# 停止所有容器
sudo docker compose down

# 启动服务
sudo docker compose up -d

# 重新构建并启动
sudo docker compose up -d --build
```

## 🛠️ 故障排除

### 问题 1: n8n 无法访问

**症状**：访问 https://n8n.yourdomain.com 显示 404 或超时

**解决方案**：
```bash
# 1. 检查 n8n 容器是否运行
sudo docker ps | grep n8n

# 2. 检查 n8n 日志
sudo docker logs $(sudo docker ps -q -f name=n8n)

# 3. 检查 Cloudflare Tunnel 状态
sudo systemctl status cloudflared

# 4. 检查 tunnel 日志
sudo journalctl -u cloudflared -n 50

# 5. 重启服务
sudo systemctl restart docker-compose.service
sudo systemctl restart cloudflared
```

### 问题 2: Cloudflare Tunnel 认证失败

**症状**：setup_cloudflare.sh 执行失败

**解决方案**：
```bash
# 1. 检查是否已登录
sudo cloudflared tunnel list

# 2. 重新登录
sudo cloudflared tunnel login

# 3. 删除旧 tunnel（如果存在）
sudo cloudflared tunnel delete tunnel-name

# 4. 重新运行配置脚本
sudo sh /opt/setup_cloudflare.sh
```

### 问题 3: Docker 容器启动失败

**症状**：docker compose up 失败

**解决方案**：
```bash
# 1. 检查 Docker 服务
sudo systemctl status docker

# 2. 检查 docker-compose.yml 语法
cd /opt
sudo docker compose config

# 3. 查看详细错误
sudo docker compose up

# 4. 重新构建镜像
sudo docker compose build --no-cache
sudo docker compose up -d
```

### 问题 4: 磁盘空间不足

**症状**：No space left on device

**解决方案**：
```bash
# 1. 检查磁盘使用情况
df -h

# 2. 清理 Docker 资源
sudo docker system prune -a --volumes

# 3. 清理系统包缓存
sudo apt clean
sudo apt autoclean

# 4. 查找大文件
sudo du -sh /* | sort -h
```

## 💰 成本估算

### GCP 免费层（始终免费）
- **实例类型**：e2-micro
- **vCPU**：0.25-2.0（共享）
- **内存**：1 GB
- **磁盘**：30 GB 标准持久磁盘
- **网络**：标准层静态 IP
- **流量**：1 GB 出站流量/月

**费用**：$0/月（在免费层限额内）

### 超出免费层后
- 额外磁盘：~$1.70/月（每 10GB）
- 额外流量：~$0.12/GB
- 如果关闭但保留静态 IP：~$3/月

**建议**：定期监控使用情况，避免超出免费额度。

## 📚 更多文档

- [快速开始指南](./QUICK_START.md) - 5 分钟快速部署
- [配置说明](./docs/CONFIGURATION.md) - 详细配置选项
- [故障排除](./docs/TROUBLESHOOTING.md) - 常见问题解决
- [n8n 官方文档](https://docs.n8n.io/) - n8n 使用指南
- [GCP 文档](https://cloud.google.com/docs) - Google Cloud 文档
- [Cloudflare Tunnel 文档](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) - Tunnel 配置

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。详见 [LICENSE](./LICENSE) 文件。

## 🙏 致谢

- [danielraffel/n8n-gcp](https://github.com/danielraffel/n8n-gcp) - 原始项目
- [n8n](https://n8n.io/) - 强大的工作流自动化平台
- [Cloudflare](https://www.cloudflare.com/) - 免费的 Tunnel 服务
- [Google Cloud Platform](https://cloud.google.com/) - 免费层云服务

## 📞 支持

遇到问题？

1. 查看 [故障排除](#-故障排除) 部分
2. 搜索现有的 [Issues](https://github.com/YOUR_USERNAME/n8n-gcp-deployment/issues)
3. 创建新的 Issue 描述你的问题

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**

Made with ❤️ for the n8n community
