# 阿里云OSS静态网站部署指南

将前端HTML文件部署到OSS，API使用函数计算。

## 📋 前置条件

- ✅ 已有阿里云账号
- ✅ API已部署到函数计算

## 🎯 部署步骤

### 一、创建OSS Bucket

#### 1. 登录OSS控制台

访问：https://oss.console.aliyun.com/

#### 2. 创建Bucket

1. 点击 **「创建Bucket」**
2. 填写配置：

```
Bucket名称: toefl-neea-frontend (全局唯一，如果被占用请换一个)
地域: 华东1（杭州）(与函数计算保持一致)
存储类型: 标准存储
读写权限: 公共读
```

3. **访问控制** → 取消勾选 "阻止公共访问"
4. 点击 **「确定」** 创建

#### 3. 配置静态网站托管

1. 进入刚创建的Bucket
2. 点击左侧菜单 **「基础设置」** → **「静态页面」**
3. 点击 **「设置」**
4. 填写：
   - **默认首页**: `index.html`
   - **默认404页**: `index.html`（可选）
5. 点击 **「保存」**

配置成功后，你会得到一个**Bucket域名**：
```
http://toefl-neea-frontend.oss-cn-hangzhou.aliyuncs.com
```

---

### 二、修改前端配置（指向API）

前端需要调用函数计算的API，需要在代码中配置API地址。

我已经为你创建了配置文件：`static/config.js`

你需要：
1. 在HTML文件中引入这个配置
2. 使用配置中的API地址

---

### 三、上传文件到OSS

#### 方式A：使用OSS控制台（简单）

1. 在OSS Bucket页面，点击 **「文件管理」**
2. 点击 **「上传文件」**
3. 上传以下文件和目录：
   ```
   index.html
   login.html
   example.html
   topper.html
   footer.html
   newsList.html
   queryAdminDate.html
   static/          (整个目录)
   myHome/          (整个目录)
   favicon.ico
   ```

4. 上传时设置：
   - **读写权限**: 继承Bucket（公共读）
   - 保持目录结构

#### 方式B：使用ossutil命令行工具（快速）

1. 下载ossutil：
   - Windows: https://gosspublic.alicdn.com/ossutil/ossutil64.exe
   - 下载后重命名为 `ossutil.exe`

2. 配置ossutil：
   ```bash
   ossutil.exe config
   ```
   输入：
   - endpoint: `oss-cn-hangzhou.aliyuncs.com`
   - AccessKey ID: 你的AK
   - AccessKey Secret: 你的SK

3. 批量上传：
   ```bash
   # 在项目目录执行
   ossutil.exe cp -r index.html oss://toefl-neea-frontend/
   ossutil.exe cp -r login.html oss://toefl-neea-frontend/
   ossutil.exe cp -r static/ oss://toefl-neea-frontend/static/ -r
   ossutil.exe cp -r myHome/ oss://toefl-neea-frontend/myHome/ -r
   ossutil.exe cp -r *.html oss://toefl-neea-frontend/
   ```

#### 方式C：使用脚本（推荐，最快）

我已经创建了上传脚本：`upload-to-oss.bat`

运行：
```bash
upload-to-oss.bat
```

---

### 四、设置CORS（允许跨域调用API）

**重要**：前端在OSS，API在函数计算，需要配置CORS。

#### 1. 配置OSS的CORS

1. 在OSS Bucket中，点击 **「权限管理」** → **「跨域设置」**
2. 点击 **「创建规则」**
3. 填写：
   ```
   来源: * (或指定 https://toefl-nfunction-bybuoxiteu.cn-hangzhou.fcapp.run)
   允许Methods: GET, POST, PUT, DELETE, HEAD, OPTIONS
   允许Headers: *
   暴露Headers: ETag, x-oss-request-id
   缓存时间: 600
   ```

#### 2. 函数计算的CORS

函数计算代码中已经配置了CORS（index.js中的cors配置），无需额外设置。

---

### 五、测试访问

#### 1. 访问OSS静态网站

```
http://toefl-neea-frontend.oss-cn-hangzhou.aliyuncs.com/index.html
```

**现在HTML应该可以正常显示了！** ✅

#### 2. 测试功能

- 访问首页 → 应该正常显示
- 点击验证码 → 应该正常加载（调用API）
- 登录功能 → 应该正常工作

---

### 六、（可选）绑定自定义域名

如果你有备案的域名，可以绑定：

#### 1. 在OSS中绑定域名

1. 在Bucket中，点击 **「传输管理」** → **「域名管理」**
2. 点击 **「绑定域名」**
3. 输入域名：`www.yourdomain.com`
4. 开启 **「自动添加CNAME记录」**（如果域名在阿里云）

#### 2. 配置DNS解析

在域名DNS管理中，添加CNAME记录：
```
类型: CNAME
主机记录: www
记录值: toefl-neea-frontend.oss-cn-hangzhou.aliyuncs.com
```

#### 3. 配置HTTPS（推荐）

1. 在OSS域名管理中，上传SSL证书
2. 或使用阿里云免费SSL证书

---

## 📁 文件结构

上传到OSS的文件结构：

```
oss://toefl-neea-frontend/
├── index.html
├── login.html
├── example.html
├── topper.html
├── footer.html
├── newsList.html
├── queryAdminDate.html
├── favicon.ico
├── static/
│   ├── config.js          (API配置文件)
│   ├── bootstrap/
│   ├── jquery/
│   ├── toefl/
│   └── ...
└── myHome/
    ├── postTest.html
    ├── profileInfo.html
    └── ...
```

---

## 💰 费用说明

**OSS标准存储**：
- 存储费用: ¥0.12/GB/月
- 流量费用: ¥0.50/GB（前5GB免费）
- 请求费用: ¥0.01/万次

**估算**：
- 如果你的项目约100MB，每月1000次访问
- 存储: ¥0.012/月
- 流量: 基本免费（5GB以内）
- **总计: 约 ¥0.01-0.1/月** （几乎免费）

---

## 🔧 故障排查

### 问题1：访问OSS显示403

**原因**: Bucket权限设置为私有

**解决**: 
1. 进入Bucket → 权限管理 → 读写权限
2. 设置为 **「公共读」**

### 问题2：API调用失败（CORS错误）

**原因**: 跨域配置不正确

**解决**:
1. 检查OSS的CORS设置
2. 检查浏览器控制台的具体错误
3. 确保API地址正确

### 问题3：验证码不显示

**原因**: API路径配置错误

**解决**:
1. 检查 `static/config.js` 中的API_BASE_URL
2. 确保是完整的URL（包含https://）
3. 在浏览器F12查看Network请求

---

## 📚 参考文档

- [OSS静态网站托管](https://help.aliyun.com/document_detail/31872.html)
- [OSS CORS配置](https://help.aliyun.com/document_detail/31870.html)
- [ossutil工具](https://help.aliyun.com/document_detail/120075.html)

---

## ✅ 部署清单

- [ ] 创建OSS Bucket
- [ ] 配置静态网站托管
- [ ] 修改前端API配置
- [ ] 上传文件到OSS
- [ ] 配置CORS
- [ ] 测试访问和功能
- [ ] （可选）绑定自定义域名

完成以上步骤后，你的托福报名系统就完美运行了！🎉


