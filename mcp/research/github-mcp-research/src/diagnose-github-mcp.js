#!/usr/bin/env node

/**
 * GitHub MCP 连接诊断脚本
 * 用于诊断 GitHub MCP Server 的连接问题
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

class GitHubMCPDiagnostic {
  constructor() {
    this.configPath = path.join(
      process.env.HOME,
      '.vscode-server/data/User/globalStorage/anthropic.claude-code/settings/cline_mcp_settings.json'
    );
    this.results = {
      timestamp: new Date().toISOString(),
      checks: [],
      issues: [],
      recommendations: []
    };
  }

  log(message, type = 'info') {
    const prefix = {
      'success': `${colors.green}✓${colors.reset}`,
      'error': `${colors.red}✗${colors.reset}`,
      'warning': `${colors.yellow}⚠${colors.reset}`,
      'info': `${colors.cyan}ℹ${colors.reset}`
    };
    console.log(`${prefix[type]} ${message}`);
  }

  header(text) {
    console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}${text}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
  }

  // 1. 检查配置文件
  checkConfigFile() {
    this.header('检查 MCP 配置文件');
    
    try {
      if (!fs.existsSync(this.configPath)) {
        this.log('配置文件不存在', 'error');
        this.results.issues.push({
          severity: 'critical',
          issue: '配置文件不存在',
          path: this.configPath
        });
        return null;
      }

      this.log('配置文件存在', 'success');
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      
      if (!config.mcpServers || !config.mcpServers.github) {
        this.log('GitHub MCP 未配置', 'error');
        this.results.issues.push({
          severity: 'critical',
          issue: 'GitHub MCP Server 未配置'
        });
        return null;
      }

      this.log('GitHub MCP 已配置', 'success');
      
      // 检查是否被禁用
      if (config.mcpServers.github.disabled) {
        this.log('GitHub MCP 已被禁用', 'warning');
        this.results.issues.push({
          severity: 'high',
          issue: 'GitHub MCP Server 被禁用',
          solution: '在配置中设置 "disabled": false'
        });
      }

      return config.mcpServers.github;
    } catch (error) {
      this.log(`配置文件读取失败: ${error.message}`, 'error');
      this.results.issues.push({
        severity: 'critical',
        issue: '配置文件读取失败',
        error: error.message
      });
      return null;
    }
  }

  // 2. 检查 Token
  checkToken(githubConfig) {
    this.header('检查 GitHub Token');
    
    if (!githubConfig || !githubConfig.env || !githubConfig.env.GITHUB_TOKEN) {
      this.log('GitHub Token 未配置', 'error');
      this.results.issues.push({
        severity: 'critical',
        issue: 'GITHUB_TOKEN 未配置'
      });
      return null;
    }

    const token = githubConfig.env.GITHUB_TOKEN;
    this.log('Token 已配置', 'success');
    
    // 验证 Token 格式
    if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
      this.log('Token 格式可能不正确', 'warning');
      this.results.issues.push({
        severity: 'medium',
        issue: 'Token 格式异常',
        detail: 'GitHub Token 应以 ghp_ 或 github_pat_ 开头'
      });
    }

    return token;
  }

  // 3. 测试 Token 有效性
  async testTokenValidity(token) {
    this.header('测试 Token 有效性');
    
    return new Promise((resolve) => {
      const options = {
        hostname: 'api.github.com',
        path: '/user',
        method: 'GET',
        headers: {
          'Authorization': `token ${token}`,
          'User-Agent': 'GitHub-MCP-Diagnostic'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const user = JSON.parse(data);
            this.log(`Token 有效，用户: ${user.login}`, 'success');
            this.results.checks.push({
              check: 'token_validity',
              status: 'success',
              user: user.login,
              repos: user.public_repos
            });
            resolve({ valid: true, user });
          } else if (res.statusCode === 401) {
            this.log('Token 无效或已过期', 'error');
            this.results.issues.push({
              severity: 'critical',
              issue: 'Token 认证失败',
              statusCode: res.statusCode
            });
            resolve({ valid: false, statusCode: res.statusCode });
          } else {
            this.log(`Token 验证失败: HTTP ${res.statusCode}`, 'error');
            this.results.issues.push({
              severity: 'high',
              issue: 'Token 验证异常',
              statusCode: res.statusCode
            });
            resolve({ valid: false, statusCode: res.statusCode });
          }
        });
      });

      req.on('error', (error) => {
        this.log(`网络错误: ${error.message}`, 'error');
        this.results.issues.push({
          severity: 'critical',
          issue: '网络连接失败',
          error: error.message
        });
        resolve({ valid: false, error: error.message });
      });

      req.end();
    });
  }

  // 4. 检查 API 限流
  async checkRateLimit(token) {
    this.header('检查 API 限流状态');
    
    return new Promise((resolve) => {
      const options = {
        hostname: 'api.github.com',
        path: '/rate_limit',
        method: 'GET',
        headers: {
          'Authorization': `token ${token}`,
          'User-Agent': 'GitHub-MCP-Diagnostic'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const rateLimit = JSON.parse(data);
            const core = rateLimit.resources.core;
            const search = rateLimit.resources.search;
            
            this.log(`Core API: ${core.remaining}/${core.limit}`, 'info');
            this.log(`Search API: ${search.remaining}/${search.limit}`, 'info');
            
            if (core.remaining < 100) {
              this.log('Core API 限流接近上限', 'warning');
              this.results.issues.push({
                severity: 'medium',
                issue: 'API 限流接近上限',
                remaining: core.remaining,
                resetTime: new Date(core.reset * 1000).toISOString()
              });
            }
            
            if (search.remaining < 5) {
              this.log('Search API 限流接近上限', 'warning');
              this.results.issues.push({
                severity: 'medium',
                issue: 'Search API 限流接近上限',
                remaining: search.remaining,
                resetTime: new Date(search.reset * 1000).toISOString()
              });
            }

            this.results.checks.push({
              check: 'rate_limit',
              status: 'success',
              core: { remaining: core.remaining, limit: core.limit },
              search: { remaining: search.remaining, limit: search.limit }
            });
            
            resolve(rateLimit);
          } else {
            this.log(`限流检查失败: HTTP ${res.statusCode}`, 'error');
            resolve(null);
          }
        });
      });

      req.on('error', (error) => {
        this.log(`网络错误: ${error.message}`, 'error');
        resolve(null);
      });

      req.end();
    });
  }

  // 5. 测试 Search API
  async testSearchAPI(token) {
    this.header('测试 Search API');
    
    return new Promise((resolve) => {
      const options = {
        hostname: 'api.github.com',
        path: '/search/repositories?q=stars:>50000&per_page=3',
        method: 'GET',
        headers: {
          'Authorization': `token ${token}`,
          'User-Agent': 'GitHub-MCP-Diagnostic'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const result = JSON.parse(data);
            this.log(`Search API 工作正常 (找到 ${result.total_count} 个仓库)`, 'success');
            this.results.checks.push({
              check: 'search_api',
              status: 'success',
              totalCount: result.total_count
            });
            resolve({ success: true, result });
          } else if (res.statusCode === 422) {
            this.log('Search API 查询参数错误', 'warning');
            this.results.issues.push({
              severity: 'medium',
              issue: 'Search API 查询失败',
              statusCode: res.statusCode,
              detail: data
            });
            resolve({ success: false, statusCode: res.statusCode });
          } else if (res.statusCode === 403) {
            this.log('Search API 被限流', 'warning');
            this.results.issues.push({
              severity: 'high',
              issue: 'Search API 被限流',
              statusCode: res.statusCode
            });
            resolve({ success: false, statusCode: res.statusCode });
          } else {
            this.log(`Search API 测试失败: HTTP ${res.statusCode}`, 'error');
            resolve({ success: false, statusCode: res.statusCode });
          }
        });
      });

      req.on('error', (error) => {
        this.log(`网络错误: ${error.message}`, 'error');
        resolve({ success: false, error: error.message });
      });

      req.end();
    });
  }

  // 6. 检查 npx 和 Node.js
  checkNodeEnvironment() {
    this.header('检查 Node.js 环境');
    
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      this.log(`Node.js 版本: ${nodeVersion}`, 'success');
      
      const npxVersion = execSync('npx --version', { encoding: 'utf8' }).trim();
      this.log(`npx 版本: ${npxVersion}`, 'success');
      
      this.results.checks.push({
        check: 'node_environment',
        status: 'success',
        nodeVersion,
        npxVersion
      });
    } catch (error) {
      this.log('Node.js 环境检查失败', 'error');
      this.results.issues.push({
        severity: 'critical',
        issue: 'Node.js 环境问题',
        error: error.message
      });
    }
  }

  // 7. 生成建议
  generateRecommendations() {
    this.header('诊断建议');
    
    const recommendations = [];
    
    // 基于发现的问题生成建议
    if (this.results.issues.length === 0) {
      recommendations.push('✓ 未发现明显问题，GitHub MCP 配置正常');
    } else {
      const criticalIssues = this.results.issues.filter(i => i.severity === 'critical');
      const highIssues = this.results.issues.filter(i => i.severity === 'high');
      
      if (criticalIssues.length > 0) {
        recommendations.push('⚠ 发现严重问题，需要立即修复:');
        criticalIssues.forEach(issue => {
          recommendations.push(`  - ${issue.issue}`);
          if (issue.solution) {
            recommendations.push(`    解决方案: ${issue.solution}`);
          }
        });
      }
      
      if (highIssues.length > 0) {
        recommendations.push('⚠ 发现重要问题:');
        highIssues.forEach(issue => {
          recommendations.push(`  - ${issue.issue}`);
          if (issue.solution) {
            recommendations.push(`    解决方案: ${issue.solution}`);
          }
        });
      }
    }
    
    // 通用建议
    recommendations.push('\n通用建议:');
    recommendations.push('1. 定期检查 GitHub Token 是否过期');
    recommendations.push('2. 监控 API 限流状态，避免频繁调用');
    recommendations.push('3. 使用正确的用户名进行搜索');
    recommendations.push('4. 重启 VS Code 以重新加载 MCP 配置');
    recommendations.push('5. 查看 VS Code 开发者工具的控制台错误信息');
    
    this.results.recommendations = recommendations;
    
    recommendations.forEach(rec => console.log(rec));
  }

  // 8. 保存诊断报告
  saveReport() {
    const reportPath = path.join(__dirname, '../logs/github-mcp-diagnostic.json');
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    this.log(`\n诊断报告已保存到: ${reportPath}`, 'success');
  }

  // 主诊断流程
  async run() {
    console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║        GitHub MCP 连接诊断工具                              ║
║        GitHub MCP Connection Diagnostic Tool                ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

    // 1. 检查配置
    const githubConfig = this.checkConfigFile();
    if (!githubConfig) {
      this.generateRecommendations();
      this.saveReport();
      return;
    }

    // 2. 检查 Token
    const token = this.checkToken(githubConfig);
    if (!token) {
      this.generateRecommendations();
      this.saveReport();
      return;
    }

    // 3. 测试 Token
    const tokenResult = await this.testTokenValidity(token);
    if (!tokenResult.valid) {
      this.generateRecommendations();
      this.saveReport();
      return;
    }

    // 4. 检查限流
    await this.checkRateLimit(token);

    // 5. 测试 Search API
    await this.testSearchAPI(token);

    // 6. 检查环境
    this.checkNodeEnvironment();

    // 7. 生成建议
    this.generateRecommendations();

    // 8. 保存报告
    this.saveReport();

    console.log(`\n${colors.bright}${colors.green}诊断完成！${colors.reset}\n`);
  }
}

// 运行诊断
const diagnostic = new GitHubMCPDiagnostic();
diagnostic.run().catch(error => {
  console.error(`${colors.red}诊断过程出错: ${error.message}${colors.reset}`);
  process.exit(1);
});
