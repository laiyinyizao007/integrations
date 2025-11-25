# ============================================
# n8n 自定义 Docker 镜像
# 基于官方 n8n 镜像，添加 socket.io 支持
# ============================================

FROM n8nio/n8n:latest

# 切换到 root 用户以安装全局包
USER root

# 安装 socket.io-client（全局安装）
# 这允许在 n8n 工作流中使用 WebSocket 功能
RUN npm install -g socket.io-client

# 切换回 node 用户（安全最佳实践）
USER node

# 设置工作目录
WORKDIR /data

# 复制自定义入口脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh

# 设置入口脚本为可执行
USER root
RUN chmod +x /docker-entrypoint.sh
USER node

# 使用自定义入口脚本
ENTRYPOINT ["/docker-entrypoint.sh"]

# 暴露 n8n 默认端口
EXPOSE 5678

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5678/healthz || exit 1

# 元数据标签
LABEL maintainer="n8n GCP Deployment"
LABEL description="Custom n8n image with socket.io support for GCP deployment"
LABEL version="1.0"
