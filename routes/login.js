const express = require('express');
const router = express.Router();

// 硬编码的用户凭证
const VALID_USER = {
  username: '21610904',
  password: 'Linda200834$'
};

/**
 * 用户登录接口
 * POST /api/login
 * Body: { userName: string, password: string, verifyCode: string }
 */
router.post('/login', async (req, res) => {
  try {
    const { userName, password, verifyCode } = req.body;

    console.log('登录请求:', {
      用户名: userName,
      验证码输入: verifyCode,
      Session验证码: req.session.captcha,
      SessionID: req.sessionID
    });

    // 1. 验证必填字段
    if (!userName) {
      return res.json({
        success: false,
        message: '请输入用户名'
      });
    }

    if (!password) {
      return res.json({
        success: false,
        message: '请输入密码'
      });
    }

    if (!verifyCode) {
      return res.json({
        success: false,
        message: '请输入验证码'
      });
    }

    // 2. 验证验证码
    const sessionCaptcha = req.session.captcha;
    const captchaTime = req.session.captchaTime;

    if (!sessionCaptcha) {
      return res.json({
        success: false,
        message: '验证码已过期，请重新获取'
      });
    }

    // 检查验证码是否超时（5分钟）
    if (Date.now() - captchaTime > 5 * 60 * 1000) {
      delete req.session.captcha;
      delete req.session.captchaTime;
      return res.json({
        success: false,
        message: '验证码已过期，请重新获取'
      });
    }

    // 验证码长度检查
    if (verifyCode.length !== 4) {
      return res.json({
        success: false,
        message: '验证码格式错误'
      });
    }

    // 验证码比对（不区分大小写）
    if (verifyCode.toUpperCase() !== sessionCaptcha.toUpperCase()) {
      return res.json({
        success: false,
        message: '验证码错误，请重新输入'
      });
    }

    // 验证成功后清除验证码
    delete req.session.captcha;
    delete req.session.captchaTime;

    // 3. 验证用户名和密码
    if (userName !== VALID_USER.username || password !== VALID_USER.password) {
      console.log('用户名或密码错误');
      return res.json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 4. 登录成功，设置 session
    req.session.user = {
      userName: userName,
      neeaId: userName,
      loginTime: new Date().toISOString()
    };

    console.log('登录成功:', userName);

    return res.json({
      success: true,
      message: '登录成功',
      data: {
        userName: userName,
        redirectUrl: '/myHome/postTest.html'
      }
    });

  } catch (error) {
    console.error('登录失败:', error);
    return res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

/**
 * 退出登录接口
 * GET /api/logout
 */
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('退出登录失败:', err);
      return res.json({
        success: false,
        message: '退出登录失败'
      });
    }
    res.json({
      success: true,
      message: '已退出登录'
    });
  });
});

/**
 * 检查登录状态
 * GET /api/check-login
 */
router.get('/check-login', (req, res) => {
  if (req.session.user) {
    res.json({
      success: true,
      loggedIn: true,
      user: req.session.user
    });
  } else {
    res.json({
      success: true,
      loggedIn: false
    });
  }
});

module.exports = router;

