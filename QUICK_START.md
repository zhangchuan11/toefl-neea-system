# 🚀 5分钟快速部署指南

## 第一步：创建OSS Bucket（2分钟）

1. 访问 https://oss.console.aliyun.com/
2. 点击 **「创建Bucket」**
3. 配置：
   ```
   名称: toefl-neea-frontend (可以改成其他名称)
   地域: 华东1（杭州）
   存储类型: 标准存储
   读写权限: 公共读 ⚠️ 重要
   ```
4. 点击 **「确定」**

## 第二步：配置静态网站（30秒）

1. 进入刚创建的Bucket
2. 左侧菜单 → **「基础设置」** → **「静态页面」**
3. 点击 **「设置」**
4. 填写：
   - 默认首页: `index.html`
   - 默认404页: `index.html`
5. 保存

## 第三步：上传文件（2分钟）

### 方法A：拖拽上传（最简单）

1. 在Bucket页面，点击 **「文件管理」**
2. 点击 **「上传文件」**
3. 选择以下文件/文件夹：
   ```
   ✅ index.html
   ✅ login.html
   ✅ example.html
   ✅ topper.html
   ✅ footer.html  
   ✅ newsList.html
   ✅ queryAdminDate.html
   ✅ favicon.ico
   ✅ static 文件夹（整个）
   ✅ myHome 文件夹（整个）
   ✅ JR1bm4k4XGH4 文件夹（如果有）
   ```

4. 上传设置：
   - ✅ **读写权限**: 继承Bucket
   - ✅ 保持目录结构

5. 点击 **「开始上传」**

### 方法B：使用ossutil（适合重复上传）

如果需要多次更新，可以使用命令行工具：

1. 下载ossutil：
   - Windows: https://gosspublic.alicdn.com/ossutil/ossutil64.exe
   - 下载后放到项目目录，改名为 `ossutil.exe`

2. 配置（只需一次）：
   ```bash
   ossutil.exe config
   ```
   输入：
   - endpoint: `oss-cn-hangzhou.aliyuncs.com`
   - AccessKey ID: (你的AK)
   - AccessKey Secret: (你的SK)

3. 运行上传脚本：
   ```bash
   upload-to-oss.bat
   ```

## 第四步：配置CORS（1分钟）

⚠️ **重要**：前后端分离需要配置跨域

1. 在Bucket中，点击 **「权限管理」** → **「跨域设置」**
2. 点击 **「创建规则」**
3. 填写：
   ```
   来源: *
   允许Methods: GET, POST, PUT, DELETE, HEAD, OPTIONS
   允许Headers: *
   暴露Headers: (留空或填 *)
   缓存时间: 600
   ```
4. 点击 **「确定」**

## 第五步：测试访问 ✅

访问你的OSS域名：

```
http://你的bucket名称.oss-cn-hangzhou.aliyuncs.com/index.html
```

例如：
```
http://toefl-neea-frontend.oss-cn-hangzhou.aliyuncs.com/index.html
```

**现在HTML应该可以正常显示了！不会被下载！** 🎉

---

## 🧪 功能测试

1. ✅ **访问首页** - 应该正常显示
2. ✅ **点击验证码** - 应该能刷新（调用函数计算API）
3. ✅ **登录功能** - 输入账号密码和验证码，应该能登录
   - 测试账号: 21610904
   - 测试密码: Linda200834$

---

## 🔧 如果遇到问题

### 问题1: 页面能显示，但验证码不加载

**原因**: CORS没配置

**解决**: 
- 检查OSS的CORS设置
- 确保允许所有Methods和Headers

### 问题2: 页面访问404

**原因**: 文件没上传成功

**解决**:
- 检查OSS文件管理，确认文件已上传
- 确认路径正确（区分大小写）

### 问题3: API调用失败

**原因**: API地址配置错误

**解决**:
- 检查 `static/config.js` 文件
- 确认API地址是否正确：
  ```javascript
  const API_BASE_URL = 'https://toefl-nfunction-bybuoxiteu.cn-hangzhou.fcapp.run';
  ```

---

## 📊 部署架构

```
┌─────────────────┐
│   用户浏览器    │
└────────┬────────┘
         │
         │ 访问HTML/CSS/JS
         ↓
┌─────────────────┐
│   阿里云 OSS    │  ← 静态文件（前端）
│  静态网站托管   │
└────────┬────────┘
         │
         │ AJAX调用API
         ↓
┌─────────────────┐
│   函数计算 FC   │  ← 动态API（后端）
│   Express应用   │
└─────────────────┘
```

---

## 💰 费用

- **OSS**: 约¥0.01-0.1/月（几乎免费）
- **函数计算**: 免费额度内（前100万次调用免费）
- **总计**: 基本免费 💚

---

## 🎯 完成！

现在你的托福报名系统已经成功部署：
- ✅ 前端在OSS上，HTML正常显示
- ✅ 后端在函数计算，API正常工作
- ✅ 跨域配置完成，前后端通信正常

祝你使用愉快！🎉


