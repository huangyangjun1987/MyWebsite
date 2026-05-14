## Why

个人品牌站当前只有默认脚手架页面，缺少核心视觉入口。Hero Section 是访客到达后的第一印象，需要在 3 秒内传达"我是谁、我做什么"，同时通过科技粒子视觉建立品牌调性。

## What Changes

- 新增全屏高度 Hero Section，居中展示姓名、职业、一句话介绍
- 新增 CTA 按钮，点击后平滑滚动到项目展示区（#projects 锚点）
- 新增 Canvas 2D 粒子背景层，叠加在静态 CSS 渐变之上，粒子随机浮动
- 新增亮/暗模式手动切换功能，状态持久化到 localStorage，首次访问跟随系统偏好
- 主题切换按钮临时放置在 Hero 右上角（后续迁移至导航栏）

## Out of Scope（严禁实现）

- Hero 的内容入场动画（文字淡入、上滑等）
- CTA 按钮 hover 以外的微交互动效
- 导航栏及其任何组件
- Projects Section（#projects 锚点目标）的具体实现——仅保留占位元素供 CTA 滚动定位
- 后端 API、数据获取、CMS 集成
- 鼠标与粒子的交互（粒子纯随机浮动，不响应鼠标）
- 页面其他区域的设计或内容

## Capabilities

### New Capabilities

- `hero-section`：全屏 Hero 区域——布局、文字内容、CTA 按钮、锚点滚动
- `particle-background`：Canvas 2D 粒子系统——粒子生成、随机浮动、色板适配、性能降级
- `theme`：亮/暗模式切换——手动 toggle、localStorage 持久化、系统偏好检测、Tailwind dark class 驱动

### Modified Capabilities

无（当前无已存在的 spec）

## Impact

- **App.tsx**：移除现有占位内容，引入 ThemeProvider + HeroSection
- **新增文件**：`HeroSection.tsx`、`ParticleCanvas.tsx`、`ThemeProvider.tsx`、`ThemeToggle.tsx`、`useParticleCanvas.ts`
- **依赖**：无新增外部依赖，Canvas API 为浏览器原生能力
- **性能**：粒子使用 requestAnimationFrame，标签页隐藏时自动暂停；移动端粒子数减半；prefers-reduced-motion 时回退为纯渐变
