const { AI_API_BASE, AI_MODEL, AI_API_KEY } = require('./config');

function callAIAPI(payload) {
  return new Promise((resolve, reject) => {
    if (!AI_API_KEY) {
      reject(new Error('请先在 miniapp/utils/config.js 中配置 AI_API_KEY'));
      return;
    }

    wx.request({
      url: `${AI_API_BASE}/chat/completions`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      },
      data: payload,
      success(res) {
        if (res.statusCode !== 200 || !res.data || !res.data.choices || !res.data.choices[0]) {
          reject(new Error('AI 接口返回异常：' + res.statusCode));
          return;
        }
        resolve(res.data.choices[0].message.content);
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

function buildTarotPrompt(theme, cards, options) {
  const { emotionText = '', spread = '', analysisPattern = '现状-阻碍-趋势' } = options || {};

  const themeNames = {
    love: '感情',
    study: '学业',
    work: '工作',
    money: '财运',
    health: '健康'
  };

  const themeName = themeNames[theme] || theme || '综合主题';
  const hasSpecificTheme = theme && theme !== 'general';

  const c0 = cards[0];
  const c1 = cards[1];
  const c2 = cards[2];

  const unifiedPrompt = `作为一位专业的塔罗占卜师，请根据以下信息为求卜者提供详细解读：

${hasSpecificTheme ? `主题：${themeName}` : '主题：综合主题'}
情绪/问题：${emotionText || '（未提供）'}
阵式：${spread || '三张牌'}
抽到的牌：
1️⃣ ${c0.name}（${c0.reversed ? '逆位' : '正位'}）
2️⃣ ${c1.name}（${c1.reversed ? '逆位' : '正位'}）
3️⃣ ${c2.name}（${c2.reversed ? '逆位' : '正位'}）

请严格按以下"五段结构"输出，每段之间空行，语言温暖、专业且富有诗意：

💫 一、整体解读

请给出这三张牌连在一起的能量走向（如：内在XX → 机缘XX → 全新XX），用2-4句话点明${hasSpecificTheme ? `在${themeName}方面` : ''}与"${emotionText || '此问题'}"的关联，说明关键主题与求卜者应有的姿态。

🌹 二、逐张解析

请逐张详细说明（每张牌独立成段，含emoji图标）：

🦁 第一张：${c0.name}（${c0.reversed ? '逆位' : '正位'}）
基本含义：${c0.meaning}
象征意义与当前阶段：${hasSpecificTheme ? `在${themeName}方面，` : ''}说明这张牌代表的核心状态或优势。
→ 暗示：给出一句具体的行动/心态提示。
💡 场景化建议：如果求卜者最近有XX调整，这张牌确认/提醒XX。

🔮 第二张：${c1.name}（${c1.reversed ? '逆位' : '正位'}）
基本含义：${c1.meaning}
象征意义与挑战/变量：${hasSpecificTheme ? `在${themeName}方面，` : ''}说明这张牌指向的阻碍或转折点。
→ 时间点/场景：给出具体的时间窗口或可能的契机场景（如"通过XX、XX、或XX遇到对的人"）。

🌈 第三张：${c2.name}（${c2.reversed ? '逆位' : '正位'}）
基本含义：${c2.meaning}
象征意义与最终走向：${hasSpecificTheme ? `在${themeName}方面，` : ''}说明这张牌代表的结果或方向。
→ 核心提示：给出一句加引号的关键判断（如"命运会给你XX，而你需要的是XX"）。
→ 补充说明：指出对方/目标可能的特征或需要注意的边界。

🕰 三、时间与结果趋势

从牌序看：
${c0.name}（现阶段）→ XX；
${c1.name}（近期X个月内）→ XX；
${c2.name}（结果）→ XX。

🔸 推断时间：给出具体的时间区间（如"今年底前（尤其是X月至X月之间）"），语气肯定但留有弹性。

💗 四、指引与建议

请给出3-5条可执行建议（用短句+冒号格式），覆盖心态、行动与边界感，每条贴合三张牌的能量：
- XX：具体建议；
- XX：具体建议；
- XX：具体建议；
- XX：具体建议。

✨ 总结结论

用2-3句话收束本次解读，提炼关键判断与优先级；然后给出一句加引号的鼓励语，引导求卜者以正向、轻盈的方式推进下一步。

重要要求：
1. 不要出现"general"字样；${hasSpecificTheme ? `所有内容围绕${themeName}主题展开` : '直接针对问题，不要出现"在XX方面"的表述'}；
2. 三张牌的表述角度必须明显不同，禁止复用句式模板；
3. 每段都要空行分隔，保持格式清晰；
4. 语言既要专业又要温暖，给出具体场景与可执行建议，避免抽象空洞。`;

  return unifiedPrompt;
}

function generateTarotReading(theme, cards, options) {
  const prompt = buildTarotPrompt(theme, cards, options);
  const messages = [
    {
      role: 'system',
      content: '你是一位经验丰富的塔罗占卜师，擅长用温暖、专业且富有诗意的话语为人们提供指导。'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  return callAIAPI({
    model: AI_MODEL,
    messages,
    max_tokens: 2000,
    temperature: 0.8
  });
}

module.exports = {
  generateTarotReading
};


