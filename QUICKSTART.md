# 🚀 快速开始指南

## 立即体验（演示模式）

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动应用**
   ```bash
   npm start
   ```

3. **打开浏览器**
   访问 http://localhost:3000

现在您就可以体验完整的塔罗占卜功能了！演示模式包含预设的解读内容。

## 启用AI解读功能

要使用真正的AI解读，请按以下步骤配置：

1. **获取OpenAI API Key**
   - 访问 https://platform.openai.com/api-keys
   - 登录您的OpenAI账户
   - 创建新的API Key

2. **配置环境变量**
   ```bash
   cp env.example .env
   ```
   
   编辑 `.env` 文件，填入您的API Key：
   ```
   REACT_APP_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **重启应用**
   ```bash
   npm start
   ```

现在您就可以享受真正的AI塔罗解读了！

## 功能特色

✨ **五个主题**：感情、学业、工作、财运、健康  
🎴 **随机抽牌**：每次抽取三张不同的塔罗牌  
🎭 **3D翻转动画**：精美的卡片翻转效果  
🤖 **AI智能解读**：基于GPT-3.5的个性化分析  
🎨 **玻璃拟态设计**：现代化的UI风格  
📱 **响应式布局**：完美适配各种设备  

## 使用说明

1. 选择您想了解的主题
2. 系统自动抽取三张塔罗牌
3. 依次点击卡片查看牌面
4. 获得详细的AI解读分析

享受您的塔罗占卜之旅！🔮
