#!/usr/bin/env node

/**
 * n8n工作流备份脚本
 * 从n8n实例获取所有工作流并保存为JSON文件
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

async function backupWorkflows(baseUrl, apiKey, outputDir = './n8n-backup') {
  console.log('🚀 n8n Workflows Backup');
  console.log('=======================');
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

    console.log('📋 Fetching workflows...');

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

    // 保存每个工作流（并发处理以提高速度）
    let successCount = 0;
    let errorCount = 0;

    console.log('📥 Downloading workflow details...');

    // 并发获取工作流详情（最多5个并发请求）
    const batchSize = 5;
    for (let i = 0; i < workflows.length; i += batchSize) {
      const batch = workflows.slice(i, i + batchSize);
      const promises = batch.map(async (workflow) => {
        try {
          // 获取完整的工作流详情
          const detailResponse = await axios.get(`${baseUrl}api/v1/workflows/${workflow.id}`, {
            headers,
            timeout: 15000 // 减少超时时间
          });

          if (detailResponse.status === 200) {
            const workflowData = detailResponse.data.data;

            // 创建安全的文件名
            const safeName = workflowData.name
              .replace(/[^a-zA-Z0-9\s\-_]/g, '_') // 替换特殊字符
              .replace(/\s+/g, '_') // 替换空格
              .substring(0, 100); // 限制长度

            const filename = `${workflowData.id}_${safeName}.json`;
            const filepath = path.join(outputDir, filename);

            // 保存工作流数据
            fs.writeFileSync(filepath, JSON.stringify(workflowData, null, 2), 'utf8');

            console.log(`✅ Saved: ${filename}`);
            return { success: true, id: workflow.id };
          } else {
            console.log(`❌ Failed to get details for workflow ${workflow.id}: ${detailResponse.status}`);
            return { success: false, id: workflow.id };
          }
        } catch (error) {
          console.log(`❌ Error processing workflow ${workflow.id}: ${error.message}`);
          return { success: false, id: workflow.id };
        }
      });

      const results = await Promise.all(promises);
      results.forEach(result => {
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      });
    }

    // 创建README文件
    const readmeContent = `# n8n Workflows Backup

This repository contains backups of n8n workflows from instance: ${baseUrl}

## Backup Information

- **Backup Date**: ${new Date().toISOString()}
- **Source URL**: ${baseUrl}
- **Total Workflows**: ${workflows.length}
- **Successfully Backed Up**: ${successCount}
- **Errors**: ${errorCount}

## Files

Each \`.json\` file contains a complete n8n workflow definition, including:
- Workflow metadata (name, ID, timestamps)
- Node configurations
- Connections between nodes
- Settings and static data

## Restoring Workflows

To restore a workflow to n8n:

1. Open your n8n instance
2. Go to Workflows
3. Click "Import from File"
4. Select the desired \`.json\` file

## Notes

- Workflows are saved with their original IDs
- Active/inactive status is preserved
- Credentials are NOT included in the backup (for security)
`;

    fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent, 'utf8');

    console.log('');
    console.log('🎉 Backup completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Total workflows: ${workflows.length}`);
    console.log(`   - Successfully backed up: ${successCount}`);
    console.log(`   - Errors: ${errorCount}`);
    console.log(`   - Output directory: ${outputDir}`);

    return {
      total: workflows.length,
      success: successCount,
      errors: errorCount,
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
  const outputDir = process.argv[2] || './n8n-workflows-backup';

  try {
    await backupWorkflows(baseUrl, apiKey, outputDir);
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Create a GitHub repository (private recommended)');
    console.log('   2. Initialize git in the backup directory:');
    console.log(`      cd ${outputDir}`);
    console.log('      git init');
    console.log('      git add .');
    console.log('      git commit -m "Initial backup of n8n workflows"');
    console.log('      git remote add origin <your-repo-url>');
    console.log('      git push -u origin main');
  } catch (error) {
    console.error('💥 Backup process failed');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { backupWorkflows };
