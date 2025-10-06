# 阿里云函数计算部署指南

本文档详细说明如何将托福考试报名系统部署到阿里云函数计算（Function Compute）。

## 📋 前置准备

### 1. 阿里云账号准备

- ✅ 已有阿里云账号
- ✅ 已开通函数计算服务
- 📝 获取 AccessKey ID 和 AccessKey Secret
  - 登录阿里云控制台
  - 点击右上角头像 -> AccessKey 管理
  - 创建或查看 AccessKey（建议使用 RAM 用户的 AccessKey，权限更安全）

### 2. 安装 Serverless Devs 工具

Serverless Devs 是阿里云官方提供的 Serverless 应用管理工具。

```bash
# 使用 npm 全局安装（推荐）
npm install -g @serverless-devs/s

# 验证安装
s --version
```

如果安装速度慢，可以使用国内镜像：

```bash
npm install -g @serverless-devs/s --registry=https://registry.npmmirror.com
```

### 3. 配置阿里云账号密钥

运行以下命令配置密钥：

```bash
s config add
```

按提示输入：
- **Alibaba Cloud Account ID**: 你的阿里云账号 ID
- **Alibaba Cloud AccessKey ID**: 你的 AccessKey ID
- **Alibaba Cloud AccessKey Secret**: 你的 AccessKey Secret
- **别名（Alias）**: 输入 `default`（或其他你喜欢的名称）

配置完成后，可以使用以下命令查看：

```bash
s config get -a default
```

## 🚀 部署步骤

### 1. 安装项目依赖

在项目根目录下运行：

```bash
npm install
```

### 2. 部署到函数计算

#### 方式一：一键部署（推荐）

```bash
npm run deploy
```

或直接使用 s 命令：

```bash
s deploy
```

#### 方式二：跳过构建直接部署（快速）

如果你已经部署过一次，再次部署时可以跳过构建步骤：

```bash
npm run deploy:skip-build
```

### 3. 查看部署信息

部署成功后，会显示函数的访问地址（HTTP 触发器 URL），类似：

```
✔ 部署成功
  functionName: toefl-neea-function
  url: https://toefl-neea-function-xxx.cn-hangzhou.fcapp.run
```

记录下这个 URL，这就是你的应用访问地址。

### 4. 测试部署

访问以下地址测试：

```bash
# 健康检查
curl https://your-function-url.fcapp.run/api/health

# 获取验证码
curl https://your-function-url.fcapp.run/api/captcha/image

# 访问首页
在浏览器中打开: https://your-function-url.fcapp.run/index.html
```

## 📊 查看和管理函数

### 查看函数信息

```bash
npm run info
```

或：

```bash
s info
```

### 查看函数日志

```bash
s logs
```

### 删除函数

如果需要删除部署的函数：

```bash
npm run remove
```

或：

```bash
s remove
```

## ⚙️ 配置说明

### s.yaml 配置文件

主要配置项说明：

```yaml
vars:
  region: cn-hangzhou        # 地域，可选: cn-hangzhou, cn-shanghai, cn-beijing 等
  serviceName: toefl-neea-service  # 服务名称

resources:
  toefl_neea_function:
    props:
      functionName: toefl-neea-function  # 函数名称
      runtime: nodejs18                   # Node.js 版本
      memorySize: 512                     # 内存（MB）
      timeout: 60                         # 超时时间（秒）
      instanceConcurrency: 10             # 单实例并发数
      cpu: 0.35                          # CPU 核数
      diskSize: 512                       # 磁盘大小（MB）
      
      # 环境变量
      environmentVariables:
        NODE_ENV: production
        SESSION_SECRET: toefl-neea-secret-key-2024-fc
        TZ: Asia/Shanghai
```

### 修改地域

如果需要部署到其他地域，修改 `s.yaml` 中的 `region` 字段：

```yaml
vars:
  region: cn-shanghai  # 或 cn-beijing, cn-shenzhen 等
```

### 修改资源配置

根据实际需求调整：

```yaml
memorySize: 1024    # 增加内存到 1GB
timeout: 120        # 增加超时到 2 分钟
```

## 🔧 自定义域名（可选）

### 1. 在阿里云控制台绑定自定义域名

1. 登录阿里云函数计算控制台
2. 进入你的函数
3. 点击「触发器」->「自定义域名」
4. 添加你的域名（需要先在阿里云备案）

### 2. 配置 DNS 解析

在你的域名 DNS 服务商处，添加 CNAME 记录：

```
类型: CNAME
主机记录: api (或其他子域名)
记录值: your-function-url.fcapp.run
```

### 3. 更新 s.yaml

在 `s.yaml` 中添加自定义域名配置：

```yaml
customDomains:
  - domainName: api.yourdomain.com
    protocol: HTTP,HTTPS
    routeConfigs:
      - path: /*
        serviceName: ${vars.serviceName}
        functionName: toefl-neea-function
```

## 🛠️ 常见问题

### 1. 部署失败：权限不足

**问题**: `AccessDenied: You are not authorized to do this action`

**解决方案**:
- 确认 AccessKey 是否正确
- 检查 RAM 用户是否有函数计算的操作权限
- 在 RAM 控制台为用户添加 `AliyunFCFullAccess` 权限

### 2. 函数超时

**问题**: 请求响应时间过长，返回 504 错误

**解决方案**:
在 `s.yaml` 中增加 `timeout` 值：

```yaml
timeout: 120  # 改为 120 秒
```

### 3. Session 不工作

**问题**: 验证码验证失败，登录状态丢失

**原因**: 函数计算是无状态的，每次冷启动会重置内存 session

**解决方案**（生产环境推荐）:
使用 Redis 存储 session：

1. 在阿里云购买 Redis 实例（云数据库 Redis 版）
2. 安装 connect-redis：
   ```bash
   npm install connect-redis redis
   ```
3. 修改 `index.js` 中的 session 配置：
   ```javascript
   const RedisStore = require('connect-redis').default;
   const { createClient } = require('redis');
   
   const redisClient = createClient({
     url: process.env.REDIS_URL  // redis://xxx:6379
   });
   redisClient.connect();
   
   app.use(session({
     store: new RedisStore({ client: redisClient }),
     secret: process.env.SESSION_SECRET,
     // ... 其他配置
   }));
   ```
4. 在 `s.yaml` 中添加环境变量：
   ```yaml
   environmentVariables:
     REDIS_URL: redis://your-redis-host:6379
   ```

### 4. 静态文件访问 404

**问题**: 图片、CSS、JS 等静态文件无法访问

**解决方案**:
- 确保 `static` 目录在项目中
- 检查 `.fcignore` 文件，确保没有排除 `static` 目录
- 访问路径使用完整 URL：`https://your-url/static/...`

### 5. 本地开发和测试

在部署前，可以在本地测试：

```bash
# 使用原来的 server.js
npm run dev

# 或使用新的 index.js（函数计算入口）
node index.js
```

访问 `http://localhost:3000` 进行测试。

### 6. 查看函数日志

如果出现问题，查看函数日志：

```bash
# 查看最近的日志
s logs

# 实时查看日志
s logs -t

# 查看指定时间范围的日志
s logs --start-time "2025-10-06 10:00:00" --end-time "2025-10-06 11:00:00"
```

或在阿里云控制台：
1. 进入函数计算控制台
2. 选择你的函数
3. 点击「日志查询」

## 📈 性能优化建议

### 1. 预留实例（避免冷启动）

对于高访问量的应用，可以配置预留实例：

在 `s.yaml` 中添加：

```yaml
asyncConfiguration:
  destination: {}
provisionedConcurrencyConfig:
  count: 1  # 预留 1 个实例
```

### 2. 层（Layer）优化依赖加载

将 node_modules 打包为层，加快部署速度：

```bash
s layer publish
```

### 3. 配置 VPC（如果需要访问内网资源）

如果需要访问 RDS、Redis 等内网资源：

```yaml
vpcConfig:
  vpcId: vpc-xxx
  securityGroupId: sg-xxx
  vswitchIds:
    - vsw-xxx
```

## 🔐 安全建议

1. **使用环境变量存储敏感信息**
   - 不要在代码中硬编码密码、密钥等
   - 在 `s.yaml` 的 `environmentVariables` 中配置

2. **限制 HTTP 触发器访问**
   - 如果不需要公网访问，设置 `disableURLInternet: true`
   - 配置 API 网关进行鉴权

3. **定期更新依赖**
   ```bash
   npm audit
   npm update
   ```

4. **使用 HTTPS**
   - 函数计算默认提供 HTTPS
   - 自定义域名时配置 SSL 证书

## 📚 相关文档

- [阿里云函数计算文档](https://help.aliyun.com/product/50980.html)
- [Serverless Devs 文档](https://www.serverless-devs.com/)
- [Node.js Runtime 文档](https://help.aliyun.com/document_detail/58011.html)

## 💡 成本说明

阿里云函数计算按量计费：

- **请求次数**: 前 100 万次/月 免费，之后 ¥0.0000002/次
- **执行时间**: 前 400,000 GB·秒/月 免费
- **流量**: 按实际使用计费

对于低访问量的应用，每月费用可能只有几元甚至免费。

## 🆘 获取帮助

如有问题，可以：

1. 查看[阿里云函数计算官方文档](https://help.aliyun.com/product/50980.html)
2. 在阿里云社区提问
3. 查看函数日志排查问题
4. 联系阿里云技术支持

---

**部署完成后，享受 Serverless 架构带来的便利：**
- ✅ 无需管理服务器
- ✅ 自动弹性伸缩
- ✅ 按量付费，成本优化
- ✅ 高可用性和容错性

