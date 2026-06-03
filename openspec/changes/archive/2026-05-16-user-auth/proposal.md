## Why

当前 StudyPal 没有任何用户认证系统，所有页面公开访问，Dashboard 功能（课程管理、笔记、AI 助手）缺乏用户数据隔离。在继续构建后端功能之前，先建立 JWT 认证基础设施，为后续个性化功能提供用户身份基础。

## What Changes

- **新增** FastAPI 后端项目（`backend/`），使用 SQLite 3 + Alembic 数据库迁移
- **新增** 用户注册接口 `POST /api/auth/register`，用户登录接口 `POST /api/auth/login`
- **新增** JWT access token + refresh token 签发与刷新机制（`POST /api/auth/refresh`）
- **新增** 当前用户信息接口 `GET /api/auth/me`
- **新增** 前端 AuthContext，管理登录态、token 存储与自动刷新
- **新增** 登录页 `/login`、注册页 `/register`
- **新增** 用户资料页 `/dashboard/profile`，展示头像、连续学习天数、用户等级
- **新增** 受保护路由（ProtectedRoute），未登录重定向至 `/login`
- **新增** 用户资料编辑接口 `PATCH /api/auth/me`
- **修改** Sidebar 底部新增用户信息区域（头像 + 用户名）与退出登录按钮
- **修改** BrandPage 的 Navbar 根据登录态显示"登录"或"进入 Dashboard"

## Capabilities

### New Capabilities

- `user-auth`: 用户注册、登录、JWT access/refresh token 签发与验证、会话持久化、受保护路由守卫
- `user-profile`: 用户资料页，查看和编辑个人信息（头像、昵称、简介），展示连续学习天数与等级

### Modified Capabilities

- `dashboard-layout`: Sidebar 底部新增用户信息区域与退出登录；Dashboard 路由受登录态保护

## Impact

- **后端**：新增 `backend/` 目录（FastAPI + SQLite + Alembic），引入 PyJWT、bcrypt、passlib 等依赖，不影响前端 Vite 构建流程
- **前端路由**：新增 `/login`、`/register`、`/dashboard/profile` 路由，Dashboard 路由增加登录守卫
- **AuthContext**：在 ThemeProvider 外层包裹，全局提供 `useAuth()` hook
- **部署**：前端保持 GitHub Pages，后端需单独部署至 Railway/Render 等服务。**此变更涉及部署方式变更，需回滚方案**

## Out of Scope

- 后台管理系统
- OAuth 第三方登录（Google、GitHub 等）
- 邮箱验证 / 密码重置流程
- 角色与权限系统
- 账户删除功能
- Rate limiting / 暴力破解防护

## 回滚方案

1. AuthContext 内置降级开关：若后端不可达，自动进入 mock 模式，放行所有受保护路由
2. 前端路由守卫通过环境变量 `VITE_AUTH_ENABLED` 控制，设为 `false` 后所有页面公开访问
3. Alembic 迁移支持 `downgrade`，可回滚数据库至认证功能引入前的状态
