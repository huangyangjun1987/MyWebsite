## 1. 准备工作

- [x] 1.1 准备个人照片文件，放入 `src/assets/` 目录（若暂无照片，先用占位图）

## 2. 创建 AboutSection 组件

- [x] 2.1 创建 `src/components/AboutSection.tsx`，搭建组件骨架（Section 容器 + id="about" 锚点）
- [x] 2.2 实现桌面端左右分栏布局（左侧照片、右侧简介，CSS Grid grid-cols-1 md:grid-cols-2）
- [x] 2.3 实现移动端响应式布局（上下堆叠，照片在上居中）
- [x] 2.4 实现品牌标签 pill 样式（"赋范空间"，圆角 + 渐变边框）
- [x] 2.5 实现照片懒加载（loading="lazy"）+ 骨架屏占位 + 加载失败 fallback
- [x] 2.6 添加亮/暗模式样式适配（文字颜色、标签颜色、背景）

## 3. 集成到页面

- [x] 3.1 在 `src/App.tsx` 中引入 AboutSection，放置在 HeroSection 和 ProjectSection 之间

## 4. 验证

- [x] 4.1 验证桌面端（>768px）和移动端（≤768px）渲染效果
- [x] 4.2 验证亮色/暗色模式切换下文字和标签的可读性
- [x] 4.3 验证照片懒加载和加载失败 fallback 行为
