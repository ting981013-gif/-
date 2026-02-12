import React, { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';
import ThemeButton from './components/ThemeButton';
import TarotCard from './components/TarotCard';
import ReadingResult from './components/ReadingResult';
import BaziResult from './components/BaziResult';
import { themes, tarotCards } from './data/tarotCards';
import { OpenAIService } from './services/openaiService';
import { DemoService } from './services/demoService';

function App() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [reading, setReading] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [emotionText, setEmotionText] = useState('');
  const [selectedSpread, setSelectedSpread] = useState('');
  const [analysisPattern, setAnalysisPattern] = useState('过去-现在-未来');
  const [activeTab, setActiveTab] = useState('tarot');
  const [baziInput, setBaziInput] = useState('');
  const [baziReading, setBaziReading] = useState('');
  const [isBaziLoading, setIsBaziLoading] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const [cardsConfirmed, setCardsConfirmed] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [isBaziInputExpanded, setIsBaziInputExpanded] = useState(false);

  // 显示所有牌供用户选择
  const showCardSelection = () => {
    setShowAllCards(true);
    setSelectedCardIds([]);
    setDrawnCards([]);
    setFlippedCards(new Set());
    setShowCards(false);
    setCardsConfirmed(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'tarot') {
      setIsBaziInputExpanded(false);
    } else {
      setIsInputExpanded(false);
    }
  };

  // 用户选择一张牌
  const handleCardSelect = (cardId) => {
    if (selectedCardIds.includes(cardId)) {
      // 如果已选中，则取消选择
      setSelectedCardIds(prev => prev.filter(id => id !== cardId));
    } else if (selectedCardIds.length < 3) {
      // 如果未选中且未选满3张，则添加
      setSelectedCardIds(prev => [...prev, cardId]);
    }
  };

  // 确认选择三张牌
  const confirmCardSelection = () => {
    if (selectedCardIds.length !== 3) return;
    
    const selected = selectedCardIds.map((cardId, idx) => {
      const card = tarotCards.find(c => c.id === cardId);
      return {
        ...card,
        order: idx + 1,
        reversed: Math.random() < 0.5 // 为选中的牌随机设置正逆位
      };
    });
    
    setDrawnCards(selected);
    setFlippedCards(new Set());
    setShowCards(true);
    setCardsConfirmed(true); // 标记已完成选择，但不隐藏圆形排列
  };

  // 处理卡片翻转
  const handleCardFlip = (cardId) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // 获取AI解读
  const getAIReading = async () => {
    if (drawnCards.length === 0) return;

    setIsLoading(true);
    try {
      // 检查是否有 AI API Key（支持 DeepSeek、OpenAI 等）
      const apiKey1 = process.env.REACT_APP_AI_API_KEY;
      const apiKey2 = process.env.REACT_APP_OPENAI_API_KEY;
      const hasApiKey = (apiKey1 || apiKey2) && 
                       apiKey1 !== 'your_api_key_here' &&
                       apiKey2 !== 'your_openai_api_key_here';
      
      // 调试信息
      console.log('🔍 API Key 检测:', {
        'REACT_APP_AI_API_KEY': apiKey1 ? `${apiKey1.substring(0, 10)}...` : '未设置',
        'REACT_APP_OPENAI_API_KEY': apiKey2 ? `${apiKey2.substring(0, 10)}...` : '未设置',
        'hasApiKey': hasApiKey,
        '将使用': hasApiKey ? '真实 API' : '演示模式'
      });
      
      let result;
      if (hasApiKey) {
        result = await OpenAIService.generateTarotReading(selectedTheme?.id || 'general', drawnCards, {
          emotionText,
          spread: selectedSpread,
          analysisPattern
        });
      } else {
        // 使用演示模式
        result = await DemoService.generateTarotReading(selectedTheme?.id || 'general', drawnCards, {
          emotionText,
          spread: selectedSpread,
          analysisPattern
        });
      }
      setReading(result);
    } catch (error) {
      console.error('获取解读失败:', error);
      setReading('抱歉，解读服务暂时不可用。请检查您的网络连接或稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };

  // 重置到初始状态
  const handleReset = () => {
    setSelectedTheme(null);
    setDrawnCards([]);
    setFlippedCards(new Set());
    setReading('');
    setIsLoading(false);
    setShowCards(false);
    setEmotionText('');
    setSelectedSpread('');
    setShowAllCards(false);
    setSelectedCardIds([]);
    setCardsConfirmed(false);
    setIsInputExpanded(false);
    setBaziInput('');
    setBaziReading('');
    setIsBaziInputExpanded(false);
  };

  const handleBaziReset = () => {
    setBaziInput('');
    setBaziReading('');
    setIsBaziInputExpanded(false);
  };


  // 翻完三张后获取解读（不再弹出对话框）
  useEffect(() => {
    if (activeTab !== 'tarot') return;
    if (flippedCards.size === 3 && drawnCards.length === 3) {
      setTimeout(() => {
        getAIReading();
      }, 300);
    }
  }, [flippedCards, drawnCards, activeTab]);

  // 情绪文本 -> 阵式选择
  const inferSpreadFromEmotion = (text) => {
    const t = (text || '').toLowerCase();
    if (t.includes('焦虑') || t.includes('不安') || t.includes('迷茫')) return '三张疗愈阵';
    if (t.includes('爱情') || t.includes('喜欢') || t.includes('分手')) return '恋爱三角阵';
    if (t.includes('考试') || t.includes('工作') || t.includes('压力')) return '成长阵';
    return '三张牌';
  };

  // 根据阵式自动推断解读视角
  const inferAnalysisPatternFromSpread = (spread) => {
    if (!spread) return '过去-现在-未来';
    if (spread.includes('恋爱')) return '过去-现在-未来';
    if (spread.includes('成长')) return '原因-路径-结果';
    if (spread.includes('疗愈')) return '现状-阻碍-趋势';
    return '过去-现在-未来';
  };

  const handleGenerateByEmotion = () => {
    const spread = inferSpreadFromEmotion(emotionText);
    setSelectedSpread(spread);
    setAnalysisPattern(inferAnalysisPatternFromSpread(spread));
    // 不强制关联主题，用户可以选择主题也可以不选择
    setReading('');
    showCardSelection();
  };

  const handleBaziReading = async () => {
    if (!baziInput.trim()) return;
    setIsBaziLoading(true);
    setBaziReading('');
    try {
      const apiKey1 = process.env.REACT_APP_AI_API_KEY;
      const apiKey2 = process.env.REACT_APP_OPENAI_API_KEY;
      const hasApiKey = (apiKey1 || apiKey2) && 
                       apiKey1 !== 'your_api_key_here' &&
                       apiKey2 !== 'your_openai_api_key_here';

      let result;
      if (hasApiKey) {
        result = await OpenAIService.generateBaziReading(baziInput.trim());
      } else {
        result = await DemoService.generateBaziReading(baziInput.trim());
      }
      setBaziReading(result);
    } catch (error) {
      console.error('获取八字解读失败:', error);
      setBaziReading('抱歉，生辰八字解读暂时不可用，请检查网络或稍后再试。');
    } finally {
      setIsBaziLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-pink-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      {/* 主标题 - 左上角 */}
      <div className="absolute top-4 left-4 z-20">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          ✨ AI塔罗占卜 ✨
        </h1>
      </div>

      {/* 演示模式提示 */}
      {(!process.env.REACT_APP_OPENAI_API_KEY || 
        process.env.REACT_APP_OPENAI_API_KEY === 'your_openai_api_key_here') && (
        <div className="absolute top-4 right-4 z-20">
          <div className="inline-flex items-center glass-effect rounded-full px-4 py-2 text-sm text-gray-700">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
            演示模式 - 配置OpenAI API Key启用AI解读
          </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 pt-[275px]">

        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 text-center -mt-14 mb-4">
            今天有什么可以帮到您？
          </h2>
          <div className="flex justify-center mb-8">
            <div className="glass-effect rounded-full p-1 flex space-x-1">
              {[
                { id: 'tarot', label: 'AI塔罗预测' },
                { id: 'bazi', label: '生辰八字解读' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                      : 'text-gray-600 hover:bg-white/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'tarot' && (
            <>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
                {themes.map((theme) => (
                  <ThemeButton
                    key={theme.id}
                    theme={theme}
                    isSelected={selectedTheme?.id === theme.id}
                    onClick={() => {
                      if (selectedTheme?.id === theme.id) {
                        setSelectedTheme(null);
                      } else {
                        setSelectedTheme(theme);
                      }
                    }}
                  />
                ))}
              </div>

              <div className="max-w-4xl mx-auto mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={emotionText}
                    onChange={(e) => setEmotionText(e.target.value)}
                    placeholder="请输入你想问的问题（可包含你的情绪或场景）"
                    rows={3}
                    className="w-full glass-effect rounded-xl px-4 py-3 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  />
                  <button
                    onClick={() => setIsInputExpanded(true)}
                    className="absolute bottom-3 right-3 p-2 text-gray-500 hover:text-purple-600 transition-colors rounded-lg hover:bg-white/50"
                    title="展开输入框"
                  >
                    <Maximize2 size={18} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateByEmotion}
                    className="rounded-xl px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition shadow"
                  >
                    生成塔罗阵
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-xl px-6 py-3 glass-effect text-gray-700 font-medium hover:bg-white/70 transition shadow"
                  >
                    重置
                  </button>
                </div>
              </div>

              {isInputExpanded && (
                <div 
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsInputExpanded(false)}
                >
                  <div 
                    className="glass-effect rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">输入您的问题</h3>
                      <button
                        onClick={() => setIsInputExpanded(false)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-lg transition-colors"
                        title="关闭"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <textarea
                      value={emotionText}
                      onChange={(e) => setEmotionText(e.target.value)}
                      placeholder="请输入你想问的问题（可包含你的情绪或场景）"
                      className="flex-1 w-full glass-effect rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none min-h-[300px]"
                      autoFocus
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">
                        {emotionText.length} 字符
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsInputExpanded(false)}
                          className="rounded-xl px-6 py-2 glass-effect text-gray-700 font-medium hover:bg-white/70 transition shadow"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => {
                            setIsInputExpanded(false);
                            handleGenerateByEmotion();
                          }}
                          className="rounded-xl px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition shadow"
                        >
                          确认并生成塔罗阵
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'bazi' && (
            <>
              <div className="glass-effect rounded-2xl p-6 text-gray-700 leading-relaxed">
                <p className="font-semibold text-gray-900 mb-2">请提供尽可能完整的出生信息：</p>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                  <li>出生日期（阳历）：示例 1995 年 06 月 12 日</li>
                  <li>具体时间（24 小时制）：示例 15:30</li>
                  <li>出生地点：示例 北京市朝阳区</li>
                  <li>可补充：性别 / 当前困惑 / 想重点了解的方向</li>
                </ul>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                <div className="relative">
                  <textarea
                    value={baziInput}
                    onChange={(e) => setBaziInput(e.target.value)}
                    placeholder="例如：\n1995年06月12日 15:30\n出生地：北京市朝阳区\n性别：女\n想重点了解：事业与大运方向"
                    rows={5}
                    className="w-full glass-effect rounded-xl px-4 py-3 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                  <button
                    onClick={() => setIsBaziInputExpanded(true)}
                    className="absolute bottom-3 right-3 p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-white/50"
                    title="展开输入框"
                  >
                    <Maximize2 size={18} />
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleBaziReading}
                    disabled={!baziInput.trim() || isBaziLoading}
                    className={`rounded-xl px-6 py-3 text-white font-medium transition shadow ${
                      !baziInput.trim() || isBaziLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90'
                    }`}
                  >
                    {isBaziLoading ? '生辰解读生成中...' : '生辰解读'}
                  </button>
                  <button
                    onClick={handleBaziReset}
                    className="rounded-xl px-6 py-3 glass-effect text-gray-700 font-medium hover:bg-white/70 transition shadow"
                  >
                    清空输入
                  </button>
                </div>
              </div>

              {isBaziInputExpanded && (
                <div 
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsBaziInputExpanded(false)}
                >
                  <div 
                    className="glass-effect rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">填写出生信息</h3>
                      <button
                        onClick={() => setIsBaziInputExpanded(false)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-lg transition-colors"
                        title="关闭"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <textarea
                      value={baziInput}
                      onChange={(e) => setBaziInput(e.target.value)}
                      placeholder="请填写出生年月日、具体时间、出生地点等信息，越完整越准确。"
                      className="flex-1 w-full glass-effect rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[300px]"
                      autoFocus
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">{baziInput.length} 字符</div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsBaziInputExpanded(false)}
                          className="rounded-xl px-6 py-2 glass-effect text-gray-700 font-medium hover:bg-white/70 transition shadow"
                        >
                          关闭
                        </button>
                        <button
                          onClick={() => {
                            setIsBaziInputExpanded(false);
                            handleBaziReading();
                          }}
                          className="rounded-xl px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:opacity-90 transition shadow"
                          disabled={!baziInput.trim()}
                        >
                          确认并生辰解读
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 所有牌圆形排列展示区域和选中的三张牌 */}
        {activeTab === 'tarot' && showAllCards && (
          <div className="max-w-7xl mx-auto mb-12">
            {!cardsConfirmed && (
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 mb-4">
                  请从下方选择三张牌（已选择 {selectedCardIds.length}/3）
                </p>
                {selectedCardIds.length === 3 && (
                  <button
                    onClick={confirmCardSelection}
                    className="rounded-xl px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition shadow-lg text-lg"
                  >
                    确认选择这三张牌
                  </button>
                )}
              </div>
            )}
            
            {/* 使用 flex 布局，让圆形排列和选中的三张牌在同一行 */}
            <div className={`flex flex-col ${cardsConfirmed ? 'lg:flex-row' : ''} items-center ${cardsConfirmed ? 'lg:items-start' : ''} justify-center gap-8`}>
              {/* 圆形排列区域 */}
              <div 
                className={`relative transition-all duration-500 ${
                  cardsConfirmed ? 'flex-shrink-0 lg:mr-8' : 'mx-auto'
                }`}
                style={{ 
                  width: cardsConfirmed ? '400px' : '700px', 
                  height: cardsConfirmed ? '400px' : '700px'
                }}
              >
                {tarotCards.map((card, index) => {
                  const totalCards = tarotCards.length;
                  const angle = (index / totalCards) * 2 * Math.PI - Math.PI / 2; // 从顶部开始
                  const radius = cardsConfirmed ? 140 : 250; // 根据状态调整半径
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const isSelected = selectedCardIds.includes(card.id);
                  const selectionIndex = isSelected ? selectedCardIds.indexOf(card.id) + 1 : null;
                  
                  return (
                    <div
                      key={card.id}
                      onClick={() => !cardsConfirmed && handleCardSelect(card.id)}
                      className={`absolute transition-all duration-300 ${
                        cardsConfirmed ? 'cursor-default' : 'cursor-pointer'
                      } ${
                        isSelected ? (cardsConfirmed ? 'scale-110 z-20' : 'scale-125 z-20') : cardsConfirmed ? 'scale-100' : 'hover:scale-110 z-10'
                      } ${!cardsConfirmed && selectedCardIds.length >= 3 && !isSelected ? 'opacity-40' : 'opacity-100'}`}
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)',
                        width: cardsConfirmed ? '60px' : '100px',
                        height: cardsConfirmed ? '90px' : '150px'
                      }}
                    >
                      <div className="glass-effect p-1 rounded-lg h-full">
                        <div className="w-full h-full rounded-lg overflow-hidden">
                          <img 
                            src="/tarot-back.png" 
                            alt={card.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg border-2 border-white">
                          {selectionIndex}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 选中的三张牌展示 */}
              {cardsConfirmed && showCards && drawnCards.length > 0 && (
                <div className="flex-shrink-0 flex items-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {drawnCards.map((card, index) => (
                      <div key={card.id} className="animate-slideUp" style={{ animationDelay: `${index * 0.2}s` }}>
                        <TarotCard
                          card={card}
                          isFlipped={flippedCards.has(card.id)}
                          onClick={() => handleCardFlip(card.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 如果没有显示所有牌，但已选中三张牌，则单独显示 */}
        {activeTab === 'tarot' && !showAllCards && showCards && drawnCards.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {drawnCards.map((card, index) => (
                <div key={card.id} className="animate-slideUp" style={{ animationDelay: `${index * 0.2}s` }}>
                  <TarotCard
                    card={card}
                    isFlipped={flippedCards.has(card.id)}
                    onClick={() => handleCardFlip(card.id)}
                  />
                </div>
              ))}
            </div>
            
            {flippedCards.size < 3 && (
              <div className="text-center mt-12">
                <p className="inline-block px-4 py-2 rounded-lg bg-white/90 text-gray-700 text-lg shadow">
                  请依次点击卡片查看牌面，全部翻开后将为您生成AI解读
                </p>
              </div>
            )}
          </div>
        )}

        {/* AI解读结果 */}
        {activeTab === 'tarot' && (reading || isLoading) && (
          <ReadingResult
            reading={reading}
            isLoading={isLoading}
            asDialog={false}
            header={{
              subtitle: `${selectedTheme ? selectedTheme.name : '综合主题'} · ${selectedSpread || '三张牌'} · ${emotionText || '无情绪描述'}`,
              title: '综合解读'
            }}
          />
        )}

        {activeTab === 'bazi' && (
          <BaziResult reading={baziReading} isLoading={isBaziLoading} />
        )}

        {/* 底部装饰 */}
        <div className="text-center mt-16">
          <p className="text-gray-800 text-sm">
            ✨ 塔罗牌解读仅供参考，请以积极的心态面对生活 ✨
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
