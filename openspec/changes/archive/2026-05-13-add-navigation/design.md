## Context

当前站点仅有一个 HeroSection 和一个项目区占位 section。导航栏需要整合进现有结构：ThemeProvider 包裹层已经存在，HeroSection 内部直接渲染了 ThemeToggle。需要将 ThemeToggle 提取到导航栏，并确保导航栏的 scroll 检测和 backdrop-blur 与现有粒子背景无冲突。

## Goals / Non-Goals

**Goals:**
- 顶部固定导航栏，不随页面滚动移动
- 初始背景透明，滚动超过阈值后添加 backdrop-blur 效果
- 导航链接点击后平滑滚动到对应 section
- ThemeToggle 从 HeroSection 移至导航栏

**Non-Goals:**
- 汉堡菜单或响应式折叠
- scroll spy 高亮当前 section
- 导航栏动画过渡

## Decisions

### 1. 导航栏 sticky vs fixed 定位 → 选择 `fixed top-0`

导航栏使用 `position: fixed; top: 0` 固定在视口顶部。与 `sticky` 不同，`fixed` 确保导航栏始终可见且不影响其他元素的文档流布局。

### 2. 背景模糊触发 → 使用 scroll 事件 + 阈值

监听 `window` 的 scroll 事件，当 `scrollY > 50px` 时添加 `backdrop-blur` 和半透明背景，初始状态为透明。使用 passive listener 优化性能。

### 3. 平滑滚动方案 → 复用 `element.scrollIntoView({ behavior: 'smooth' })`

与现有 HeroSection CTA 按钮使用相同 API，无需额外依赖。对每个导航链接，通过 `href` 对应的 `id` 查找目标元素并触发滚动。

### 4. ThemeToggle 迁移 → 从 HeroSection 移除，在 Navbar 中渲染

原 ThemeToggle 在 HeroSection 的 `absolute top-4 right-4 z-20` 容器中渲染。迁移到 Navbar 后，ThemeToggle 成为导航栏链接列表的最后一个元素（视觉上与导航链接同行，但语义上是独立按钮）。HeroSection 中移除相关 JSX 和导入。

### 5. 导航栏 z-index → `z-50`

导航栏需要覆盖在所有内容之上，包括粒子背景（Canvas 为 absolute 定位在 HeroSection 内）。`z-50` 确保高于 HeroSection 内的 z-10/z-20 层级。

## Risks / Trade-offs

- **scroll 事件频率** → 使用 `passive: true` 避免阻塞主线程，仅在跨越阈值时更新 state
- **HeroSection 顶部被导航栏遮挡** → HeroSection 已有 `min-h-screen` 且内容居中，导航栏覆盖在顶部不影响视觉；若后续需要，可通过 `pt-16` 为导航栏预留空间
- **ThemeToggle 从 HeroSection 移除后，HeroSection 不再有暗色模式开关** → 用户始终可通过导航栏访问，不影响可用性
