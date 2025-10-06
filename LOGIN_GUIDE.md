# 登录功能使用指南

## 快速开始

### 1. 启动服务器

```bash
# 安装依赖（首次运行）
npm install

# 启动服务器
npm start
```

服务器将在 `http://localhost:3000` 上运行

### 2. 访问登录页面

在浏览器中打开：`http://localhost:3000/login.html`

### 3. 登录凭证

使用以下账号登录：

- **用户名**: `21610904`
- **密码**: `Linda200834$`
- **验证码**: 输入页面显示的4位验证码（不区分大小写）

### 4. 登录成功

登录成功后会自动跳转到：`http://localhost:3000/myHome/postTest.html`

## 功能说明

### 验证码功能

- ✅ 页面加载时自动生成验证码
- ✅ 点击验证码图片可刷新
- ✅ 验证码有效期：5分钟
- ✅ 验证码不区分大小写
- ✅ 验证失败后自动刷新验证码

### 登录验证

- ✅ 验证码验证（必须正确）
- ✅ 用户名验证（必须为 21610904）
- ✅ 密码验证（必须为 Linda200834$）
- ✅ Session 管理（登录状态保持30分钟）

### 错误处理

登录失败时会显示相应的错误信息：

- ❌ "请输入用户名" - 用户名为空
- ❌ "请输入密码" - 密码为空
- ❌ "请输入验证码" - 验证码为空
- ❌ "验证码格式错误" - 验证码不是4位
- ❌ "验证码已过期，请重新获取" - 验证码超时
- ❌ "验证码错误，请重新输入" - 验证码不正确
- ❌ "用户名或密码错误" - 账号密码不匹配

## API 接口说明

### 登录接口

**请求**:
```bash
POST /api/login
Content-Type: application/json

{
  "userName": "21610904",
  "password": "Linda200834$",
  "verifyCode": "ABCD"
}
```

**成功响应**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "userName": "21610904",
    "redirectUrl": "/myHome/postTest.html"
  }
}
```

**失败响应**:
```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

### 验证码接口

**获取验证码**:
```bash
GET /api/captcha/image
```

**验证验证码**:
```bash
POST /api/captcha/verify
Content-Type: application/json

{
  "code": "ABCD"
}
```

### 退出登录

**请求**:
```bash
GET /api/logout
```

**响应**:
```json
{
  "success": true,
  "message": "已退出登录"
}
```

### 检查登录状态

**请求**:
```bash
GET /api/check-login
```

**响应（已登录）**:
```json
{
  "success": true,
  "loggedIn": true,
  "user": {
    "userName": "21610904",
    "neeaId": "21610904",
    "loginTime": "2025-01-01T00:00:00.000Z"
  }
}
```

**响应（未登录）**:
```json
{
  "success": true,
  "loggedIn": false
}
```

## 测试步骤

### 正常登录流程

1. 打开登录页面
2. 输入用户名：`21610904`
3. 输入密码：`Linda200834$`
4. 查看并输入验证码
5. 点击"登录"按钮
6. 验证是否跳转到成绩查看页面

### 验证码错误测试

1. 打开登录页面
2. 输入正确的用户名和密码
3. 输入错误的验证码
4. 点击"登录"按钮
5. 验证是否显示"验证码错误"
6. 验证验证码是否自动刷新

### 账号密码错误测试

1. 打开登录页面
2. 输入错误的用户名或密码
3. 输入正确的验证码
4. 点击"登录"按钮
5. 验证是否显示"用户名或密码错误"

### 验证码刷新测试

1. 打开登录页面
2. 点击验证码图片
3. 验证验证码是否更新

## 故障排除

### 问题：验证码不显示

**解决方案**:
- 检查服务器是否正常运行
- 检查浏览器控制台是否有错误
- 刷新页面重试

### 问题：登录后没有跳转

**解决方案**:
- 检查浏览器控制台的网络请求
- 确认 `/myHome/postTest.html` 文件存在
- 检查服务器日志

### 问题：验证码总是提示错误

**解决方案**:
- 确保浏览器启用了 Cookie
- 检查是否输入了4位验证码
- 验证码不区分大小写
- 尝试刷新验证码重试

### 问题：Session 过期

**解决方案**:
- Session 有效期为30分钟
- 超时后需要重新登录
- 可在 `server.js` 中修改 `maxAge` 配置

## 注意事项

⚠️ **重要提示**:

1. **验证码有效期**: 验证码生成后5分钟内有效
2. **Session 管理**: 登录状态保持30分钟
3. **Cookie 设置**: 必须启用浏览器 Cookie 功能
4. **唯一账号**: 只有 `21610904` / `Linda200834$` 可以登录
5. **跳转地址**: 登录成功后跳转到 `/myHome/postTest.html`

## 开发说明

### 修改登录账号

编辑 `routes/login.js` 文件：

```javascript
// 修改这里的用户凭证
const VALID_USER = {
  username: '你的用户名',
  password: '你的密码'
};
```

### 修改跳转地址

编辑 `routes/login.js` 文件：

```javascript
return res.json({
  success: true,
  message: '登录成功',
  data: {
    userName: userName,
    redirectUrl: '/your/target/page.html'  // 修改这里
  }
});
```

### 修改 Session 配置

编辑 `server.js` 文件：

```javascript
app.use(session({
  secret: 'toefl-neea-secret-key-2024',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000, // 修改这里的时间（毫秒）
    httpOnly: true
  }
}));
```

