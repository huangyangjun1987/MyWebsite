## Context

StudyPal 当前为纯前端应用（React 19 + Vite 7），无后端、无用户认证。项目处于"个人品牌站 → 全栈 AI 学习平台"的转型阶段，Dashboard 已建立但所有数据为静态 mock。本次变更为平台引入首个后端服务和用户认证基础设施。

**当前技术状态**：
- 前端：HashRouter 路由（`/` 品牌站，`/dashboard/*` Dashboard）
- 状态管理：仅 ThemeProvider Context（亮/暗主题）
- 组件约 16 个，均为函数式组件 + TypeScript + Tailwind CSS v4

## Goals / Non-Goals

**Goals:**
- 建立 FastAPI 后端项目，SQLite 数据库，Alembic 管理迁移
- 实现用户名/密码注册与登录，JWT access + refresh token 认证
- 前端 AuthContext 统一管理登录态，ProtectedRoute 守卫 Dashboard 路由
- 用户资料页（Profile），展示头像、用户名、连续学习天数、用户等级
- 后端独立部署，不影响前端 GitHub Pages 构建与部署

**Non-Goals:**
- 后台管理系统
- OAuth 第三方登录
- 邮箱验证、密码重置
- 角色权限（admin/user 分离）
- 账户删除
- Rate limiting、暴力破解防护
- 头像文件上传（MVP 使用 Gravatar 或预置默认头像）

## Decisions

### 1. 后端：FastAPI + SQLite 3

**权衡**：Django + DRF 提供更完整的认证系统，但过于庞大；Express.js 轻量但生态不如 Python 在数据/AI 领域的便利性。FastAPI 结合了异步支持、自动 OpenAPI 文档、类型安全，适合 StudyPal 渐进式扩展，且与项目未来 AI 方向一致。

### 2. JWT 双 Token 机制

access token 有效期 15 分钟，refresh token 有效期 7 天。refresh token 存储在数据库（`refresh_tokens` 表），支持服务端吊销。

**替代方案**：httpOnly cookie 更安全（防 XSS），但增加 CSRF 防护复杂度，且移动端/CLI 客户端兼容性差。当前平台为 SPA 单域部署，选择 localStorage 存储 + Authorization header 传输。

### 3. 密码加密：bcrypt via passlib

Python 生态标准方案，passlib 封装 bcrypt 算法，cost factor = 12。

### 4. 前端 AuthContext 模式

仿照 ThemeProvider 的 Context + Provider 模式，AuthProvider 包裹 ThemeProvider，全局提供 `useAuth()` hook：
- `user`：当前用户信息（User | null）
- `login(username, password)`：发送登录请求，存储 token
- `register(username, password)`：发送注册请求
- `logout()`：清除 token，跳转至 `/login`
- `refreshToken()`：使用 refresh token 获取新 access token
- `isAuthenticated`：派生 boolean

**Token 存储**：access token 存 localStorage `access_token`，refresh token 存 localStorage `refresh_token`。每次页面加载时 AuthProvider 检查 localStorage 并调用 `/api/auth/me` 验证 token 有效性。

### 5. 受保护路由：ProtectedRoute 组件

包装 `<ProtectedRoute><DashboardLayout /></ProtectedRoute>`，检查 `isAuthenticated`：
- 已登录 → 渲染 children
- 未登录 → `<Navigate to="/login" replace />`
- 加载中 → 显示 loading spinner

### 6. 用户等级与连续学习天数

等级规则：
- Lv.1 (新手)：注册后默认，学习天数 0-6 天
- Lv.2 (学徒)：连续学习 7-29 天
- Lv.3 (进阶者)：连续学习 30-89 天
- Lv.4 (专家)：连续学习 90+ 天

连续学习天数由后端每日签到逻辑计算（`PATCH /api/auth/checkin`），前端仅读取展示。等级在 `/api/auth/me` 响应中作为派生字段返回。

### 7. 后端项目结构

```
backend/
├── alembic/              # Alembic 迁移配置
├── alembic.ini
├── main.py               # FastAPI 入口
├── config.py             # 配置管理
├── database.py           # SQLAlchemy engine + session
├── models/
│   └── user.py           # User ORM 模型
├── schemas/
│   └── auth.py           # Pydantic request/response schemas
├── routers/
│   └── auth.py           # /api/auth/* 路由
├── services/
│   └── auth.py           # 业务逻辑（hash、JWT、签到）
└── requirements.txt
```

## API Endpoints

### POST /api/auth/register

注册新用户。

**Request**:
```json
{
  "username": "string (3-32 chars, alphanumeric)",
  "password": "string (6-128 chars)"
}
```

**Response 201**:
```json
{
  "id": 1,
  "username": "zhangsan",
  "avatar_url": null,
  "bio": null,
  "level": 1,
  "consecutive_days": 0,
  "created_at": "2026-05-16T10:00:00Z"
}
```

**Error**: 409 username exists | 422 validation error

---

### POST /api/auth/login

用户登录。

**Request**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response 200**:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "refresh_token": "dGhp...",
  "user": {
    "id": 1,
    "username": "zhangsan",
    "avatar_url": null,
    "bio": null,
    "level": 1,
    "consecutive_days": 0
  }
}
```

**Error**: 401 invalid credentials

---

### POST /api/auth/refresh

使用 refresh token 获取新 access token。

**Request**:
```json
{
  "refresh_token": "dGhp..."
}
```

**Response 200**:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

**Error**: 401 invalid or expired refresh token

---

### GET /api/auth/me

获取当前登录用户信息。

**Headers**: `Authorization: Bearer <access_token>`

**Response 200**:
```json
{
  "id": 1,
  "username": "zhangsan",
  "avatar_url": null,
  "bio": null,
  "level": 1,
  "consecutive_days": 0,
  "created_at": "2026-05-16T10:00:00Z"
}
```

**Error**: 401 invalid/expired token

---

### PATCH /api/auth/me

更新当前用户资料。

**Headers**: `Authorization: Bearer <access_token>`

**Request** (all fields optional):
```json
{
  "bio": "string (max 200 chars)",
  "avatar_url": "string (URL)"
}
```

**Response 200**: 同 GET /api/auth/me

**Error**: 401 | 422 validation error

---

### PATCH /api/auth/checkin

每日签到，更新连续学习天数。

**Headers**: `Authorization: Bearer <access_token>`

**Response 200**:
```json
{
  "consecutive_days": 5,
  "level": 1,
  "checked_in_today": true
}
```

**Error**: 401 | 409 already checked in today

## Component Hierarchy

```
App
└── ThemeProvider
    └── AuthProvider (new)
        └── HashRouter
            ├── / → BrandPage
            │       ├── Navbar (modified: 登录/进入Dashboard 按钮)
            │       ├── HeroSection
            │       ├── AboutSection
            │       └── ProjectSection
            │
            ├── /login → LoginPage (new)
            ├── /register → RegisterPage (new)
            │
            └── /dashboard → ProtectedRoute (new)
                └── DashboardLayout
                    ├── Sidebar (modified: 底部用户信息 + 退出登录)
                    │   ├── Logo
                    │   ├── NavItems (existing + profile)
                    │   ├── ThemeToggle
                    │   └── UserFooter (new: avatar + username + logout)
                    │
                    └── <Outlet>
                        ├── index → DashboardHome
                        ├── profile → ProfilePage (new)
                        │               ├── AvatarDisplay
                        │               ├── LevelBadge
                        │               ├── ConsecutiveDays
                        │               └── BioEditor
                        ├── courses → PlaceholderPage
                        ├── notes → PlaceholderPage
                        ├── ai → PlaceholderPage
                        └── settings → PlaceholderPage
```

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| JWT 无法即时吊销（access token 签发后 15 分钟内有效） | access token 有效期短（15 min），refresh token 存储在数据库可吊销 |
| localStorage 存储 token 存在 XSS 风险 | CSP header 配置 + React 默认 XSS 防护；未来可迁移至 httpOnly cookie |
| SQLite 并发写入瓶颈（生产环境多用户） | 当前 MVP 阶段用户量小，SQLite 足够；未来迁移至 PostgreSQL 仅需换 dialect |
| 前端部署在 GitHub Pages，后端部署在 Railway/Render，跨域问题 | 后端配置 CORS middleware，只允许 GitHub Pages 域名 |
| Alembic 迁移与 SQLite 兼容性问题（如 ALTER TABLE 限制） | 使用 batch mode 迁移，避免复杂 DDL |

## Open Questions

1. **头像实现方案**：MVP 使用默认占位头像还是接入 Gravatar？建议默认 SVG 占位 + URL 字段手动填写
2. **后端部署平台**：Railway vs Render vs 自建 VPS？建议 Railway（免费额度 + GitHub 集成）
3. **签到逻辑**：是否需要每日首次访问 Dashboard 自动签到？建议手动签到 + 后端去重
