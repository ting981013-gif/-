# AI塔罗占卜应用

一个基于React和Tailwind CSS构建的现代化AI塔罗占卜网页应用，具有玻璃拟态设计风格和流畅的动画效果。

## ✨ 功能特色

- 🎴 **五个主题选择**：感情、学业、工作、财运、健康
- 🔮 **随机抽牌**：每次随机抽取三张塔罗牌
- 🎭 **卡片翻转动画**：精美的3D翻转效果
- 🤖 **AI智能解读**：支持 DeepSeek、OpenAI 等多种大模型
- 🎨 **玻璃拟态设计**：现代化的UI设计风格
- 📱 **响应式布局**：完美适配各种设备

## 🚀 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn
- （可选）DeepSeek / OpenAI API Key（不配置则使用演示模式）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd ai-tarot-app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置 AI 模型（可选）**
   
   **方式一：使用 DeepSeek（推荐，性价比高）**
   ```bash
   cp env.example .env
   ```
   编辑 `.env` 文件：
   ```env
   REACT_APP_AI_API_KEY=sk-你的DeepSeek密钥
   REACT_APP_AI_API_BASE=https://api.deepseek.com/v1
   REACT_APP_AI_MODEL=deepseek-chat
   ```
   
   **方式二：使用 OpenAI**
   ```env
   REACT_APP_OPENAI_API_KEY=sk-你的OpenAI密钥
   ```
   
   **方式三：不配置（演示模式）**
   
   跳过此步骤，系统会自动使用内置的演示服务（DemoService）

4. **启动开发服务器**
   ```bash
   npm start
   ```

   应用将在 http://localhost:3000 打开

## 🎯 使用说明

1. **选择主题**：点击您想了解的主题按钮（感情、学业、工作、财运、健康）
2. **抽取塔罗牌**：系统会自动为您随机抽取三张塔罗牌
3. **翻开卡片**：依次点击卡片查看牌面
4. **获得解读**：当所有卡片都翻开后，AI将为您生成详细的解读分析

## 🛠️ 技术栈

- **前端框架**：React 18
- **样式框架**：Tailwind CSS
- **图标库**：Lucide React
- **AI服务**：OpenAI GPT-3.5-turbo
- **动画效果**：CSS3 + Tailwind动画

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── TarotCard.js    # 塔罗牌组件
│   ├── ThemeButton.js  # 主题按钮组件
│   └── ReadingResult.js # 解读结果组件
├── data/               # 数据文件
│   └── tarotCards.js   # 塔罗牌数据
├── services/           # 服务层
│   └── openaiService.js # OpenAI API服务
├── App.js             # 主应用组件
├── index.js           # 应用入口
└── index.css          # 全局样式
```

## 🎨 设计特色

- **玻璃拟态效果**：使用backdrop-filter和半透明背景
- **渐变色彩**：丰富的渐变色彩搭配
- **流畅动画**：卡片翻转、淡入淡出等动画效果
- **响应式设计**：适配桌面端和移动端

## 🔧 自定义配置

### 修改塔罗牌数据

编辑 `src/data/tarotCards.js` 文件，您可以：
- 添加更多塔罗牌
- 修改牌面图片
- 调整牌面含义

### 自定义主题

在 `src/data/tarotCards.js` 的 `themes` 数组中添加或修改主题。

### 调整AI解读

编辑 `src/services/openaiService.js` 中的prompt模板来自定义AI解读的格式和内容。

## 📝 注意事项

- 请确保您有有效的OpenAI API Key
- API调用会产生费用，请合理使用
- 塔罗牌解读仅供参考，请以积极的心态面对生活

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License
