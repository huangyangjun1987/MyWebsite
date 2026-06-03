## Context

当前项目为单页品牌站，无路由，所有 section 内联在 App.tsx 中。现在要新增 Dashboard 体系，同时保留品牌站作为 landing page。技术栈：React 19 + Vite 7 + TypeScript + Tailwind CSS v4。

## Goals / Non-Goals

**Goals:**
- 引入客户端路由，分离品牌站 (`/`) 和 Dashboard (`/dashboard/*`)
- 构建 Dashboard 侧边栏布局，支持导航折叠
- 实现数据统计卡片、每日目标清单、趋势图表、AI 建议面板（均用 mock 数据）
- 复用 ThemeProvider、ParticleCanvas 等已有组件
- GitHub Pages SPA fallback 正常工作

**Non-Goals:**
- 后端 API（纯前端 mock）
- AI 实际功能（mock 占位）
- 用户认证系统

## Decisions

### 决策 1：路由方案 — HashRouter

选择 **HashRouter** 而非 BrowserRouter。

| 方案 | 优点 | 缺点 |
|------|------|------|
| BrowserRouter | URL 美观 (`/dashboard`) | GitHub Pages 需 404.html fallback，配置脆弱 |
| **HashRouter** ✅ | GitHub Pages 零配置，刷新不 404 | URL 带 `#` (`/#/dashboard`) |

理由：项目部署在 GitHub Pages (`/my-website/`)，无服务端路由控制。HashRouter 是唯一无需 hack 即可稳定运行的方案。

### 决策 2：Dashboard 布局 — 左侧固定侧边栏 + 右侧滚动内容区

```
┌──────────────────────────────────────┐
│ ┌──────────┐ ┌─────────────────────┐ │
│ │          │ │                     │ │
│ │ Sidebar  │ │   Outlet (内容区)   │ │
│ │ 240px    │ │                     │ │
│ │ fixed    │ │  scroll-y           │ │
│ │          │ │                     │ │
│ └──────────┘ └─────────────────────┘ │
└──────────────────────────────────────┘
```

- 侧边栏固定宽度 240px，移动端可折叠为 overlay
- 内容区使用 `<Outlet />` 渲染子路由
- 侧边栏的 ThemeToggle 复用已有组件

### 决策 3：图表实现 — 纯 SVG

不引入第三方图表库（recharts 等），用内联 SVG + Tailwind 构建柱状图和折线图。

理由：图形需求简单（柱状 + 折线），纯 SVG 可避免 ~150KB 额外依赖，且完全受 Tailwind 暗色模式控制。

### 决策 4：状态管理 — React useState + 组件本地状态

不引入 Redux/Zustand 等状态库。Dashboard 数据来自 mock 常量文件，勾选状态用 `useState` 管理。

### 决策 5：Mock 数据组织

统一放在 `src/data/dashboard.ts`，导出以下数据结构：

- `mockStats`: 今日统计（学习时长、完成目标数、连续打卡、课程进度）
- `mockDailyGoals`: 每日目标清单
- `mockSuggestions`: AI 建议列表
- `mockWeeklyTrend` / `mockMonthlyTrend`: 趋势数据点

## Component Hierarchy

```
App (HashRouter)
├── Routes
│   ├── "/" → BrandPage
│   │   ├── Navbar
│   │   ├── HeroSection
│   │   │   └── ParticleCanvas (通过 children)
│   │   ├── AboutSection
│   │   └── ProjectSection
│   │
│   └── "/dashboard" → DashboardLayout
│       ├── Sidebar
│       │   ├── Logo (折叠时显示图标)
│       │   ├── NavItem × N
│       │   └── ThemeToggle
│       └── <Outlet>
│           └── "/" → DashboardHome
│               ├── StatsCards
│               │   └── StatCard × 4
│               ├── DailyGoals
│               │   └── GoalItem × N
│               ├── TrendChart (周趋势)
│               ├── TrendChart (月趋势)
│               └── AiSuggestions
│                   └── SuggestionCard × N
```

## Risks / Trade-offs

- **[HashRouter SEO]** 品牌站 `/#/` URL 对 SEO 不友好 → 品牌站本身是单页个人名片，SEO 依赖较少，可接受
- **[纯 SVG 图表]** 交互性弱（无 tooltip、无动画） → 当前阶段只需静态展示，后期如需高级交互可再引入 recharts
- **[单文件 mock 数据]** 数据与界面逻辑紧耦合 → 后期接入真实 API 时只需替换数据源，组件接口不变

## Migration Plan

1. 安装 `react-router`
2. 重构 App.tsx 为 HashRouter + Routes
3. 将现有品牌站内容提取为 `BrandPage` 组件
4. 创建 `DashboardLayout` + `Sidebar` + `DashboardHome`
5. 创建 Dashboard 子组件（StatsCards, DailyGoals, TrendChart, AiSuggestions）
6. 创建 `src/data/dashboard.ts` mock 数据
7. 构建验证，确保 `npm run build` 成功且 GitHub Pages 部署正常

回滚：若路由方案出问题，将 HashRouter 替换回原始单页结构即可，Dashboard 组件本身与路由解耦。
