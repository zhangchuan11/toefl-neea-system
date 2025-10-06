const express = require('express');
const svgCaptcha = require('svg-captcha');
const router = express.Router();

// 生成随机ID
function generateCaptchaId() {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 获取验证码图片（SVG格式）
 * GET /api/captcha/image
 * 返回 JSON 格式: { url: "data:image/svg+xml;base64,..." }
 */
router.get('/captcha/image', (req, res) => {
  try {
    // 创建验证码
    const captcha = svgCaptcha.create({
      size: 4, // 验证码长度
      noise: 0, // 干扰线条数
      color: false, // 验证码字符使用彩色
      background: '#46514B', // 背景色
      width: 95,
      height: 32,
      fontSize: 35,
      charPreset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' // 字符集
    });

    // 将验证码文本存储在 session 中
    req.session.captcha = captcha.text.toUpperCase();
    req.session.captchaTime = Date.now();

    console.log('生成验证码:', captcha.text, '| Session ID:', req.sessionID);

    // 将 SVG 转为 base64 data URL
    const svgBase64 = Buffer.from(captcha.data).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

    // 返回 JSON 格式（兼容前端 getCaptcha 函数）
    res.json({
      url: dataUrl
    });
  } catch (error) {
    console.error('生成验证码失败:', error);
    res.status(500).json({
      success: false,
      message: '生成验证码失败'
    });
  }
});

/**
 * 获取验证码图片（带ID的路径，兼容旧接口）
 * GET /api/captcha/:id.jpg
 * 直接返回 SVG 图片
 */
router.get('/captcha/:id.jpg', (req, res) => {
  try {
    // 创建验证码
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 0,
      color: false,
      background: '#46514B',
      width: 95,
      height: 32,
      fontSize: 35,
      charPreset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    });

    // 将验证码文本存储在 session 中
    req.session.captcha = captcha.text.toUpperCase();
    req.session.captchaTime = Date.now();

    console.log('生成验证码(jpg路径):', captcha.text, '| Session ID:', req.sessionID);

    // 返回 SVG 图片
    res.type('svg');
    res.status(200).send(captcha.data);
  } catch (error) {
    console.error('生成验证码失败:', error);
    res.status(500).send('验证码生成失败');
  }
});

/**
 * 获取新的验证码ID（用于前端刷新）
 * GET /api/captcha/new-id
 */
router.get('/captcha/new-id', (req, res) => {
  const captchaId = generateCaptchaId();
  res.json({
    success: true,
    captchaId: captchaId,
    captchaUrl: `/api/captcha/image?t=${Date.now()}`
  });
});

/**
 * 验证验证码
 * POST /api/captcha/verify
 * Body: { code: string }
 */
router.post('/captcha/verify', (req, res) => {
  try {
    const { code } = req.body;
    const sessionCaptcha = req.session.captcha;
    const captchaTime = req.session.captchaTime;

    console.log('验证验证码:', {
      输入: code?.toUpperCase(),
      正确答案: sessionCaptcha,
      SessionID: req.sessionID
    });

    // 检查验证码是否存在
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

    // 验证码不能为空
    if (!code) {
      return res.json({
        success: false,
        message: '请输入验证码'
      });
    }

    // 验证码长度检查
    if (code.length !== 4) {
      return res.json({
        success: false,
        message: '验证码格式错误'
      });
    }

    // 验证码比对（不区分大小写）
    if (code.toUpperCase() === sessionCaptcha) {
      // 验证成功后清除验证码
      delete req.session.captcha;
      delete req.session.captchaTime;
      
      return res.json({
        success: true,
        message: '验证码验证成功'
      });
    } else {
      return res.json({
        success: false,
        message: '验证码错误'
      });
    }
  } catch (error) {
    console.error('验证验证码失败:', error);
    res.status(500).json({
      success: false,
      message: '验证失败'
    });
  }
});

/**
 * 获取验证码信息（调试用）
 * GET /api/captcha/info
 */
router.get('/captcha/info', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: '生产环境不可用'
    });
  }

  res.json({
    success: true,
    data: {
      sessionID: req.sessionID,
      captcha: req.session.captcha || null,
      captchaTime: req.session.captchaTime || null,
      expired: req.session.captchaTime ? 
        Date.now() - req.session.captchaTime > 5 * 60 * 1000 : 
        true
    }
  });
});

module.exports = router;

