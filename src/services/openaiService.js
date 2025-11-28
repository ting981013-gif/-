// AI API 服务（支持 OpenAI 和 DeepSeek）
const AI_API_KEY = process.env.REACT_APP_AI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;
const AI_API_BASE = 'https://api.deepseek.com/v1';
const AI_MODEL = process.env.REACT_APP_AI_MODEL || 'deepseek-chat';

export class OpenAIService {
  static async generateTarotReading(theme, cards, options = {}) {
    if (!AI_API_KEY) {
      throw new Error('AI API key not found. Please set REACT_APP_AI_API_KEY in your environment variables.');
    }

    const themeNames = {
      'love': '感情',
      'study': '学业', 
      'work': '工作',
      'money': '财运',
      'health': '健康'
    };

    const themeName = themeNames[theme] || theme || '综合主题';
    const { emotionText = '', spread = '', analysisPattern = '现状-阻碍-趋势' } = options;
    
    const hasSpecificTheme = theme && theme !== 'general';
    
    // 统一的五段结构提示词（参考用户模板）
    const unifiedPrompt = `作为一位专业的塔罗占卜师，请根据以下信息为求卜者提供详细解读：

${hasSpecificTheme ? `主题：${themeName}` : '主题：综合主题'}
情绪/问题：${emotionText || '（未提供）'}
阵式：${spread || '三张牌'}
抽到的牌：
1️⃣ ${cards[0].name}（${cards[0].reversed ? '逆位' : '正位'}）
2️⃣ ${cards[1].name}（${cards[1].reversed ? '逆位' : '正位'}）
3️⃣ ${cards[2].name}（${cards[2].reversed ? '逆位' : '正位'}）

请严格按以下"五段结构"输出，每段之间空行，语言温暖、专业且富有诗意：

💫 一、整体解读

请给出这三张牌连在一起的能量走向（如：内在XX → 机缘XX → 全新XX），用2-4句话点明${hasSpecificTheme ? `在${themeName}方面` : ''}与"${emotionText || '此问题'}"的关联，说明关键主题与求卜者应有的姿态。

🌹 二、逐张解析

请逐张详细说明（每张牌独立成段，含emoji图标）：

🦁 第一张：${cards[0].name}（${cards[0].reversed ? '逆位' : '正位'}）
基本含义：${cards[0].meaning}
象征意义与当前阶段：${hasSpecificTheme ? `在${themeName}方面，` : ''}说明这张牌代表的核心状态或优势。
→ 暗示：给出一句具体的行动/心态提示。
💡 场景化建议：如果求卜者最近有XX调整，这张牌确认/提醒XX。

🔮 第二张：${cards[1].name}（${cards[1].reversed ? '逆位' : '正位'}）
基本含义：${cards[1].meaning}
象征意义与挑战/变量：${hasSpecificTheme ? `在${themeName}方面，` : ''}说明这张牌指向的阻碍或转折点。
→ 时间点/场景：给出具体的时间窗口或可能的契机场景（如"通过XX、XX、或XX遇到对的人"）。

🌈 第三张：${cards[2].name}（${cards[2].reversed ? '逆位' : '正位'}）
基本含义：${cards[2].meaning}
象征意义与最终走向：${hasSpecificTheme ? `在${themeName}方面，` : ''}说明这张牌代表的结果或方向。
→ 核心提示：给出一句加引号的关键判断（如"命运会给你XX，而你需要的是XX"）。
→ 补充说明：指出对方/目标可能的特征或需要注意的边界。

🕰 三、时间与结果趋势

从牌序看：
${cards[0].name}（现阶段）→ XX；
${cards[1].name}（近期X个月内）→ XX；
${cards[2].name}（结果）→ XX。

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

    try {
      const response = await fetch(`${AI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            {
              role: 'system',
              content: '你是一位经验丰富的塔罗占卜师，擅长用温暖、专业且富有诗意的话语为人们提供指导。'
            },
            {
              role: 'user',
              content: unifiedPrompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI API Error:', error);
      throw error;
    }
  }

  static async askFollowUp(previousReading, followUpQuestion) {
    if (!AI_API_KEY) throw new Error('No API key');
    const messages = [
      { role: 'system', content: '你是一位温暖、专业且富有同理心的塔罗占卜师。' },
      { role: 'user', content: `以下是之前的塔罗解读：\n${previousReading}` },
      { role: 'user', content: `基于以上解读，我还有追问：${followUpQuestion}。请延续语气、给出具体建议。` }
    ];
    const response = await fetch(`${AI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({ model: AI_MODEL, messages, max_tokens: 800, temperature: 0.8 })
    });
    if (!response.ok) throw new Error(`AI API error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }

  static async generateBaziReading(birthInfo) {
    if (!AI_API_KEY) {
      throw new Error('AI API key not found. Please set REACT_APP_AI_API_KEY in your environment variables.');
    }

    const prompt = `你是一位通晓子平命理、紫微斗数与现代心理辅导的国学命理师。
请根据以下生辰信息，推演出生辰八字，并提供结构化的详尽分析：

出生信息：
${birthInfo}

请按照以下结构输出（每段之间空行，适度使用 emoji 强调）：

1. 命主八字速览
- 列出天干地支、日主强弱、用神喜忌、阴阳五行平衡情况

2. 四柱排盘解析
- 年柱、月柱、日柱、时柱：分别说明其象征的家庭背景、成长环境、个性底色、潜在天赋

3. 神煞与特殊信息
- 列出关键神煞（如桃花、驿马、文昌、将星等）以及可能的影响

4. 大运与流年
- 以 10 年为单位概述未来大运走势，并提示最近 1-2 个流年的机会与挑战

5. 人生阶段重点
- 分别描述幼年/少年/青年/中年/老年的整体趋势，可用 bullet 形式

6. 专项建议
- 针对感情、学业/能力、工作/事业、财富、健康逐一给出具体建议

7. 综合总结
- 用 2-3 句话概括命主此生的核心课题与力量来源，并以一句鼓励语收尾。

要求：语言温暖、尊重、易懂；如信息不足，请在相关段落温和提示，但仍给出通用建议。`;

    const response = await fetch(`${AI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: '你是一位融合传统命理与现代心理的国学命理师，表达温暖、细腻、具有画面感。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1800,
        temperature: 0.75
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
