/**
 * 阿里云函数计算 - 完整应用（配合API网关使用）
 */

const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const captchaRouter = require('./routes/captcha');
const loginRouter = require('./routes/login');

// 创建 Express 应用
const app = express();

// 中间件配置
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session 配置
app.use(session({
  secret: process.env.SESSION_SECRET || 'toefl-neea-secret-key-2024',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    secure: false
  }
}));

// API 路由
app.use('/api', captchaRouter);
app.use('/api', loginRouter);

// 静态文件服务
app.use('/static', express.static(path.join(__dirname, 'static')));

// HTML 文件路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/example.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'example.html'));
});

app.get('/topper.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'topper.html'));
});

app.get('/footer.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'footer.html'));
});

app.get('/newsList.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'newsList.html'));
});

app.get('/queryAdminDate.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'queryAdminDate.html'));
});

// myHome 目录
const myHomeFiles = [
  'postTest.html', 'profileInfo.html', 'profileUpdatePassword.html',
  'showAllValuePack.html', 'showCreatedValuePack.html', 'showPayment.html',
  'showRefund.html', 'showVoucher.html',
  'cj1.html', 'cj2.html', 'cj3.html', 'cj4.html'
];

myHomeFiles.forEach(file => {
  app.get(`/myHome/${file}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'myHome', file));
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 使用 serverless-http 包装
const handler = serverless(app);

// 导出 handler
module.exports.handler = handler;

// 本地开发模式
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 服务器已启动: http://localhost:${PORT}`);
    console.log(`📝 验证码接口: http://localhost:${PORT}/api/captcha/image`);
    console.log(`✅ 健康检查: http://localhost:${PORT}/api/health`);
  });
}
