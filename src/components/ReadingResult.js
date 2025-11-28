import React from 'react';
import { Sparkles, Heart, Lightbulb, Shield, Star, Clock } from 'lucide-react';

const ReadingResult = ({ reading, isLoading, asDialog = false, onClose, header }) => {
  if (isLoading) {
    return (
      <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto animate-pulse">
        <div className="flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          <span className="ml-3 text-gray-800 text-lg">AI正在为您解读...</span>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-black/10 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!reading) return null;

  // 解析AI返回的文本（新五段结构优先，兼容旧结构）
  const parseReading = (text) => {
    const result = { overview: '', cards: '', timeline: '', advice: '', summary: '' };

    const headers = [
      { key: 'overview', regex: /(💫\s*一、整体解读|一、整体解读)/ },
      { key: 'cards', regex: /(🌹\s*二、逐张解析|二、逐张解析|【单张牌解析】)/ },
      { key: 'timeline', regex: /(🕰\s*三、时间与结果趋势|三、时间与结果趋势|时间预示)/ },
      { key: 'advice', regex: /(💗\s*四、指引与建议|四、指引与建议|解决方式)/ },
      { key: 'summary', regex: /(✨\s*总结结论|总结结论|暖心激励(?:结尾)?|总结)/ }
    ];

    const markers = [];
    for (const h of headers) {
      const m = text.match(h.regex);
      if (m) markers.push({ key: h.key, label: m[0], idx: text.indexOf(m[0]) });
    }
    markers.sort((a, b) => a.idx - b.idx);

    if (markers.length) {
      // 把第一个标题前的内容作为 overview 兜底
      if (markers[0].idx > 0) {
        result.overview = text.slice(0, markers[0].idx).trim();
      }
      for (let i = 0; i < markers.length; i++) {
        const start = markers[i].idx + markers[i].label.length;
        const end = i + 1 < markers.length ? markers[i + 1].idx : text.length;
        result[markers[i].key] = text.slice(start, end).trim();
      }
      return result;
    }

    // 兼容旧的数字分段结构
    const legacy = text.split(/\n\s*\d+[、.]/).map(s => s.trim()).filter(Boolean);
    return {
      overview: legacy[0] || '',
      cards: legacy[1] || '',
      timeline: '',
      advice: legacy[2] || '',
      summary: legacy[3] || ''
    };
  };

  // 基础清理
  const sanitizedReading = reading.replace(/在general方面[，,：:]?/g, '');
  const parsedRaw = parseReading(sanitizedReading);

  // 清理段落开头多余的符号/编号（如孤立的":"、"3."等）
  const cleanSection = (text) => {
    if (!text) return '';
    const lines = text.split('\n');
    while (lines.length) {
      const first = lines[0].trim();
      if (first === '' || first === ':' || first === '：' || /^\d+[\.、]$/.test(first)) {
        lines.shift();
        continue;
      }
      break;
    }
    let out = lines.join('\n');
    out = out.replace(/^\s*[:：]\s*/, '');
    return out.trim();
  };

  const parsed = {
    overview: cleanSection(parsedRaw.overview) || '（本次解读的整体能量：三张牌合力所指向的核心主题、关键走向与与问题的关联。若模型未显式输出该段，此处作为兜底文案。）',
    cards: cleanSection(parsedRaw.cards),
    timeline: cleanSection(parsedRaw.timeline),
    advice: cleanSection(parsedRaw.advice),
    summary: cleanSection(parsedRaw.summary)
  };

  const content = (
    <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto animate-fadeIn">
      {header && (
        <div className="mb-6 text-center">
          <div className="text-sm text-gray-600">{header.subtitle}</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{header.title}</div>
        </div>
      )}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="text-yellow-400 w-8 h-8 mr-2" />
          <h2 className="text-3xl font-bold text-gray-900">塔罗解读结果</h2>
          <Sparkles className="text-yellow-400 w-8 h-8 ml-2" />
        </div>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
      </div>

      <div className="space-y-8">
        {/* 一、整体解读 */}
        {parsed.overview && (
          <div className="animate-slideUp">
            <div className="flex items-center mb-4">
              <Heart className="text-pink-400 w-6 h-6 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">一、整体解读</h3>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">{parsed.overview}</p>
            </div>
          </div>
        )}

        {/* 二、逐张解析 */}
        {parsed.cards && (
          <div className="animate-slideUp">
            <div className="flex items-center mb-4">
              <Shield className="text-orange-400 w-6 h-6 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">二、逐张解析</h3>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">{parsed.cards}</p>
            </div>
          </div>
        )}

        {/* 三、时间与结果趋势 */}
        {parsed.timeline && (
          <div className="animate-slideUp">
            <div className="flex items-center mb-4">
              <Clock className="text-yellow-400 w-6 h-6 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">三、时间与结果趋势</h3>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">{parsed.timeline}</p>
            </div>
          </div>
        )}

        {/* 四、指引与建议 */}
        {parsed.advice && (
          <div className="animate-slideUp">
            <div className="flex items-center mb-4">
              <Lightbulb className="text-yellow-400 w-6 h-6 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">四、指引与建议</h3>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">{parsed.advice}</p>
            </div>
          </div>
        )}

        {/* 五、总结结论 */}
        {parsed.summary && (
          <div className="animate-slideUp">
            <div className="flex items-center mb-4">
              <Star className="text-purple-400 w-6 h-6 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">五、总结结论</h3>
            </div>
            <div className="glass-effect rounded-xl p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <p className="text-gray-900 leading-relaxed text-lg font-medium italic whitespace-pre-line">{parsed.summary}</p>
            </div>
          </div>
        )}

        {/* 追问模块已移除 */}
      </div>
    </div>
  );

  if (!asDialog) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="relative w-full max-w-2xl mx-4 max-h-[80vh] overflow-auto">
        {content}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white/90 text-gray-700 rounded-full w-8 h-8 shadow hover:bg-white"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ReadingResult;
