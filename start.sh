#!/bin/bash

echo "🔮 AI塔罗占卜应用启动脚本"
echo "================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到Node.js，请先安装Node.js 16.0或更高版本"
    echo "   下载地址：https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未检测到npm，请确保Node.js安装完整"
    exit 1
fi

echo "✅ Node.js版本：$(node --version)"
echo "✅ npm版本：$(npm --version)"

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败，请检查网络连接"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已安装"
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚠️  未检测到.env文件，正在创建..."
    cp env.example .env
    echo "📝 请编辑.env文件，填入您的OpenAI API Key"
    echo "   文件位置：$(pwd)/.env"
    echo ""
    echo "🔑 获取OpenAI API Key："
    echo "   1. 访问 https://platform.openai.com/api-keys"
    echo "   2. 登录您的OpenAI账户"
    echo "   3. 创建新的API Key"
    echo "   4. 将API Key复制到.env文件中"
    echo ""
    read -p "按回车键继续启动应用（请确保已配置API Key）..."
fi

echo "🚀 启动开发服务器..."
echo "   应用将在 http://localhost:3000 打开"
echo "   按 Ctrl+C 停止服务器"
echo ""

npm start
