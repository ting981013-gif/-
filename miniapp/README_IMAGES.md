# 小程序图片资源说明

## 需要复制的图片文件

小程序需要以下图片资源才能正常显示：

### 1. 牌背图片
将 `public/tarot-back.png` 复制到小程序根目录：
```bash
cp public/tarot-back.png miniapp/tarot-back.png
```

### 2. 塔罗牌图片
将 `public/tarot-cards/` 目录复制到小程序根目录：
```bash
cp -r public/tarot-cards miniapp/tarot-cards
```

## 在微信开发者工具中操作

如果使用微信开发者工具：
1. 在 `miniapp` 目录下创建 `tarot-cards` 文件夹
2. 将 `public/tarot-back.png` 复制到 `miniapp/` 目录
3. 将 `public/tarot-cards/` 中的所有 `.jpg` 文件复制到 `miniapp/tarot-cards/` 目录

## 验证

复制完成后，在微信开发者工具中：
1. 点击「编译」按钮
2. 查看选牌界面，应该能看到紫色背景的牌背
3. 如果图片加载成功，会显示牌背图案；如果加载失败，会显示紫色背景

