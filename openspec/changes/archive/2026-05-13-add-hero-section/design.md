## Context

个人品牌站当前为 Vite + React + Tailwind 脚手架，`App.tsx` 中只有一个占位的 "Hello World" 卡片。项目还没有任何业务组件、主题系统、或页面结构。Hero Section 是站点的第一个实际功能。

约束：
- 零外部依赖（Canvas API 浏览器原生）
- 首屏加载 < 2 秒，粒子不得成为性能瓶颈
- 所有内容使用 Tailwind CSS，禁止内联 style
- 组件 TypeScript + 函数式组件 + PascalCase 命名

## Goals / Non-Goals

**Goals:**
- 提供全屏高度 Hero Section，居中展示个人信息和 CTA
- Canvas 2D 粒子系统作为背景装饰，支持亮/暗色板切换
- 手动主题切换 + localStorage 持久化 + 系统偏好检测
- CTA 平滑滚动到 #projects 锚点
- 完整的边界情况处理：性能降级、无障碍、响应式、健壮性

**Non-Goals:**
- 内容入场动画、hover 微交互（除 CTA 按钮基础 Tailwind 过渡）
- 导航栏、Projects Section 的实际内容
- 鼠标与粒子交互
- 后端 API、CMS

## Decisions

### 1. Canvas 2D 粒子系统 vs CSS animation vs WebGL

**选择：Canvas 2D**

| 维度 | Canvas 2D | CSS animation | WebGL |
|------|-----------|---------------|-------|
| 粒子数量 | ~120（桌面）/ ~50（移动） | ~20-30 | ~1000+ |
| 连线效果 | ✅ | ❌ | ✅ |
| Bundle 体积 | 0（原生 API） | 0 | ~120KB |
| 移动端性能 | 良好 | ⚠️ 大量 DOM | ⚠️ 电池消耗 |

CSS 无法实现粒子连线。WebGL 对个人品牌站过度。Canvas 2D 是最佳平衡。

### 2. ThemeProvider — React Context

**选择：Context API + localStorage**

状态流：
```
localStorage("theme") → ThemeProvider state → <html class="dark">
                                              ↓
                              ParticleCanvas 读取 → 色板切换
                              Tailwind dark: 类自动响应
```

- 初始化：`localStorage > prefers-color-scheme > "light"`
- 持久化：每次 toggle 写入 `localStorage`
- 无外部依赖，不引入 Redux/Zustand

### 3. 粒子色板

| 模式 | 渐变底色 (Tailwind) | 粒子颜色 | 连线颜色 |
|------|---------------------|---------|---------|
| Light | `from-slate-50 via-blue-50 to-indigo-100` | `#6366f1` (靛蓝) | `rgba(99,102,241,0.12)` |
| Dark | `from-gray-950 via-slate-900 to-blue-950` | `#22d3ee` (青) | `rgba(34,211,238,0.10)` |

粒子透明度和大小随机化，模拟深度感。

### 4. 粒子数策略

- 桌面（>768px）：120 粒子，含连线
- 移动（≤768px）：50 粒子，不连线（省计算）
- `prefers-reduced-motion`：渲染粒子但静止（不启动画循环），或直接隐藏 Canvas 回退纯渐变
- 极宽屏（>2000px）：粒子数上限 150

### 5. ThemeToggle 位置

放置在 Hero 右上角，固定定位 (`absolute top-4 right-4`)，z-index: 20。
后续创建导航栏时，Toggle 从此迁移至 Nav。

### 6. 组件接口设计

```
HeroSection
  ├── props: name, profession, intro, ctaText, projectsHref
  └── 内部消费 ThemeContext（决定渐变底色）

ParticleCanvas
  ├── props: particleCount?, reducedMotion?
  └── 内部读取 <html class="dark"> 切换色板

ThemeProvider
  ├── children: ReactNode
  └── context 暴露 { theme, toggleTheme }
```

数据独立 — ParticleCanvas 不依赖 HeroSection，可被任何组件复用。

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Canvas 初始化失败（极旧浏览器/安全策略） | try/catch 包裹，失败时仅显示 CSS 渐变，无白屏 |
| Retina 屏 Canvas 模糊 | 按 `devicePixelRatio` 缩放画布，上限 2x |
| resize 触发频繁重建 | debounce 200ms |
| 组件卸载时 rAF 泄漏 | useEffect cleanup 中 `cancelAnimationFrame` + 移除 listener |
| 暗色模式下粒子可见度 | 色板已做对比度验证：暗底用亮青，亮底用深靛蓝 |
| CTA 点击时 Projects Section 不存在 | `scrollIntoView` 的目标元素若不存在，静默无操作（不报错） |
| 主题闪烁 (FOIT — flash of incorrect theme) | ThemeProvider 初始化时先读 localStorage，在 mount 前同步设置 `<html class>` |
