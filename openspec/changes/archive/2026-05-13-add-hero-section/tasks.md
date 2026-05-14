## 1. 主题基础设施（Theme Infrastructure）

- [x] 1.1 创建 ThemeProvider 组件：React Context 暴露 `theme` 和 `toggleTheme`，初始化逻辑（localStorage → prefers-color-scheme → "light"），在 mount 前同步 `<html class="dark">` 避免闪烁
- [x] 1.2 创建 ThemeToggle 组件：太阳/月亮图标按钮，调用 ThemeContext 的 toggleTheme，44×44px 最小触控区域
- [x] 1.3 更新 App.tsx：移除占位内容，用 ThemeProvider 包裹应用，验证 theme context 可用

## 2. 粒子背景系统（Particle Background）

- [x] 2.1 创建 useParticleCanvas hook：封装粒子数组生成、requestAnimationFrame 动画循环、位置更新、连线逻辑、cleanup（取消 rAF + 移除 listener）
- [x] 2.2 创建 ParticleCanvas 组件：Canvas 元素 absolute 定位、devicePixelRatio 缩放（上限 2x）、resize debounce 200ms、prefers-reduced-motion 检测
- [x] 2.3 实现粒子色板切换：根据 `<html class="dark">` 选择亮/暗色板，桌面 120 粒子含连线，移动端 50 粒子无连线

## 3. Hero Section 组装（Hero Assembly）

- [x] 3.1 创建 HeroSection 组件：全屏高度（100vh）、flex 居中布局、接收 props（name, profession, intro, ctaText），使用 Tailwind 实现静态渐变背景，dark: 前缀适配暗色渐变
- [x] 3.2 将 ParticleCanvas 集成到 HeroSection 作为背景层（z-0），文字和 CTA 在上层（z-10），Canvas aria-hidden
- [x] 3.3 将 ThemeToggle 放置在 HeroSection 右上角（absolute top-4 right-4, z-20）

## 4. 集成与验证（Integration & Verification）

- [x] 4.1 在 App.tsx 中集成 HeroSection，在页面底部添加 `<section id="projects">` 占位元素，验证 CTA 锚点平滑滚动
- [x] 4.2 端到端验证：亮/暗切换、localStorage 持久化、移动端适配、prefers-reduced-motion 回退、resize 响应、组件卸载无泄漏
