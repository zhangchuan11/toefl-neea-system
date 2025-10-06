/**
 * 前端配置文件
 * 配置后端API地址
 */

// API基础地址 - 函数计算地址
const API_BASE_URL = 'https://toefl-nfunction-bybuoxiteu.cn-hangzhou.fcapp.run';

// 或者使用API网关地址（如果配置了）
// const API_BASE_URL = 'http://8bb27a71343d473dabc67f1a7a5a74c1-cn-hangzhou.alicloudapi.com';

// API配置
window.TOEFL_CONFIG = {
  // API基础URL
  apiBaseUrl: API_BASE_URL,
  
  // 具体API端点
  api: {
    captchaImage: API_BASE_URL + '/api/captcha/image',
    captchaVerify: API_BASE_URL + '/api/captcha/verify',
    login: API_BASE_URL + '/api/login',
    logout: API_BASE_URL + '/api/logout',
    checkLogin: API_BASE_URL + '/api/check-login',
    health: API_BASE_URL + '/api/health'
  },
  
  // 其他配置
  timeout: 30000,  // 请求超时时间（毫秒）
  withCredentials: true  // 携带cookie
};

console.log('API配置已加载:', window.TOEFL_CONFIG);


