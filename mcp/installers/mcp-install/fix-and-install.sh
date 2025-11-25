#!/bin/bash

################################################################################
# NVM 安装修复脚本
# 解决代理问题并重新安装 NVM 和 Node.js
################################################################################

echo "========================================"
echo "  修复并安装 NVM + Node.js"
echo "========================================"
echo ""

# 步骤 1: 检查并临时禁用 git 代理
echo "步骤 1: 检查 git 代理设置..."
HTTP_PROXY=$(git config --global --get http.proxy 2>/dev/null)
HTTPS_PROXY=$(git config --global --get https.proxy 2>/dev/null)

if [ -n "$HTTP_PROXY" ] || [ -n "$HTTPS_PROXY" ]; then
    echo "⚠ 检测到 git 代理配置："
    [ -n "$HTTP_PROXY" ] && echo "  http.proxy = $HTTP_PROXY"
    [ -n "$HTTPS_PROXY" ] && echo "  https.proxy = $HTTPS_PROXY"
    echo ""
    echo "这可能导致连接问题。临时取消代理..."
    git config --global --unset http.proxy
    git config --global --unset https.proxy
    echo "✓ 代理已临时取消"
else
    echo "✓ 未检测到代理配置"
fi

echo ""

# 步骤 2: 清理旧的 NVM 安装
echo "步骤 2: 清理旧的 NVM 安装..."
if [ -d ~/.nvm ]; then
