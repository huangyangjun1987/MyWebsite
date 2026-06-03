## Context

当前应用已具备认证系统（JWT + bcrypt）、聊天系统（DeepSeek API）、Dashboard 布局框架和基础学习仪表盘（StatsCards、DailyGoals、TrendChart，均使用 mock 数据）。本次变更将 mock 数据替换为后端 API 聚合的真实数据，新增学习日历和成就系统，重构侧边栏导航，并完成首次部署上线。

数据库已有 `users`（含 level、consecutive_days、last_checkin_date）、`chat_messages`、`refresh_tokens` 表。后端 FastAPI 已启动，通过 SQLAlchemy 管理模型。

## Goals / Non-Goals

**Goals:**
- 用真实 API 数据替换 Dashboard 所有 mock 数据
- 新增学习日历热力图，直观展示每日学习活动
- 实现成就系统（徽章解锁 + 前端展示）
- 侧边栏导航精简为核心 3 项（学习数据、AI 对话建议、学习目标）
- 完成前后端部署配置

**Non-Goals:**
- 实时通知（WebSocket）
- 数据导出（CSV/PDF）
- 课程管理、学习笔记功能的实际实现
- 用户间社交功能

## Decisions

### 1. 数据模型：新增 `learning_activities` 表

**决定**: 创建 `learning_activities` 表记录用户每日学习行为（学习时长、完成任务数、聊天互动次数），作为分析 API 的数据基础。

**替代方案**: 从 `chat_messages` 表间接推算学习活动 → 拒绝：聊天仅是学习行为的一小部分，无法覆盖日历、目标完成等场景。

**表结构**:
```
learning_activities
├── id (Integer, PK)
├── user_id (Integer, FK → users.id)
├── date (Date, NOT NULL)                    — 活动日期
├── study_duration_minutes (Integer, 0)      — 当日学习时长（分钟）
├── goals_completed (Integer, 0)             — 当日完成目标数
├── chat_interactions (Integer, 0)           — 当日 AI 对话次数
├── created_at (DateTime)
└── UNIQUE(user_id, date)                    — 每人每天一条记录
```

### 2. 成就系统数据模型

**决定**: 两级表结构 — `achievements`（成就定义）+ `user_achievements`（用户解锁记录）。

**表结构**:
```
achievements
├── id (Integer, PK)
├── key (String, UNIQUE)          — 成就标识 (first_checkin, streak_7, etc.)
├── name (String)                 — 显示名称
├── description (String)          — 解锁条件描述
├── icon (String)                 — 图标标识 (trophy, star, fire, etc.)
├── category (String)             — 分类 (checkin, duration, goals, chat)
└── threshold (Integer, NULL)     — 解锁阈值

user_achievements
├── id (Integer, PK)
├── user_id (Integer, FK)
├── achievement_id (Integer, FK)
├── unlocked_at (DateTime)
└── UNIQUE(user_id, achievement_id)
```

### 3. 侧边栏导航重构

**决定**: 将 6 项导航精简为 3 项核心导航，个人资料和设置移至底部用户头像下拉菜单（点击展开）。

理由：当前「课程管理」「学习笔记」等仅为 Placeholder 页面，无实际功能，保留在主导航中会稀释用户体验；学习数据分析是核心价值主张，应优先呈现。

### 4. 数据获取策略：组件级 fetch + SWR

**决定**: 各数据展示组件（StatsCards、DailyGoals、TrendChart、LearningCalendar）在 mount 时通过 `useEffect` + `fetch` 获取数据，使用自定义 hook `useAnalytics` 封装通用逻辑（loading/error/data 状态管理）。

**替代方案**: Context 集中管理 → 拒绝：Dashboard 页面数据无跨组件共享需求，集中管理增加不必要的复杂度。

### 5. API 端点设计

采用 RESTful 风格，所有端点需要 Bearer Token 认证（复用现有 `get_current_user` 依赖）。

**新 API 端点**:

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/analytics/overview` | 概览统计（今日学习时长、完成目标数、连续打卡天数、课程进度） |
| GET | `/api/analytics/trends?type=weekly` | 趋势数据（weekly=7天柱状图, monthly=30天折线图） |
| GET | `/api/analytics/calendar?year=&month=` | 日历热力图数据（指定月份的每日学习时长） |
| GET | `/api/analytics/goals` | 当日目标列表（含完成状态） |
| PATCH | `/api/analytics/goals/{goal_id}/toggle` | 切换目标完成状态 |
| GET | `/api/analytics/achievements` | 用户成就列表（所有成就 + 解锁状态） |

**API 错误码**: 401（未认证）、422（参数校验失败）、500（服务器错误）

### 6. 部署方案

**决定**: 前端通过 Vite 构建为静态文件，部署至 GitHub Pages（`gh-pages -d dist`）。后端 FastAPI 部署至 Render/Railway（免费 tier），前端通过环境变量 `VITE_API_BASE_URL` 指向后端地址。

## Component Hierarchy

```
App
├── BrandPage (/#/)
│   ├── Navbar
│   ├── HeroSection (ParticleCanvas)
│   ├── AboutSection
│   └── ProjectSection (ProjectCard[])
│
├── DashboardLayout (/dashboard)
│   ├── Sidebar
│   │   ├── NavItems (3项: 学习数据 / AI 对话建议 / 学习目标)
│   │   └── UserMenu (头像下拉: 个人资料 / 设置 / 退出)
│   │
│   └── Outlet
│       ├── AnalyticsDashboard (/dashboard)
│       │   ├── StatsCards (StatCard[4])
│       │   ├── LearningCalendar (NEW)
│       │   ├── TrendChart[2] (周/月)
│       │   ├── DailyGoals
│       │   └── AchievementPanel (NEW — AchievementBadge[])
│       │
│       ├── ChatPage (/dashboard/ai-chat)
│       │   ├── ChatMessage[]
│       │   └── ChatInput
│       │
│       └── LearningGoalsPage (/dashboard/goals)
│           ├── DailyGoals
│           └── ProgressIndicator
│
├── LoginPage (/login)
├── RegisterPage (/register)
└── ProfilePage (/dashboard/profile)
```

## Risks / Trade-offs

- **SQLite 并发限制**: SQLite 仅支持单写者 → 当前用户量小，风险低；后续可迁移至 PostgreSQL
- **学习活动数据写入**: 需要在前端各交互点（聊天发送、目标勾选、签到）触发 API 写入 → 若前端漏写则数据不完整，需后端提供兜底聚合
- **GitHub Pages 仅支持静态文件**: 后端需独立部署 → 引入 CORS 配置和跨域开销
- **成就检测时机**: 成就解锁在用户行为触发时同步检测 → 检测逻辑集中在后端 services 层，避免前端/后端双重检测不一致

## Open Questions

- 后端部署平台选择 Render 还是 Railway？（按部署时 free tier 可用性决定）
- 成就徽章的图标资源用纯 SVG 内联还是图标库（Heroicons）？→ 推荐 Heroicons，与现有代码风格一致
