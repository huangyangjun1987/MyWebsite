## Why

当前个人品牌站只有静态展示功能，无法承载"个人学习助手"的交互需求。需要将站点从单向信息展示升级为以 Dashboard 为中心的学习管理工具，为后续课程管理、笔记系统、AI 对话等功能铺路。

## What Changes

- **引入 react-router**：将单页锚点滚动架构改为客户端路由，支持 `/`（品牌站）和 `/dashboard/*`（学习助手）两套页面体系
- **新建 DashboardLayout 组件**：左侧固定导航栏 + 右侧内容区的经典 Dashboard 布局，支持折叠/展开
- **新建数据统计卡片组件**：展示今日学习时长、完成目标数、连续打卡天数、课程进度等关键指标
- **新建每日目标清单组件**：展示当日学习任务列表，支持勾选完成状态（本地状态管理）
- **新建趋势图组件**：展示周/月学习时长趋势（基于 mock 数据渲染的柱状图/折线图）
- **新建 AI 建议学习面板**：基于 mock 数据的推荐卡片（课程推荐、复习提醒等占位内容）
- **保留品牌站**：`/` 路径下保留现有 HeroSection、AboutSection、ProjectSection，作为对外名片
- **提取 ParticleCanvas**：将粒子背景从 HeroSection 中解耦为独立组件，供品牌站和 Dashboard 可选复用

## Capabilities

### New Capabilities

- `dashboard-layout`: Dashboard 整体布局 — 左侧导航栏 + 右侧内容区，支持亮/暗模式，导航项支持路由切换
- `stats-cards`: 数据统计卡片行 — 展示学习时长、完成目标数、连续打卡天数、课程进度，使用 mock 数据
- `daily-goals`: 每日目标清单 — 展示当日任务列表，支持勾选完成/取消，数据来源于本地 mock
- `ai-suggestions`: AI 建议学习面板 — 展示推荐课程、复习提醒等 mock 卡片
- `trend-chart`: 趋势图组件 — 展示周/月学习趋势，基于 mock 数据渲染

### Modified Capabilities

<!-- 无已有 spec 需要修改 -->

## Impact

| 影响项 | 说明 |
|--------|------|
| 路由架构 | 从无路由 → react-router v7，App.tsx 从布局组件变为路由入口 |
| App.tsx | 重构为 `<BrowserRouter>` + `<Routes>` 结构 |
| HeroSection | 移除内嵌的 ParticleCanvas，改为接收可选的 `children` slot |
| ParticleCanvas | 提取为独立组件，不再强依赖 HeroSection 的绝对定位容器 |
| Navbar | 保留在品牌站路由下，功能不变 |
| 新增依赖 | `react-router` + `@types/react-router` |
| 部署 | GitHub Pages 需配置 SPA fallback（404.html 重定向），确保客户端路由正常 |
| 回滚方案 | react-router 以可选方式引入，若路由有问题可回退到单页架构，Dashboard 组件本身与路由解耦 |
