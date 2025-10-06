# 📋 接下来的部署步骤

你的代码已经准备好了！现在需要上传到GitHub，然后用Vercel部署。

## 🎯 步骤1：创建GitHub仓库

### 1. 登录GitHub

访问：https://github.com

如果没有账号，先注册一个（免费）。

### 2. 创建新仓库

1. 点击右上角 **「+」** → **「New repository」**
2. 填写：
   ```
   Repository name: toefl-neea-system
   Description: 托福考试报名系统
   Public（公开）或 Private（私有）都可以
   
   ⚠️ 不要勾选 "Initialize this repository with:"
   ```
3. 点击 **「Create repository」**

### 3. 复制仓库地址

创建成功后，GitHub会显示一个地址，类似：
```
https://github.com/你的用户名/toefl-neea-system.git
```

**复制这个地址！**

---

## 🎯 步骤2：推送代码到GitHub

在你的项目目录（当前目录）执行以下命令：

### 1. 添加远程仓库

```bash
git remote add origin https://github.com/你的用户名/toefl-neea-system.git
```

⚠️ 把上面的地址替换成你刚才复制的地址！

### 2. 设置分支名

```bash
git branch -M main
```

### 3. 推送代码

```bash
git push -u origin main
```

如果要求输入GitHub用户名和密码：
- **用户名**: 你的GitHub用户名
- **密码**: 
  - 不能用账号密码了，要用 **Personal Access Token**
  - 生成方法：GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  - 权限选择：`repo` (全选)
  - 复制生成的token，粘贴作为密码

---

## 🎯 步骤3：在Vercel部署

### 1. 访问Vercel

https://vercel.com

用GitHub账号登录（点击 "Continue with GitHub"）

### 2. 导入项目

1. 点击 **「Add New...」** → **「Project」**
2. 在列表中找到 `toefl-neea-system` 仓库
3. 点击 **「Import」**

### 3. 配置项目（保持默认）

```
Framework Preset: Other
Build Command: (留空)
Output Directory: (留空)
Install Command: npm install
```

### 4. 部署

点击 **「Deploy」**

等待1-2分钟，部署完成！

---

## ✅ 完成！

部署成功后，Vercel会给你一个域名：

```
https://toefl-neea-system.vercel.app
```

访问：
```
https://你的项目名.vercel.app/index.html
```

- ✅ HTML正常显示（不会下载）
- ✅ 验证码功能正常
- ✅ 登录功能正常
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN

---

## 🔄 以后更新

修改代码后，只需要：

```bash
git add .
git commit -m "更新描述"
git push
```

Vercel会自动检测并重新部署！

---

## 🆘 如果遇到问题

### GitHub推送失败

可能是网络问题或认证问题。可以尝试：
1. 使用GitHub Desktop（图形界面工具）
2. 或手动在GitHub网页上传文件

### Vercel部署失败

查看错误日志，通常是依赖问题：
```bash
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

---

## 📞 需要帮助？

查看详细文档：
- `VERCEL_DEPLOYMENT.md` - 完整部署文档
- `VERCEL_QUICK_START.md` - 快速开始

祝你部署顺利！🚀

