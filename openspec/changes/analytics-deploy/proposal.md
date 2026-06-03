## Why

当前 Dashboard 的统计数据完全依赖前端 mock 常量，无法反映用户真实的学习行为；同时需要为全栈 AI 学习平台建立数据驱动的学习分析能力，并完成首次正式部署上线。本变更是从「纯前端演示」迈向「全栈数据驱动应用」的关键一步。

## What Changes

- 新增**学习日历**热力图组件，可视化用户每日学习活动（类似 GitHub 贡献图）
- 新增**成就系统**，基于学习行为自动解锁徽章（首次签到、连续 7 天、学习 10 小时等里程碑）
- **重构侧边栏导航**为三核心模块：学习数据（原仪表盘扩展）、AI 对话建议、学习目标（原目标清单独立页）
- 新增 **FastAPI 学习分析 API** 端点（`/api/analytics/*`），通过数据库聚合查询返回真实统计数据
- 将 StatsCards、DailyGoals、TrendChart 的数据源从 frontend mock 常量切换为后端 API 调用
- 新增学习活动记录数据库表 `learning_activities` 和成就相关表 `achievements`、`user_achievements`
- 配置 GitHub Pages 部署流水线，确保前后端统一部署

## Capabilities

### New Capabilities

- `learning-calendar`: 学习日历热力图组件，按日展示学习时长/活动密度，支持月份切换和暗色模式
- `achievement-system`: 成就徽章系统，含成就定义（名称、图标、解锁条件）、解锁检测逻辑和前端展示组件
- `analytics-api`: FastAPI 学习数据统计端点，包括概览统计（今日/本周/累计）、趋势数据、日历数据、目标进度等聚合查询

### Modified Capabilities

- `dashboard-layout`: 侧边栏导航项从 6 项（学习仪表盘、课程管理、学习笔记、AI 助手、个人资料、设置）调整为 3 项核心导航（学习数据、AI 对话建议、学习目标）；用户资料和设置移至侧边栏底部用户信息区的下拉菜单
- `stats-cards`: 数据源从前端 mock 常量 `mockStats` 改为 `GET /api/analytics/overview` API 响应
- `daily-goals`: 数据源从前端 mock 常量 `mockDailyGoals` 改为 `GET /api/analytics/goals` API 响应
- `trend-chart`: 数据源从前端 mock 常量 `mockWeeklyTrend`/`mockMonthlyTrend` 改为 `GET /api/analytics/trends` API 响应

## Impact

- **前端新增文件**: `LearningCalendar`（日历组件）、`AchievementBadge`/`AchievementPanel`（成就组件）、`LearningGoals`（独立目标页组件）、`AnalyticsDashboard`（重组后的学习数据页）
- **前端修改文件**: `Sidebar.tsx`（导航项重构）、`DashboardHome.tsx`（数据获取换为 API）、`App.tsx`（新增路由）、`StatsCards.tsx`/`DailyGoals.tsx`/`TrendChart.tsx`（从 fetch 数据替代 props 直传 mock）
- **后端新增文件**: `models/learning.py`（学习活动、成就 ORM 模型）、`schemas/analytics.py`（Pydantic 响应 schema）、`services/analytics.py`（聚合查询逻辑）、`routers/analytics.py`（API 路由）
- **后端修改文件**: `main.py`（注册 analytics router）、`models/__init__.py`（导出新模型）
- **数据库**: 新增 `learning_activities`、`achievements`、`user_achievements` 三张表（由 SQLAlchemy 自动建表）
- **部署**: `.github/workflows/deploy.yml` 新增/更新，确认 GitHub Pages + FastAPI 后端部署配置

### NOT Doing (Out of Scope)

- 实时通知（WebSocket 推送成就解锁等）
- 数据导出（CSV/PDF 导出学习报告）
- 课程管理、学习笔记功能实现（对应侧边栏项暂时移除，后续独立 change 实现）
- 用户间社交功能（排行榜、好友对比）
