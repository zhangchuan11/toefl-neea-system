# 🚀 Vercel 一键部署指南（3分钟搞定）

使用Vercel部署，完全免费，自动HTTPS，全球CDN加速！

## ✨ 为什么选择Vercel？

- ✅ **完全免费**（个人项目）
- ✅ **自动HTTPS**（免费SSL证书）
- ✅ **全球CDN**（访问速度超快）
- ✅ **一键部署**（连接GitHub自动部署）
- ✅ **自定义域名**（支持绑定自己的域名）
- ✅ **无需服务器**（Serverless架构）

## 📋 前置准备

1. ✅ **GitHub账号**（免费注册：https://github.com）
2. ✅ **Vercel账号**（免费注册：https://vercel.com，可用GitHub登录）

---

## 🎯 部署步骤

### 方法一：使用GitHub（推荐）⭐⭐⭐⭐⭐

#### 1. 创建GitHub仓库

1. 登录 https://github.com
2. 点击右上角 **「+」** → **「New repository」**
3. 填写：
   ```
   Repository name: toefl-neea-system
   Description: 托福考试报名系统
   Public (公开) 或 Private (私有) 都可以
   ```
4. 点击 **「Create repository」**

#### 2. 上传代码到GitHub

在你的项目目录中执行：

```bash
# 初始化Git（如果还没有）
git init

# 添加远程仓库（替换成你的GitHub仓库地址）
git remote add origin https://github.com/你的用户名/toefl-neea-system.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 推送到GitHub
git push -u origin main
```

如果遇到 `main` 分支问题，可以用：
```bash
git branch -M main
git push -u origin main
```

#### 3. 在Vercel中导入项目

1. 访问 https://vercel.com
2. 点击 **「Log in」** → 使用GitHub登录
3. 点击 **「Add New...」** → **「Project」**
4. 在列表中找到 `toefl-neea-system` 仓库
5. 点击 **「Import」**

#### 4. 配置项目

Vercel会自动检测到这是Node.js项目，配置如下：

```
Framework Preset: Other
Build Command: (留空)
Output Directory: (留空)
Install Command: npm install
```

**环境变量**（可选）：
- 点击 **「Environment Variables」**
- 添加：
  ```
  Name: SESSION_SECRET
  Value: your-secret-key-here
  ```

#### 5. 部署

1. 点击 **「Deploy」**
2. 等待1-2分钟，部署完成！

你会得到一个域名，类似：
```
https://toefl-neea-system.vercel.app
```

---

### 方法二：使用Vercel CLI（适合快速测试）

#### 1. 安装Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录Vercel

```bash
vercel login
```

按提示登录（会打开浏览器）

#### 3. 部署

在项目目录执行：

```bash
vercel
```

按提示操作：
- Set up and deploy? **Y**
- Which scope? 选择你的账号
- Link to existing project? **N**
- What's your project's name? **toefl-neea-system**
- In which directory is your code located? **.**
- Want to override the settings? **N**

等待部署完成！

#### 4. 生产环境部署

```bash
vercel --prod
```

---

## 🌐 访问测试

部署成功后，访问你的域名：

```
https://你的项目名.vercel.app/index.html
```

功能测试：
- ✅ **首页显示**：正常显示，不会下载
- ✅ **验证码加载**：可以刷新
- ✅ **登录功能**：可以正常登录
  - 账号：21610904
  - 密码：Linda200834$

---

## 🎨 自定义域名（可选）

### 1. 在Vercel中绑定域名

1. 进入项目 Dashboard
2. 点击 **「Settings」** → **「Domains」**
3. 输入你的域名：`www.yourdomain.com`
4. 点击 **「Add」**

### 2. 配置DNS

在你的域名服务商处，添加记录：

```
类型: CNAME
主机记录: www
记录值: cname.vercel-dns.com
```

或者：

```
类型: A
主机记录: @
记录值: 76.76.21.21
```

等待DNS生效（5-30分钟），然后访问你的自定义域名！

---

## 🔄 自动部署（GitHub集成）

连接GitHub后，每次推送代码都会自动部署：

```bash
# 修改代码后
git add .
git commit -m "更新功能"
git push

# Vercel会自动检测并部署！
```

你可以在Vercel Dashboard看到部署状态。

---

## 🔧 常见问题

### 问题1: 部署失败，提示找不到模块

**原因**: 缺少依赖

**解决**: 
```bash
# 确保package.json中有所有依赖
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### 问题2: Session不工作

**原因**: Vercel是Serverless，每次请求可能在不同实例

**解决**: 
- 使用Redis存储session（推荐）
- 或使用JWT token（无状态）

### 问题3: 静态文件404

**原因**: 路由配置问题

**解决**: 检查 `vercel.json` 配置是否正确

---

## 🆚 Vercel vs 阿里云对比

| 特性 | Vercel | 阿里云FC+OSS |
|------|--------|--------------|
| 部署难度 | ⭐⭐⭐⭐⭐ 超简单 | ⭐⭐⭐ 中等 |
| 费用 | 免费 | 几乎免费 |
| HTTPS | 自动配置 | 需要配置 |
| 全球CDN | 包含 | 需要单独配置 |
| 自动部署 | 支持 | 需要脚本 |
| 国内访问速度 | 较慢（在海外） | 快 |
| 稳定性 | 很高 | 很高 |

**建议**：
- 🌍 **面向国际用户** → 选Vercel
- 🇨🇳 **主要国内用户** → 选阿里云

---

## 💰 费用

**Vercel Free Plan（免费版）**：
- ✅ 100GB 带宽/月
- ✅ 无限网站
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 自定义域名

对于个人项目完全够用！

---

## 📚 相关文档

- [Vercel官方文档](https://vercel.com/docs)
- [Vercel Node.js部署](https://vercel.com/docs/runtimes#official-runtimes/node-js)
- [自定义域名](https://vercel.com/docs/custom-domains)

---

## ✅ 部署清单

- [ ] 创建GitHub账号
- [ ] 创建Vercel账号
- [ ] 上传代码到GitHub
- [ ] 在Vercel中导入项目
- [ ] 配置环境变量
- [ ] 部署并测试
- [ ] （可选）绑定自定义域名

完成后，你的网站就上线了！🎉

---

## 🎯 快速命令

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署到开发环境
vercel

# 部署到生产环境
vercel --prod

# 查看部署列表
vercel ls

# 查看日志
vercel logs
```

祝你部署顺利！🚀

