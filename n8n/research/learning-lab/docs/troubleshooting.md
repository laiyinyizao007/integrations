# n8n故障排除指南

> 解决n8n学习和使用过程中的常见问题

## 🎯 快速诊断

### 问题分类

```
n8n问题诊断树
├── 🐳 Docker/环境问题
│   ├── 服务无法启动
│   ├── 端口冲突
│   └── 权限问题
├── 🔌 连接问题
│   ├── VSCode扩展无法连接
│   ├── API认证失败
│   └── 网络超时
├── ⚙️ 工作流执行问题
│   ├── 节点执行失败
│   ├── 数据格式错误
│   └── 超时问题
└── 📦 集成问题
    ├── 第三方API失败
    ├── 数据库连接问题
    └── Webhook不触发
```

## 🐳 Docker和环境问题

### 问题1：n8n服务无法启动

#### 症状
```bash
$ cd Averivendell_n8n
$ ./start.sh
Error: Cannot start service n8n: ...
```

#### 诊断步骤
```bash
# 1. 检查Docker是否运行
docker info

# 2. 检查Docker Compose版本
docker compose version

# 3. 查看详细错误日志
cd Averivendell_n8n
docker compose logs n8n

# 4. 检查端口占用
sudo netstat -tlnp | grep 5678
# 或
sudo lsof -i :5678
```

#### 解决方案

**方案A：端口被占用**
```bash
# 找到占用进程
sudo lsof -i :5678
# 输出: node    12345 user   21u  IPv4 0x... TCP *:5678 (LISTEN)

# 停止占用进程
sudo kill -9 12345

# 或者修改n8n端口
# 编辑 docker-compose.yml
ports:
  - "5679:5678"  # 改用5679端口
```

**方案B：权限问题**
```bash
# 确保当前用户在docker组
sudo usermod -aG docker $USER

# 重新登录或刷新组
newgrp docker

# 修复文件权限
cd Averivendell_n8n
sudo chown -R $USER:$USER n8n_data/
chmod -R 755 n8n_data/
```

**方案C：Docker资源不足**
```bash
# 检查Docker资源使用
docker system df

# 清理未使用的资源
docker system prune -a

# 重启Docker服务
sudo systemctl restart docker
```

### 问题2：n8n启动后无法访问

#### 症状
```bash
# 服务显示运行中
$ docker compose ps
NAME     STATUS    PORTS
n8n      Up        0.0.0.0:5678->5678/tcp

# 但浏览器无法访问 http://localhost:5678
```

#### 诊断步骤
```bash
# 1. 测试网络连接
curl http://localhost:5678

# 2. 检查容器日志
docker compose logs -f n8n

# 3. 进入容器检查
docker compose exec n8n sh
ps aux | grep n8n
```

#### 解决方案

**方案A：等待服务完全启动**
```bash
# n8n可能需要30-60秒启动
# 查看日志等待 "Editor is now accessible"
docker compose logs -f n8n
```

**方案B：防火墙阻止**
```bash
# 检查防火墙状态
sudo ufw status

# 允许5678端口
sudo ufw allow 5678/tcp

# 或临时关闭防火墙测试
sudo ufw disable
```

**方案C：环境变量配置错误**
```bash
# 检查 docker-compose.yml 中的环境变量
environment:
  - N8N_HOST=localhost  # 确保正确配置
  - N8N_PORT=5678
  - N8N_PROTOCOL=http

# 重启服务
docker compose down
docker compose up -d
```

### 问题3：数据持久化失败

#### 症状
```
重启n8n后，工作流和设置丢失
```

#### 诊断步骤
```bash
# 1. 检查数据卷
docker compose ps -a
docker volume ls

# 2. 检查数据目录
ls -la Averivendell_n8n/n8n_data/

# 3. 检查挂载点
docker compose exec n8n df -h
```

#### 解决方案

```bash
# 确保 docker-compose.yml 正确配置卷
volumes:
  - ./n8n_data:/home/node/.n8n

# 创建数据目录（如果不存在）
mkdir -p Averivendell_n8n/n8n_data
chmod 755 Averivendell_n8n/n8n_data

# 重启服务
cd Averivendell_n8n
docker compose down
docker compose up -d
```

## 🔌 连接和认证问题

### 问题4：VSCode扩展无法连接n8n

#### 症状
```
VSCode中执行 "n8n: Connect to Instance"
显示: ❌ 连接失败
```

#### 诊断步骤
```bash
# 1. 验证n8n服务运行
curl http://localhost:5678/rest/workflows

# 2. 检查扩展环境变量
cd n8n-vscode-connector
cat .env

# 3. 测试API连接
curl -X GET http://localhost:5678/rest/workflows \
  -H "X-N8N-API-KEY: your-api-key"
```

#### 解决方案

**方案A：环境变量未配置**
```bash
cd n8n-vscode-connector

# 创建 .env 文件
cat > .env << EOF
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=
N8N_TIMEOUT=30000
EOF

# 在VSCode中重新加载窗口
# Ctrl+Shift+P → Developer: Reload Window
```

**方案B：API密钥错误**
```bash
# 在n8n界面获取API密钥
# 访问 http://localhost:5678
# Settings → API → Generate API Key

# 更新 .env 文件
echo "N8N_API_KEY=n8n_api_1234567890abcdef" >> .env
```

**方案C：URL配置错误**
```bash
# 如果n8n运行在不同端口或主机
# 更新 .env 文件
N8N_BASE_URL=http://192.168.1.100:5678  # 使用实际IP
# 或
N8N_BASE_URL=https://your-n8n.example.com  # 云端实例
```

**方案D：扩展未正确编译**
```bash
cd n8n-vscode-connector

# 重新安装依赖
rm -rf node_modules
npm install

# 重新编译
npm run compile

# 重新安装扩展
code --uninstall-extension your-publisher.n8n-vscode-connector
code --install-extension n8n-vscode-connector-1.0.0.vsix
```

### 问题5：API认证失败

#### 症状
```
401 Unauthorized 或 403 Forbidden
```

#### 解决方案

```bash
# 1. 重新生成API密钥
# 在n8n界面：Settings → API → Revoke & Generate New Key

# 2. 更新所有使用API密钥的地方
# - .env 文件
# - VSCode settings.json
# - 自定义脚本

# 3. 验证API密钥
curl -X GET http://localhost:5678/rest/workflows \
  -H "X-N8N-API-KEY: your-new-api-key" \
  -v

# 4. 检查API密钥权限
# 确保API密钥有正确的作用域
```

## ⚙️ 工作流执行问题

### 问题6：节点执行失败

#### 症状
```
节点显示红色错误图标
Error: [Node name] node failed
```

#### 诊断步骤

1. **查看错误详情**
   - 点击错误节点
   - 查看右侧面板的错误信息
   - 检查输入/输出数据

2. **检查前置节点输出**
   ```javascript
   // 在Function节点中调试
   console.log('Input data:', $input.item.json);
   console.log('Previous node data:', $node['Previous Node'].json);
   return $input.item.json;
   ```

3. **查看n8n日志**
   ```bash
   docker compose logs -f n8n | grep -i error
   ```

#### 常见错误和解决方案

**错误A：数据格式不匹配**
```javascript
// 错误：期望对象但收到字符串
Error: Cannot read property 'name' of undefined

// 解决：添加数据验证
const data = $input.item.json;
if (typeof data === 'string') {
  data = JSON.parse(data);
}
if (!data.name) {
  throw new Error('Missing required field: name');
}
return data;
```

**错误B：表达式语法错误**
```javascript
// 错误：
"={{$json.data.user.name}}"  // 如果路径不存在会报错

// 修复：添加安全访问
"={{$json?.data?.user?.name ?? 'Default Name'}}"
```

**错误C：异步操作未等待**
```javascript
// 错误：
const result = getData();  // 异步函数但没有await
return result;

// 修复：
const result = await getData();
return result;
```

### 问题7：工作流超时

#### 症状
```
Error: Workflow execution timed out after X seconds
```

#### 解决方案

**方案A：增加超时时间**
```bash
# 在 docker-compose.yml 中设置
environment:
  - EXECUTIONS_TIMEOUT=300  # 5分钟
  - EXECUTIONS_TIMEOUT_MAX=600  # 最大10分钟
```

**方案B：优化工作流**
```javascript
// 使用批量处理代替逐个处理
// ❌ 慢：
for (const item of items) {
  await processItem(item);
}

// ✅ 快：
await Promise.all(items.map(item => processItem(item)));
```

**方案C：拆分工作流**
```
将长时间运行的工作流拆分为多个子工作流
使用Webhook在工作流间传递数据
```

### 问题8：内存不足

#### 症状
```
Error: JavaScript heap out of memory
Process killed
```

#### 解决方案

```bash
# 增加Node.js内存限制
# 在 docker-compose.yml 中
environment:
  - NODE_OPTIONS=--max-old-space-size=4096  # 4GB

# 优化数据处理
# 使用流式处理大量数据
# 分批处理而不是一次性加载所有数据
```

## 📦 集成问题

### 问题9：HTTP请求失败

#### 症状
```
Error: Request failed with status code 404/500/503
Error: getaddrinfo ENOTFOUND
Error: connect ETIMEDOUT
```

#### 诊断步骤

```bash
# 1. 在容器内测试网络
docker compose exec n8n sh
curl -v https://api.example.com/endpoint

# 2. 检查DNS解析
nslookup api.example.com

# 3. 测试代理设置
env | grep -i proxy
```

#### 解决方案

**错误类型A：DNS解析失败**
```bash
# 配置Docker DNS
# 在 docker-compose.yml 中
services:
  n8n:
    dns:
      - 8.8.8.8
      - 8.8.4.4
```

**错误类型B：SSL证书问题**
```javascript
// 在HTTP Request节点中
{
  "ignoreSSLIssues": true,  // 开发环境临时使用
  "rejectUnauthorized": false
}

// 生产环境应正确配置SSL证书
```

**错误类型C：代理配置**
```bash
# 在 docker-compose.yml 中
environment:
  - HTTP_PROXY=http://proxy.example.com:8080
  - HTTPS_PROXY=http://proxy.example.com:8080
  - NO_PROXY=localhost,127.0.0.1
```

### 问题10：Webhook不触发

#### 症状
```
创建了Webhook节点但从未触发
外部系统发送请求但工作流不执行
```

#### 诊断步骤

```bash
# 1. 获取Webhook URL
# 在n8n界面查看Webhook节点的URL

# 2. 测试Webhook
curl -X POST http://localhost:5678/webhook/your-webhook-id \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# 3. 检查工作流状态
# 确保工作流已激活（Active状态）

# 4. 查看执行历史
# n8n界面 → Executions → 查看是否有记录
```

#### 解决方案

**方案A：工作流未激活**
```
1. 打开工作流
2. 点击右上角 "Inactive" 切换为 "Active"
3. 确认Webhook节点显示绿色对勾
```

**方案B：Webhook路径配置错误**
```javascript
// 确保使用正确的Webhook URL格式
// Production Webhook: 
http://your-domain.com/webhook/unique-id

// Test Webhook:
http://your-domain.com/webhook-test/unique-id
```

**方案C：认证问题**
```json
// 检查Webhook节点认证设置
{
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "Authorization",
    "value": "Bearer your-token"
  }
}
```

### 问题11：数据库连接失败

#### 症状
```
Error: connect ECONNREFUSED 127.0.0.1:5432
Error: password authentication failed
```

#### 解决方案

**PostgreSQL连接问题**
```bash
# 1. 检查数据库服务
sudo systemctl status postgresql

# 2. 测试连接
psql -h localhost -U username -d database

# 3. 配置n8n数据库凭据
# 在 Credentials 中正确设置：
# - Host: localhost (或容器内用 host.docker.internal)
# - Port: 5432
# - Database: your_db
# - User: your_user
# - Password: your_password

# 4. 容器网络配置
# 如果数据库在容器外，使用 host.docker.internal
# 或将n8n加入同一Docker网络
```

**MySQL连接问题**
```bash
# 检查MySQL服务
sudo systemctl status mysql

# 测试连接
mysql -h localhost -u username -p database

# 配置凭据时注意端口（默认3306）
```

## 🔧 VSCode扩展问题

### 问题12：扩展命令不可用

#### 症状
```
Ctrl+Shift+P 搜索 "n8n" 但找不到命令
```

#### 解决方案

```bash
# 1. 确认扩展已安装
code --list-extensions | grep n8n

# 2. 重新安装扩展
cd n8n-vscode-connector
npm run compile
code --install-extension n8n-vscode-connector-1.0.0.vsix

# 3. 检查扩展日志
# VSCode → Help → Toggle Developer Tools → Console

# 4. 重新加载VSCode
# Ctrl+Shift+P → Developer: Reload Window
```

### 问题13：扩展崩溃或无响应

#### 症状
```
执行扩展命令时VSCode无响应
扩展突然停止工作
```

#### 解决方案

```bash
# 1. 查看VSCode日志
# Help → Toggle Developer Tools → Console
# 查找错误信息

# 2. 清理扩展缓存
rm -rf ~/.vscode/extensions/*/n8n-vscode-connector*
cd n8n-vscode-connector
npm run compile
code --install-extension n8n-vscode-connector-1.0.0.vsix

# 3. 检查Node.js版本
node --version  # 建议 v18+

# 4. 增加Node.js内存
# 在启动VSCode前设置
export NODE_OPTIONS=--max-old-space-size=4096
code
```

## 📱 Telegram Bot问题

### 问题14：Telegram Bot不响应

#### 症状
```
Bot已创建但不回复消息
Webhook设置失败
```

#### 诊断步骤

```bash
# 1. 验证Bot Token
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe

# 2. 检查Webhook状态
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo

# 3. 测试工作流
# 在n8n中手动执行Telegram工作流
```

#### 解决方案

**方案A：Webhook URL配置错误**
```bash
# Webhook URL必须是公网可访问的HTTPS地址
# 开发环境使用ngrok：
ngrok http 5678

# 设置Webhook
curl -X POST https://api.telegram.org/bot<TOKEN>/setWebhook \
  -d "url=https://your-ngrok-url.ngrok.io/webhook/telegram"
```

**方案B：Bot Token错误**
```
1. 检查Token是否正确
2. 在BotFather重新生成Token
3. 更新n8n工作流中的Token
```

**方案C：权限问题**
```
1. 确认Bot有足够权限
2. 在BotFather中设置Bot权限
3. 重新添加Bot到群组（如果在群组中使用）
```

## 🚨 性能问题

### 问题15：工作流执行缓慢

#### 诊断步骤

```javascript
// 在Function节点中添加性能监控
const startTime = Date.now();

// 您的处理逻辑
const result = await processData($input.item.json);

const endTime = Date.now();
console.log(`Processing took ${endTime - startTime}ms`);

return result;
```

#### 优化建议

1. **使用缓存**
```javascript
const cache = new Map();
const cacheKey = `user_${userId}`;

if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}

const data = await fetchData(userId);
cache.set(cacheKey, data);
return data;
```

2. **批量处理**
```javascript
// 一次处理多个项目
const items = $input.all();
const results = await bulkProcess(items);
return results;
```

3. **并行执行**
```javascript
// 并行执行多个API调用
const [users, orders, products] = await Promise.all([
  fetchUsers(),
  fetchOrders(),
  fetchProducts()
]);
```

## 🛠️ 调试技巧

### 技巧1：启用详细日志

```bash
# 在 docker-compose.yml 中
environment:
  - N8N_LOG_LEVEL=debug
  - N8N_LOG_OUTPUT=console

# 重启服务
docker compose restart n8n

# 查看详细日志
docker compose logs -f n8n
```

### 技巧2：使用Function节点调试

```javascript
// 打印所有输入数据
console.log('=== INPUT DATA ===');
console.log(JSON.stringify($input.all(), null, 2));

// 打印特定节点数据
console.log('=== NODE DATA ===');
console.log($node['Previous Node'].json);

// 打印环境变量
console.log('=== ENV ===');
console.log(process.env.API_KEY);

// 打印工作流上下文
console.log('=== WORKFLOW ===');
console.log('Workflow ID:', $workflow.id);
console.log('Execution ID:', $execution.id);

return $input.item.json;
```

### 技巧3：使用Webhook测试

```bash
# 创建测试脚本
cat > test-webhook.sh << 'EOF'
#!/bin/bash
WEBHOOK_URL="http://localhost:5678/webhook/your-id"

curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "test": "data",
    "timestamp": "'$(date -Iseconds)'"
  }' | jq .
EOF

chmod +x test-webhook.sh
./test-webhook.sh
```

### 技巧4：导出和检查工作流JSON

```bash
# 导出工作流
# n8n界面 → Workflow → Download

# 格式化JSON查看
cat workflow.json | jq .

# 查找特定节点
cat workflow.json | jq '.nodes[] | select(.name == "Your Node")'

# 检查连接
cat workflow.json | jq '.connections'
```

## 📚 获取帮助

### 信息收集清单

在寻求帮助时，请准备以下信息：

```markdown
## 环境信息
- n8n版本: `docker compose exec n8n n8n --version`
- Node.js版本: `node --version`
- 操作系统: `uname -a`
- Docker版本: `docker --version`

## 问题描述
- 具体错误信息
- 重现步骤
- 期望行为 vs 实际行为

## 日志
```bash
# n8n日志
docker compose logs n8n --tail=50

# VSCode扩展日志
# 从Developer Tools Console复制
```

## 工作流配置
- 导出的工作流JSON
- 相关节点配置
- 环境变量（隐藏敏感信息）
```

### 获取支持渠道

1. **项目文档**
   - 查看 `docs/` 目录中的文档
   - 阅读 README.md

2. **n8n官方资源**
   - 官方文档: https://docs.n8n.io/
   - 社区论坛: https://community.n8n.io/
   - GitHub Issues: https://github.com/n8n-io/n8n/issues

3. **本地测试**
   - 使用 `scripts/setup.sh` 重新设置环境
   - 导入示例工作流测试基础功能

## 🎯 预防性维护

### 定期检查清单

```bash
#!/bin/bash
# health-check.sh

echo "🏥 n8n健康检查"

# 1. 检查Docker服务
echo "📦 Docker服务状态..."
docker compose ps

# 2. 检查API可访问性
echo "🌐 API访问测试..."
curl -s http://localhost:5678/rest/workflows > /dev/null && echo "✅ API可访问" || echo "❌ API不可访问"

# 3. 检查磁盘空间
echo "💾 磁盘空间..."
df -h | grep -E '/$|n8n'

# 4. 检查日志大小
echo "📝 日志大小..."
docker compose logs n8n --tail=1 2>&1 | wc -l

# 5. 检查内存使用
echo "🧠 内存使用..."
docker stats --no-stream n8n

echo "✅ 健康检查完成"
```

### 备份策略

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# 备份工作流
cd ../n8n-workflows-backup
node backup-workflows.js
cp *.json $BACKUP_DIR/

# 备份数据目录
cp -r ../Averivendell_n8n/n8n_data $BACKUP_DIR/

# 备份配置
cp ../Averivendell_n8n/docker-compose.yml $BACKUP_DIR/
cp ../n8n-vscode-connector/.env $BACKUP_DIR/.env.connector

echo "✅ 备份完成: $BACKUP_DIR"
```

---

**记住**：大多数问题都有解决方案！系统地诊断问题，查看日志，测试每个组件，您一定能找到答案。💪

如果问题仍未解决，不要犹豫寻求社区帮助！🤝
