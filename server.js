const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const captchaRouter = require('./routes/captcha');
const loginRouter = require('./routes/login');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session 配置
app.use(session({
  secret: 'toefl-neea-secret-key-2024',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000, // 30分钟
    httpOnly: true
  }
}));

// 静态文件服务
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.static(__dirname));

// API 路由
app.use('/api', captchaRouter);
app.use('/api', loginRouter);

// 兼容原有的验证码路径（用于直接访问图片）
app.get('/captcha/:id.jpg', (req, res) => {
  res.redirect('/api/captcha/image');
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 404 处理
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      message: '接口不存在'
    });
  } else {
    next();
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 服务器已启动: http://localhost:${PORT}`);
  console.log(`📝 验证码接口: http://localhost:${PORT}/api/captcha/image`);
  console.log(`✅ 健康检查: http://localhost:${PORT}/api/health`);
});

