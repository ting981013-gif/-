const { tarotCards, themes } = require('../../utils/tarotCards.js');

Page({
  data: {
    themes,
    selectedThemeId: themes[0]?.id || '',
    emotionText: '',
    allCards: tarotCards,
    circleCards: [],
    selectedCardIds: [],
    drawnCards: [],
    aiReading: ''
  },

  onLoad() {
    this.initCircleCards();
  },

  // 计算圆形排列坐标（与网页版思路一致）
  initCircleCards() {
    const total = tarotCards.length;
    const radius = 220; // 半径，单位 rpx，适当缩小避免重叠
    const center = 270; // 圆心坐标

    const circleCards = tarotCards.map((card, index) => {
      const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // 从顶部开始
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return {
        ...card,
        left: center + x,
        top: center + y,
        selectionIndex: 0
      };
    });

    this.setData({ circleCards });
  },

  onThemeTap(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ selectedThemeId: id });
  },

  onEmotionInput(e) {
    this.setData({ emotionText: e.detail.value });
  },

  // 根据输入生成塔罗阵（这里主要是重置选择，方便用户重新来过）
  onGenerateSpread() {
    this.setData({
      selectedCardIds: [],
      drawnCards: [],
      aiReading: '',
      circleCards: this.data.circleCards.map(card => ({ ...card, selectionIndex: 0 }))
    });
  },

  // 完全重置（清空输入和结果）
  onReset() {
    this.setData({
      emotionText: '',
      selectedCardIds: [],
      drawnCards: [],
      aiReading: '',
      circleCards: this.data.circleCards.map(card => ({ ...card, selectionIndex: 0 }))
    });
  },

  // 用户在所有牌中手动选择 / 取消选择
  onCardTap(e) {
    const id = Number(e.currentTarget.dataset.id);
    const { selectedCardIds } = this.data;
    const exists = selectedCardIds.indexOf(id);

    // 已经选中过则取消
    if (exists !== -1) {
      const updated = selectedCardIds.filter(itemId => itemId !== id);
      this.setData({ selectedCardIds: updated });
      return;
    }

    // 限制最多 3 张
    if (selectedCardIds.length >= 3) {
      wx.showToast({
        title: '最多选择 3 张牌',
        icon: 'none'
      });
      return;
    }

    const updated = selectedCardIds.concat(id);

    // 重新计算每张牌的选中序号，避免在 WXML 中计算出现 NaN
    const circleCards = this.data.circleCards.map(card => {
      const idx = updated.indexOf(card.id);
      return {
        ...card,
        selectionIndex: idx === -1 ? 0 : idx + 1
      };
    });

    this.setData({
      selectedCardIds: updated,
      circleCards
    });
  },

  // 确认选择三张牌后，生成本地解读占位并预留 AI 接口
  onConfirmSelection() {
    const { selectedCardIds } = this.data;
    if (selectedCardIds.length !== 3) {
      wx.showToast({
        title: '请先选择 3 张牌',
        icon: 'none'
      });
      return;
    }

    const selected = selectedCardIds.map((cardId, idx) => {
      const card = tarotCards.find(c => c.id === cardId);
      return {
        ...card,
        order: idx + 1,
        reversed: Math.random() < 0.5
      };
    });

    this.setData({
      drawnCards: selected
    });

    // 这里先生成一个本地文案占位，后面可以改成调用你自己的 AI 接口
    const names = selected.map(c => `${c.name}${c.reversed ? '(逆位)' : '(正位)'}`).join('、');
    const reading = `本次解读选中的三张牌为：${names}。\n\n` +
      '当前为占位文案，用于确认选择流程和展示结构是否符合预期。后续可以在这里对接与你网页版相同的 AI 解读接口，将返回的长文本展示出来。';

    this.setData({
      aiReading: reading
    });
  }
});


