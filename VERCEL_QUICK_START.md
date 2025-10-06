# ⚡ Vercel 3分钟快速部署

最简单的部署方式，跟着做就行！

## 🎯 方式一：使用Vercel CLI（最快）

### 1. 安装Vercel

打开命令行，运行：

```bash
npm install -g vercel
```

### 2. 登录

```bash
vercel login
```

会打开浏览器，用GitHub或邮箱登录。

### 3. 部署

在项目目录执行：

```bash
vercel
```

按提示回答问题：
- Set up and deploy? → **回车（Y）**
- Which scope? → **选择你的账号**
- Link to existing project? → **N**
- What's your project's name? → **回车（默认）**
- In which directory is your code located? → **回车（默认 .）**
- Want to override the settings? → **N**

等待1-2分钟，完成！

### 4. 部署到生产环境

```bash
vercel --prod
```

搞定！你会得到一个网址，类似：
```
https://toefl-neea-cn.vercel.app
```

---

## 🎯 方式二：使用GitHub（推荐长期使用）

### 1. 上传代码到GitHub

```bash
# 初始化（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 创建GitHub仓库后，添加远程地址
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送
git branch -M main
git push -u origin main
```

### 2. 导入到Vercel

1. 访问 https://vercel.com
2. 用GitHub登录
3. 点击 **「New Project」**
4. 选择你的仓库 → **「Import」**
5. 直接点击 **「Deploy」**

等待部署完成！

### 3. 自动部署

以后每次推送代码，Vercel会自动部署：

```bash
git add .
git commit -m "更新"
git push
```

---

## ✅ 测试

访问你的网址：
```
https://你的项目.vercel.app/index.html
```

- ✅ 页面正常显示（不会下载）
- ✅ 验证码可以加载
- ✅ 登录功能正常

---

## 🔧 如果有问题

### 问题1: vercel命令找不到

**解决**: 
```bash
npm install -g vercel
```

### 问题2: 部署失败

**解决**: 查看错误信息，通常是依赖问题
```bash
npm install
vercel --prod
```

### 问题3: 页面404

**解决**: 检查 `vercel.json` 文件是否存在

---

## 🎉 完成！

现在你的托福报名系统已经部署到Vercel：
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ HTML正常显示（不下载）
- ✅ 所有功能正常

享受Serverless的便利吧！🚀

