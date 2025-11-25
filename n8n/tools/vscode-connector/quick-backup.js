#!/usr/bin/env node

/**
 * 快速n8n工作流备份脚本
 * 只备份工作流列表，不包含详细信息
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

async function quickBackup(baseUrl, apiKey, outputDir = './n8n-quick-backup') {
  console.log('🚀 Quick n8n Workflows Backup');
  console.log('=============================');
  console.log(`📍 Source: ${baseUrl}`);
  console.log(`📁 Output: ${outputDir}`);
  console.log('');

  try {
    // 创建输出目录
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Created directory: ${outputDir}`);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(apiKey && { 'X-N8N-API-KEY': apiKey })
    };

    console.log('📋 Fetching workflows list...');

    // 获取所有工作流
    const response = await axios.get(`${baseUrl}api/v1/workflows`, {
      headers,
      timeout: 30000
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch workflows: ${response.status}`);
    }

    const workflows = response.data.data || [];
    console.log(`📊 Found ${workflows.length} workflows`);

    if (workflows.length === 0) {
      console.log('⚠️  No workflows found to backup');
      return;
    }

    // 保存工作流列表
    const listFile = path.join(outputDir, 'workflows-list.json');
    fs.writeFileSync(listFile, JSON.stringify(workflows, null, 2), 'utf8');
    console.log(`✅ Saved workflows list: workflows-list.json`);

    // 保存每个工作流的元数据（快速版本）
    let savedCount = 0;
    for (const workflow of workflows.slice(0, 10)) { // 只处理前10个作为示例
      try {
        const filename = `${workflow.id}_metadata.json`;
        const filepath = path.join(outputDir, filename);

        // 保存基本元数据
        const metadata = {
          id: workflow.id,
          name: workflow.name,
          active: workflow.active,
          createdAt: workflow.createdAt,
          updatedAt: workflow.updatedAt,
          note: 'This is metadata only. Use full backup script for complete workflow data.'
        };

        fs.writeFileSync(filepath, JSON.stringify(metadata, null, 2), 'utf8');
        console.log(`✅ Saved metadata: ${filename}`);
        savedCount++;

        if (savedCount >= 10) break; // 限制数量
      } catch (error) {
        console.log(`❌ Error saving metadata for ${workflow.id}: ${error.message}`);
      }
    }

    // 创建README文件
    const readmeContent = `# Quick n8n Workflows Backup

This repository contains a quick backup of n8n workflows metadata from instance: ${baseUrl}

## Backup Information

- **Backup Date**: ${new Date().toISOString()}
- **Source URL**: ${baseUrl}
- **Total Workflows**: ${workflows.length}
- **Sample Metadata Saved**: ${savedCount}

## Files

- \`workflows-list.json\`: Complete list of all workflows
- \`*_metadata.json\`: Basic metadata for sample workflows

## Full Backup

For complete workflow backups (including node configurations), use the full backup script:
\`\`\`bash
node backup-workflows.js
\`\`\`

## Notes

- This is a metadata-only backup for quick reference
- Full workflow definitions are not included
- Credentials are NOT included in any backup (for security)
`;

    fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent, 'utf8');

    console.log('');
    console.log('🎉 Quick backup completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Total workflows: ${workflows.length}`);
    console.log(`   - Metadata samples saved: ${savedCount}`);
    console.log(`   - Output directory: ${outputDir}`);

    return {
      total: workflows.length,
      saved: savedCount,
      outputDir
    };

  } catch (error) {
    console.error('❌ Backup failed:');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data:`, error.response.data);
    } else {
      console.error(`  Error: ${error.message}`);
    }
    throw error;
  }
}

// 获取配置
function getConfig() {
  const baseUrl = process.env.N8N_BASE_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!baseUrl) {
    console.error('❌ N8N_BASE_URL environment variable not set');
    console.log('Please set the environment variable or create a .env file');
    process.exit(1);
  }

  return { baseUrl, apiKey };
}

// 主函数
async function main() {
  const { baseUrl, apiKey } = getConfig();
  const outputDir = process.argv[2] || './n8n-quick-backup';

  try {
    await quickBackup(baseUrl, apiKey, outputDir);
    console.log('');
    console.log('💡 Next steps for GitHub backup:');
    console.log('   1. Create a private GitHub repository');
    console.log('   2. Initialize git and push:');
    console.log(`      cd ${outputDir}`);
    console.log('      git init');
    console.log('      git add .');
    console.log('      git commit -m "Quick backup of n8n workflows metadata"');
    console.log('      git remote add origin https://github.com/yourusername/n8n-workflows-backup.git');
    console.log('      git push -u origin main');
    console.log('');
    console.log('🔄 For full workflow backup, run:');
    console.log('      node backup-workflows.js ../n8n-full-backup');
  } catch (error) {
    console.error('💥 Backup process failed');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { quickBackup };
