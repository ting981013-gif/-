const { tarotCards, themes } = require('../../utils/tarotCards');
const { generateTarotReading } = require('../../utils/aiService');

Page({
  data: {
    themes: themes.map(t => ({
      ...t,
      styleStr: `padding: 16rpx 12rpx; border-radius: 16rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6rpx; border: 1rpx solid ${t.id === 'love' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(148, 163, 184, 0.2)'}; background: #ffffff; box-shadow: ${t.id === 'love' ? '0 4rpx 12rpx rgba(124, 58, 237, 0.15)' : '0 2rpx 8rpx rgba(0, 0, 0, 0.05)'}; box-sizing: border-box;`
    })),
    selectedThemeId: 'love',
    emotionText: '',
    selectedCards: [],
    selectedCardIds: [],
    showAllCards: false,
    flippedCards: [],
    readingText: '',
    loading: false,
    allTarotCards: tarotCards
  },

  onSelectTheme(e) {
    const { id } = e.currentTarget.dataset;
    const themes = this.data.themes.map(t => ({
      ...t,
      styleStr: `padding: 16rpx 12rpx; border-radius: 16rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6rpx; border: 1rpx solid ${id === t.id ? 'rgba(124, 58, 237, 0.3)' : 'rgba(148, 163, 184, 0.2)'}; background: #ffffff; box-shadow: ${id === t.id ? '0 4rpx 12rpx rgba(124, 58, 237, 0.15)' : '0 2rpx 8rpx rgba(0, 0, 0, 0.05)'}; box-sizing: border-box;`
    }));
    this.setData({
      selectedThemeId: id,
      themes
    });
  },

  onEmotionInput(e) {
    this.setData({
      emotionText: e.detail.value.slice(0, 180)
    });
  },

  onShowCardSelection() {
    this.setData({
      showAllCards: true,
      selectedCardIds: [],
      selectedCards: [],
      flippedCards: []
    });
  },

  onCardSelect(e) {
    const { id } = e.currentTarget.dataset;
    const { selectedCardIds } = this.data;
    
    if (selectedCardIds.includes(id)) {
      // 如果已选中，则取消选择
      this.setData({
        selectedCardIds: selectedCardIds.filter(cardId => cardId !== id)
      });
    } else if (selectedCardIds.length < 3) {
      // 如果未选中且未选满3张，则添加
      this.setData({
        selectedCardIds: [...selectedCardIds, id]
      });
    } else {
      wx.showToast({
        title: '最多只能选择3张牌',
        icon: 'none',
        duration: 2000
      });
    }
  },

  onConfirmCardSelection() {
    const { selectedCardIds, allTarotCards } = this.data;
    
    if (selectedCardIds.length !== 3) {
      wx.showToast({
        title: '请选择3张牌',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    const selected = selectedCardIds.map((cardId, idx) => {
      const card = allTarotCards.find(c => c.id === cardId);
      return {
        ...card,
        order: idx + 1,
        reversed: Math.random() < 0.5 // 为选中的牌随机设置正逆位
      };
    });
    
    this.setData({
      selectedCards: selected,
      showAllCards: false,
      selectedCardIds: [],
      flippedCards: [] // 重置翻转状态
    });
  },

  onCardFlip(e) {
    const { index } = e.currentTarget.dataset;
    const { flippedCards } = this.data;
    const newFlippedCards = [...flippedCards];
    
    if (newFlippedCards.includes(index)) {
      // 如果已翻转，则翻回去
      newFlippedCards.splice(newFlippedCards.indexOf(index), 1);
    } else {
      // 如果未翻转，则翻转
      newFlippedCards.push(index);
    }
    
    this.setData({
      flippedCards: newFlippedCards
    });
  },

  async onDrawAndAsk() {
    if (this.data.loading) return;

    const { selectedThemeId, emotionText, selectedCards } = this.data;

    if (selectedCards.length === 0) {
      wx.showToast({
        title: '请先选择3张牌',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({
      loading: true,
      readingText: ''
    });

    wx.showLoading({
      title: '正在解读中…',
      mask: true
    });

    try {
      const text = await generateTarotReading(selectedThemeId, selectedCards, {
        emotionText,
        spread: '三张牌',
        analysisPattern: '现状-阻碍-趋势'
      });

      this.setData({
        readingText: text || '暂时没有得到有效的解读结果，请稍后重试。',
        loading: false
      });
    } catch (error) {
      console.error('AI 解读失败', error);
      this.setData({
        loading: false
      });
      wx.showToast({
        title: '解读失败，请稍后重试',
        icon: 'none',
        duration: 3000
      });
    } finally {
      wx.hideLoading();
    }
  }
});


