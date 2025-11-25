#!/usr/bin/env node

/**
 * 简单的连接测试脚本
 * 用于测试与Hugging Face Spaces上n8n实例的连接
 *
 * 支持两种配置方式：
 * 1. 命令行参数: node test-connection.js <url> [api-key]
 * 2. 环境变量: N8N_BASE_URL 和 N8N_API_KEY
 */

const axios = require('axios');
require('dotenv').config();

async function testConnection(baseUrl, apiKey) {
  console.log(`🔗 Testing connection to: ${baseUrl}`);
  console.log(`🔑 Using API key: ${apiKey ? 'Yes' : 'No'}`);

  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(apiKey && { 'X-N8N-API-KEY': apiKey })
    };

    const timeout = process.env.N8N_TIMEOUT || 10000;
    console.log(`⏱️  Timeout: ${timeout}ms`);

    const response = await axios.get(`${baseUrl}api/v1/workflows`, {
      headers,
      timeout: parseInt(timeout)
    });

    console.log(`📡 Response status: ${response.status}`);
    console.log(`📄 Response data type: ${typeof response.data}`);
    console.log(`📋 Response data keys:`, Object.keys(response.data || {}));

    if (response.status === 200) {
      console.log('✅ Connection successful!');

      // 检查不同的响应格式
      let workflows = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        workflows = response.data.data;
      } else if (Array.isArray(response.data)) {
        workflows = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // 可能是直接的workflow对象数组
        workflows = Object.values(response.data).filter(item => typeof item === 'object' && item.id);
      }

      console.log(`📊 Found ${workflows.length} workflows`);

      // 显示前几个工作流
      workflows.slice(0, 3).forEach(workflow => {
        if (workflow && workflow.name) {
          console.log(`  - ${workflow.name} (${workflow.active ? 'Active' : 'Inactive'})`);
        }
      });

      return true;
    } else {
      console.log(`❌ Unexpected response status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Connection failed:');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Response headers:`, error.response.headers);
      console.error(`  Response data:`, JSON.stringify(error.response.data, null, 2));
    } else if (error.code) {
      console.error(`  Network error: ${error.code}`);
      console.error(`  Error message: ${error.message}`);
    } else {
      console.error(`  Error: ${error.message}`);
    }
    return false;
  }
}

// 获取配置（优先级：命令行参数 > 环境变量）
function getConfig() {
  const args = process.argv.slice(2);

  // 如果提供了命令行参数，使用命令行参数
  if (args.length >= 1) {
    return {
      baseUrl: args[0],
      apiKey: args[1] || null
    };
  }

  // 否则使用环境变量
  const baseUrl = process.env.N8N_BASE_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!baseUrl) {
    console.error('❌ No configuration found!');
    console.log('');
    console.log('Please provide configuration in one of these ways:');
    console.log('');
    console.log('1. Command line arguments:');
    console.log('   node test-connection.js <n8n-url> [api-key]');
    console.log('   Example: node test-connection.js https://your-space.hf.space your-api-key');
    console.log('');
    console.log('2. Environment variables (.env file):');
    console.log('   N8N_BASE_URL=https://your-space.hf.space');
    console.log('   N8N_API_KEY=your-api-key-here  # optional');
    console.log('');
    console.log('3. Run setup script:');
    console.log('   ./setup-env.sh');
    process.exit(1);
  }

  return { baseUrl, apiKey };
}

// 主函数
async function main() {
  console.log('🚀 n8n Connection Test');
  console.log('======================');

  const { baseUrl, apiKey } = getConfig();

  console.log(`📍 Target URL: ${baseUrl}`);
  console.log(`🔐 API Key: ${apiKey ? 'Configured' : 'Not configured'}`);
  console.log('');

  const success = await testConnection(baseUrl, apiKey);

  console.log('');
  if (success) {
    console.log('🎉 Connection test completed successfully!');
    console.log('   Your n8n instance is ready to use with the VSCode extension.');
  } else {
    console.log('💥 Connection test failed!');
    console.log('   Please check your configuration and n8n instance.');
  }

  process.exit(success ? 0 : 1);
}

main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
