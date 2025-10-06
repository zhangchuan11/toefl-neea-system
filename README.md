# 托福考试报名系统 - 后端服务

这是托福考试报名系统的 Node.js 后端服务，提供验证码生成和验证功能。

## 功能特性

- ✅ 验证码生成（SVG 格式）
- ✅ 验证码验证
- ✅ 用户登录系统
- ✅ Session 管理
- ✅ 验证码过期机制（5分钟）
- ✅ CORS 跨域支持

## 技术栈

- **Node.js** - JavaScript 运行环境
- **Express** - Web 框架
- **svg-captcha** - SVG 验证码生成
- **express-session** - Session 管理

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务器默认运行在 `http://localhost:3000`

## API 接口

### 1. 用户登录

**接口**: `POST /api/login`

**描述**: 用户登录接口，验证用户名、密码和验证码

**请求参数**:
```json
{
  "userName": "21610904",
  "password": "Linda200834$",
  "verifyCode": "ABCD"
}
```

**返回格式**:
```json
// 成功
{
  "success": true,
  "message": "登录成功",
  "data": {
    "userName": "21610904",
    "redirectUrl": "/myHome/postTest.html"
  }
}

// 失败
{
  "success": false,
  "message": "用户名或密码错误" // 或 "验证码错误"
}
```

**测试账号**:
- 用户名: `21610904`
- 密码: `Linda200834$`

### 2. 退出登录

**接口**: `GET /api/logout`

**描述**: 退出当前登录状态

**返回格式**:
```json
{
  "success": true,
  "message": "已退出登录"
}
```

### 3. 检查登录状态

**接口**: `GET /api/check-login`

**描述**: 检查用户是否已登录

**返回格式**:
```json
// 已登录
{
  "success": true,
  "loggedIn": true,
  "user": {
    "userName": "21610904",
    "neeaId": "21610904",
    "loginTime": "2025-01-01T00:00:00.000Z"
  }
}

// 未登录
{
  "success": true,
  "loggedIn": false
}
```

### 4. 获取验证码图片

**接口**: `GET /api/captcha/image`

**描述**: 生成一个新的验证码图片（返回 JSON 格式，包含 base64 编码的 SVG 图片）

**返回格式**:
```json
{
  "url": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0..."
}
```

**使用示例**:
```javascript
// 使用 jQuery（兼容原有的 getCaptcha 函数）
$.getJSON('/api/captcha/image', function(data) {
    $('#captchaImg').attr('src', data.url);
});

// 使用 Fetch API
fetch('/api/captcha/image', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        document.getElementById('captchaImg').src = data.url;
    });
```

### 5. 验证验证码

**接口**: `POST /api/captcha/verify`

**描述**: 验证用户输入的验证码是否正确

**请求体**:
```json
{
  "code": "AB12"
}
```

**响应**:
```json
{
  "success": true,
  "message": "验证码验证成功"
}
```

或

```json
{
  "success": false,
  "message": "验证码错误"
}
```

### 6. 获取新的验证码ID

**接口**: `GET /api/captcha/new-id`

**描述**: 获取一个新的验证码 ID（用于刷新验证码）

**响应**:
```json
{
  "success": true,
  "captchaId": "A1B2C3D4E5F6...",
  "captchaUrl": "/api/captcha/image?t=1234567890"
}
```

### 4. 健康检查

**接口**: `GET /api/health`

**描述**: 检查服务器是否正常运行

**响应**:
```json
{
  "status": "ok",
  "timestamp": "2025-10-06T12:00:00.000Z"
}
```

## 前端集成示例

### 方式一：兼容原有 base.min.js 的 getCaptcha 函数

原有的 `getCaptcha()` 函数会自动调用 `/api/captcha/image` 并处理返回的 JSON 数据：

```javascript
// static/toefl/js/base.min.js 中已有的函数
function getCaptcha() {
    $("#chkImg").attr("src", "/static/toefl/images/loading.gif");
    $.getJSON("/api/captcha/image", function(b) {
        if (b == null) {
            return
        }
        var a = new Image();
        a.src = b.url;  // 使用返回的 data URL
        a.onload = function() {
            $("#chkImg").attr("src", b.url)
        };
        a = null
    })
}
```

### 方式二：使用现代 JavaScript

```javascript
// 刷新验证码
async function refreshCaptcha() {
  try {
    const response = await fetch('http://localhost:3000/api/captcha/image', {
      credentials: 'include'  // 重要：包含 cookies
    });
    const data = await response.json();
    
    if (data.url) {
      document.getElementById('captchaImg').src = data.url;
    }
  } catch (error) {
    console.error('刷新验证码失败:', error);
  }
}

// 验证验证码
async function verifyCaptcha() {
  const code = document.getElementById('captchaInput').value;
  
  try {
    const response = await fetch('http://localhost:3000/api/captcha/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // 重要：包含 cookies
      body: JSON.stringify({ code })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('验证成功！');
    } else {
      alert(result.message);
      refreshCaptcha(); // 验证失败后刷新验证码
    }
  } catch (error) {
    console.error('验证失败:', error);
    alert('验证失败，请重试');
  }
}
```

### HTML

```html
<div class="captcha-container">
  <img id="captchaImg" src="" 
       alt="验证码" 
       style="cursor: pointer; height: 32px;" 
       onclick="refreshCaptcha()" />
  <span>看不清？点击图片刷新</span>
</div>
<input type="text" id="captchaInput" placeholder="请输入验证码" maxlength="4" />
<button onclick="verifyCaptcha()">验证</button>

<script>
// 页面加载时获取验证码
window.addEventListener('load', refreshCaptcha);
</script>
```

## 登录流程说明

### 完整登录流程

1. **访问登录页面**: 打开 `http://localhost:3000/login.html`

2. **页面自动加载验证码**: 页面会自动调用 `/api/captcha/image` 获取验证码

3. **输入登录信息**:
   - 用户名: `21610904`
   - 密码: `Linda200834$`
   - 验证码: 输入图片中显示的4位字符（不区分大小写）

4. **点击登录按钮**: 系统会：
   - 验证表单是否填写完整
   - 调用 `/api/login` 接口进行登录验证
   - 验证验证码是否正确
   - 验证用户名和密码是否正确

5. **登录成功**: 自动跳转到 `/myHome/postTest.html` 页面

6. **登录失败**: 
   - 显示错误信息
   - 如果是验证码错误，自动刷新验证码
   - 可点击验证码图片手动刷新

### 前端集成示例

```javascript
// 登录函数
async function login() {
  const userName = document.getElementById('userName').value;
  const password = document.getElementById('password').value;
  const verifyCode = document.getElementById('verifyCode').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // 重要：包含 cookies
      body: JSON.stringify({
        userName,
        password,
        verifyCode
      })
    });

    const result = await response.json();

    if (result.success) {
      // 登录成功，跳转
      window.location.href = result.data.redirectUrl;
    } else {
      // 登录失败，显示错误
      alert(result.message);
      if (result.message.includes('验证码')) {
        refreshCaptcha(); // 刷新验证码
      }
    }
  } catch (error) {
    console.error('登录失败:', error);
    alert('登录失败，请稍后重试');
  }
}
```

## 配置说明

### 端口配置

默认端口为 `3000`，可以通过环境变量修改：

```bash
PORT=8080 npm start
```

### Session 配置

在 `server.js` 中可以修改 session 配置：

```javascript
app.use(session({
  secret: 'your-secret-key',      // 修改为你的密钥
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000,       // Session 过期时间（30分钟）
    httpOnly: true
  }
}));
```

### 验证码配置

在 `routes/captcha.js` 中可以修改验证码样式：

```javascript
const captcha = svgCaptcha.create({
  size: 4,              // 验证码长度
  noise: 2,             // 干扰线条数
  color: true,          // 使用彩色字符
  background: '#f0f0f0', // 背景色
  width: 120,           // 宽度
  height: 40,           // 高度
  fontSize: 50,         // 字体大小
  charPreset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' // 字符集
});
```

## 注意事项

1. **CORS 配置**: 如果前端和后端在不同域名下运行，需要确保 CORS 配置正确。

2. **Session 持久化**: 目前使用内存存储 session，生产环境建议使用 Redis 等持久化方案。

3. **验证码过期**: 验证码默认 5 分钟过期，可以在 `routes/captcha.js` 中修改。

4. **Cookies**: 前端请求时必须包含 `credentials: 'include'` 以携带 cookies。

## 开发调试

### 查看验证码信息（仅开发环境）

**接口**: `GET /api/captcha/info`

**响应**:
```json
{
  "success": true,
  "data": {
    "sessionID": "xxx",
    "captcha": "AB12",
    "captchaTime": 1234567890,
    "expired": false
  }
}
```

## 项目结构

```
toefl.neea.cn/
├── server.js           # 主服务器文件
├── routes/
│   └── captcha.js     # 验证码路由
├── package.json       # 项目配置
├── README.md          # 说明文档
└── static/            # 静态文件目录（前端资源）
```

## 许可证

MIT

