#!/bin/bash

# n8n Workflows Backup - Push to GitHub Script
# 用于将备份推送到GitHub私有仓库

echo "🚀 n8n Workflows Backup - GitHub Push Script"
echo "============================================"

# 检查Git状态
if ! git status >/dev/null 2>&1; then
    echo "❌ Error: Not a Git repository"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "📝 Committing changes..."
    git add .
    git commit -m "Update n8n workflows backup - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 获取远程仓库URL
REMOTE_URL=$(git remote get-url origin 2>/dev/null)

if [ -z "$REMOTE_URL" ]; then
    echo "❌ No remote repository configured"
    echo ""
    echo "📋 To set up GitHub repository:"
    echo "1. Go to https://github.com and create a new PRIVATE repository"
    echo "2. Copy the repository URL (e.g., https://github.com/yourusername/n8n-workflows-backup.git)"
    echo "3. Run the following commands:"
    echo ""
    echo "   git remote add origin YOUR_REPOSITORY_URL"
    echo "   git push -u origin master"
    echo ""
    echo "Or run this script again after setting up the remote."
    exit 1
fi

echo "📡 Pushing to: $REMOTE_URL"

# 推送到GitHub
if git push -u origin master; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🔗 Repository: $REMOTE_URL"
    echo ""
    echo "📊 Backup Summary:"
    echo "   - Total workflows: 25"
    echo "   - Source: https://starlightavery8-n8n-free.hf.space/"
    echo "   - Backup type: Quick metadata backup"
    echo "   - Last updated: $(date)"
    echo ""
    echo "🔒 Security Note:"
    echo "   - Repository is configured as PRIVATE"
    echo "   - API keys are excluded via .gitignore"
    echo "   - Only workflow metadata is stored"
else
    echo ""
    echo "❌ Push failed. Possible reasons:"
    echo "   - Authentication issues (check your GitHub token/credentials)"
    echo "   - Repository doesn't exist"
    echo "   - Network connectivity issues"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Verify GitHub repository exists and is accessible"
    echo "   2. Check your GitHub credentials/token"
    echo "   3. Try: git push --force-with-lease origin master"
    exit 1
fi
