## 1. 后端数据模型与分析 API

- [x] 1.1 创建 `learning_activities` 表模型（backend/models/learning.py），字段：id、user_id（FK）、date、study_duration_minutes、goals_completed、chat_interactions、created_at，添加唯一约束 (user_id, date)
- [x] 1.2 创建成就相关表模型：`achievements`（id、key、name、description、icon、category、threshold）和 `user_achievements`（id、user_id FK、achievement_id FK、unlocked_at），添加唯一约束 (user_id, achievement_id)
- [x] 1.3 在 models/__init__.py 中导出新模型，确保数据库自动建表
- [x] 1.4 创建 Pydantic 响应 schema（backend/schemas/analytics.py）：OverviewResponse、TrendResponse、CalendarResponse、GoalsResponse、AchievementsResponse
- [x] 1.5 创建 analytics 聚合服务（backend/services/analytics.py）：实现 get_overview()、get_trends()、get_calendar()、get_goals()、toggle_goal()、get_achievements() 及成就自动检测逻辑 check_and_unlock_achievements()
- [x] 1.6 创建 analytics 路由（backend/routers/analytics.py）：注册 GET /api/analytics/overview、GET /api/analytics/trends、GET /api/analytics/calendar、GET /api/analytics/goals、PATCH /api/analytics/goals/{goal_id}/toggle、GET /api/analytics/achievements
- [x] 1.7 在 main.py 中注册 analytics router，验证所有端点可访问
- [x] 1.8 预置初始成就定义数据（5 个成就：first_checkin、streak_7、study_10h、goals_20、chat_50），编写 seed 脚本或通过 startup 事件写入

**验证**: 启动后端，使用 curl 或浏览器访问 `/api/analytics/overview`（带有效 token），确认返回 200 及正确 JSON 结构。访问无 token 请求确认返回 401。

## 2. 前端数据获取 Hook 与现有组件 API 迁移

- [x] 2.1 创建 `useAnalytics` hook（src/hooks/useAnalytics.ts）：封装 fetch 逻辑，管理 loading/error/data 状态，支持自动附加 Bearer token（从 AuthContext 获取），支持 refetch
- [x] 2.2 修改 `StatsCards` 组件：使用 `useAnalytics` 从 `/api/analytics/overview` 获取数据，替换 props 直传 mock 数据，添加 loading 骨架屏和 error 重试按钮
- [x] 2.3 修改 `DailyGoals` 组件：使用 `useAnalytics` 从 `/api/analytics/goals` 获取数据，勾选时调用 `PATCH /api/analytics/goals/{id}/toggle`，替换 mock 数据驱动
- [x] 2.4 修改 `TrendChart` 组件：使用 `useAnalytics` 从 `/api/analytics/trends?type=weekly|monthly` 获取数据，替换 mock 数据，添加 loading/error 状态

**验证**: 确保后端运行，登录后进入 Dashboard，确认统计卡片、目标清单、趋势图均从 API 获取真实数据（或显示空状态），切换网络断开测试 error 状态。

## 3. 学习日历组件

- [x] 3.1 创建 `LearningCalendar` 组件（src/components/LearningCalendar.tsx）：渲染月度日历热力图网格（7 行 × N 列），每格根据学习时长显示不同深度颜色（0/1-30/31-120/120+ min 四档色阶），右侧显示色阶图例
- [x] 3.2 实现月份切换：显示当前月份标题（如「2026 年 6 月」），点击左右箭头切换月份并触发 API 重新请求，不能选择未来月份
- [x] 3.3 添加暗色模式适配：空白格和色阶在暗色模式下保持可辨识对比度
- [x] 3.4 实现日历单元格 hover 提示：鼠标悬停显示具体日期和学习时长
- [x] 3.5 添加 loading 骨架屏和 error 重试状态

**验证**: 进入学习数据页，日历组件渲染当月网格，切换月份查看数据变化，切换暗色模式确认色阶可辨识，网络断开确认错误提示和重试按钮。

## 4. 成就系统组件

- [x] 4.1 创建 `AchievementBadge` 组件（src/components/AchievementBadge.tsx）：单个成就徽章，已解锁显示彩色图标 + 名称 + 解锁日期，未解锁显示灰色图标 + 名称 + 解锁条件，使用 Heroicons 图标库
- [x] 4.2 创建 `AchievementPanel` 组件（src/components/AchievementPanel.tsx）：按分类（签到/时长/目标/对话）分组展示所有成就，使用 `useAnalytics` 从 `/api/analytics/achievements` 获取数据
- [x] 4.3 添加成就面板的展开/折叠交互和暗色模式适配

**验证**: 登录后在新用户状态确认所有成就显示灰色，通过签到/聊天触发成就解锁后，刷新页面确认对应成就变为彩色已解锁状态。

## 5. 侧边栏导航重构

- [x] 5.1 重构 `Sidebar.tsx` 导航项：将 NAV_ITEMS 从 6 项改为 3 项（学习数据 → `/dashboard`、AI 对话建议 → `/dashboard/ai-chat`、学习目标 → `/dashboard/goals`），更新对应 SVG 图标
- [x] 5.2 实现用户头像下拉菜单：点击侧边栏底部用户头像区域展开菜单（个人资料 → `/dashboard/profile`、设置 → `/dashboard/settings`、退出登录），点击外部自动关闭，使用 Tailwind transition 动画
- [x] 5.3 更新路由配置（App.tsx）：新增 `/dashboard/goals` 路由指向 `LearningGoalsPage`，确认移除的导航项路由（courses、notes）仍然可用但不出现在导航中（或直接在路由中移除占位符页面）
- [x] 5.4 创建 `AnalyticsDashboard` 页面（src/pages/AnalyticsDashboard.tsx）：替代原 DashboardHome，整合 StatsCards、LearningCalendar、TrendChart（周+月）、DailyGoals、AchievementPanel 组件，页面标题改为「学习数据」
- [x] 5.5 更新 `/dashboard` 路由 index 元素从 `DashboardHome` 改为 `AnalyticsDashboard`

**验证**: 登录后确认侧边栏仅显示 3 个导航项，点击各导航项正确跳转，点击头像弹出下拉菜单，选择个人资料/设置/退出登录均正常响应。折叠/展开侧边栏、移动端汉堡菜单均正常。

## 6. 学习目标独立页面

- [x] 6.1 创建 `LearningGoalsPage`（src/pages/LearningGoalsPage.tsx）：独立页面展示完整目标清单（复用 DailyGoals 组件），页面标题「学习目标」，包含更详细的进度仪表（月度完成率、累计完成数）
- [x] 6.2 添加目标统计区：显示本周完成率、月度目标趋势迷你图（复用 TrendChart variant="bar"）

**验证**: 点击侧边栏「学习目标」进入对应页面，确认目标清单和统计区渲染正常，勾选/取消目标功能正常。

## 7. 部署配置与上线

- [x] 7.1 更新前端构建配置：添加 `VITE_API_BASE_URL` 环境变量（默认 `http://localhost:8000`），Vite 构建时替换为生产后端 URL
- [x] 7.2 更新 GitHub Actions 部署流水线（`.github/workflows/deploy.yml`）：确保构建步骤包含 `VITE_API_BASE_URL` 设置，dist 目录部署至 GitHub Pages
- [x] 7.3 后端 CORS 配置：更新 `backend/config.py` 和 `main.py` 的 `CORS_ORIGINS`，添加 GitHub Pages 域名到允许列表
- [x] 7.4 后端部署：配置 Render/Railway 部署（requirements.txt / Procfile），设置环境变量（DATABASE_URL、JWT_SECRET、DEEPSEEK_API_KEY、CORS_ORIGINS）
- [x] 7.5 端到端验证：部署后通过 GitHub Pages URL 访问，注册→登录→查看学习数据→AI 对话→学习目标全流程测试，确认前端能正确调用后端 API

**验证**: GitHub Pages 可正常访问前端，前端 API 调用成功返回数据，登录、注册、聊天等功能正常，暗色模式切换正常。
