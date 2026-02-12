// 在这里配置你的 AI 接口信息
// ⚠️ 注意：直接在小程序里写明文 Key 有被抓包泄露的风险，正式上线建议通过自己的服务端中转

const AI_API_BASE = 'https://api.deepseek.com/v1';
const AI_MODEL = 'deepseek-chat';

// TODO: 填写你的 API Key，例如：
// const AI_API_KEY = 'sk-xxxx';
const AI_API_KEY = 'sk-92f5dff25f5e4d3a9226264a8061818f';

module.exports = {
  AI_API_BASE,
  AI_MODEL,
  AI_API_KEY
};


