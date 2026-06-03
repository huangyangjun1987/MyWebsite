## 1. 基础设施搭建

- [x] 1.1 安装 react-router 依赖：`npm install react-router`
- [x] 1.2 创建 `src/pages/` 目录，新建 `BrandPage.tsx`（将 App.tsx 中现有品牌站内容提取到此组件）
- [x] 1.3 创建 `src/data/dashboard.ts`，定义并导出所有 mock 数据类型和常量（mockStats、mockDailyGoals、mockSuggestions、mockWeeklyTrend、mockMonthlyTrend）

**验证**: `npm run build` 成功，BrandPage 组件可导入 ✅

## 2. 路由重构

- [x] 2.1 重构 App.tsx：引入 HashRouter + Routes，`/` 渲染 BrandPage，`/dashboard` 渲染占位 div
- [x] 2.2 验证品牌站所有功能正常：Navbar 锚点导航、滚轮切换、暗色模式切换
- [x] 2.3 提取 ParticleCanvas 为独立可配置组件（解除与 HeroSection 的容器耦合，通过 props 传入颜色等配置）
- [x] 2.4 更新 HeroSection：移除内嵌的 ParticleCanvas JSX，改为通过 `children` prop 接收（向后兼容，无 children 时也能正常渲染）

**验证**: 访问 `/#/` 品牌站正常，粒子动画正常，访问 `/#/dashboard` 看到占位 div ✅

## 3. Dashboard 布局

- [x] 3.1 创建 `src/components/Sidebar.tsx`：固定左侧栏，包含 logo、导航项列表、折叠按钮、底部 ThemeToggle
- [x] 3.2 创建 `src/pages/DashboardLayout.tsx`：左侧 Sidebar + 右侧 `<Outlet />` 容器，使用 CSS Grid 布局
- [x] 3.3 Sidebar 实现折叠/展开状态管理（useState + localStorage 持久化折叠偏好）
- [x] 3.4 Sidebar 实现移动端响应式：< 768px 时默认折叠为 overlay 模式，通过汉堡按钮触发
- [x] 3.5 更新 App.tsx 路由：`/dashboard` 使用 DashboardLayout，index 路由渲染 DashboardHome 占位

**验证**: `/dashboard` 显示侧边栏 + 空白内容区，折叠/展开正常，移动端汉堡菜单正常 ✅

## 4. Dashboard 首页组件

- [x] 4.1 创建 `src/components/StatCard.tsx`（单个统计卡片）和 `src/components/StatsCards.tsx`（4 卡片行），接收 mockStats 数据渲染
- [x] 4.2 创建 `src/components/DailyGoals.tsx`：任务列表 + 进度条，勾选切换使用 useState 管理本地状态
- [x] 4.3 创建 `src/components/TrendChart.tsx`：纯 SVG 图表组件，通过 `variant` prop 支持 bar（柱状图）和 line（折线图）两种模式
- [x] 4.4 创建 `src/components/AiSuggestions.tsx`：建议卡片列表，不同类型使用不同颜色标签
- [x] 4.5 创建 `src/pages/DashboardHome.tsx`：组合 StatsCards + DailyGoals + TrendChart(周) + TrendChart(月) + AiSuggestions

**验证**: Dashboard 首页渲染所有 5 个模块区域，mock 数据正确展示，亮/暗模式切换正常 ✅

## 5. 收尾与集成

- [x] 5.1 更新 Navbar：在导航链接末尾添加"学习助手"链接，使用 react-router 的 `<Link>` 组件导航至 `/#/dashboard`
- [x] 5.2 确保 Dashboard 页面内 ThemeToggle 与品牌站共享同一 ThemeProvider（两个页面间切换主题状态保持一致）
- [x] 5.3 全量构建 + 预览验证：`npm run build && npm run preview`，确认所有路由页面正常
- [x] 5.4 响应式完整测试：在 1920px / 768px / 375px 三种宽度下验证 Dashboard 布局、卡片网格、图表缩放

**验证**: `npm run build` 成功，preview 中所有路由正常，无 console error，dark mode 跨页面一致 ✅
