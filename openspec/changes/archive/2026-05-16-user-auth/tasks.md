## 1. 后端项目初始化

- [ ] 1.1 创建 `backend/` 目录结构（main.py、config.py、database.py、models/、schemas/、routers/、services/）
- [ ] 1.2 创建 `backend/requirements.txt`，添加 fastapi、uvicorn、sqlalchemy、alembbic、pyjwt、passlib[bcrypt]、pydantic 依赖
- [ ] 1.3 实现 `config.py`（JWT_SECRET、ACCESS_TOKEN_EXPIRE_MINUTES=15、REFRESH_TOKEN_EXPIRE_DAYS=7、DATABASE_URL=sqlite:///./studypal.db）
- [ ] 1.4 实现 `database.py`（SQLAlchemy engine + SessionLocal + Base）
- [ ] 1.5 初始化 Alembic（`alembic init alembic`），配置 target_metadata 指向 User Base

**验证**：`uvicorn backend.main:app --reload` 启动无报错，访问 `http://localhost:8000/docs` 显示 Swagger UI

---

## 2. 后端认证 API

- [ ] 2.1 创建 `models/user.py`（User 表：id、username（unique）、password_hash、avatar_url、bio、consecutive_days、last_checkin_date、created_at）
- [ ] 2.2 创建 `models/refresh_token.py`（RefreshToken 表：id、token、user_id FK、expires_at、created_at）
- [ ] 2.3 运行 `alembic revision --autogenerate` 生成迁移脚本，`alembic upgrade head` 创建数据库表
- [ ] 2.4 创建 `schemas/auth.py`（RegisterRequest、LoginRequest、TokenResponse、UserResponse、RefreshRequest、ProfileUpdateRequest、CheckinResponse）
- [ ] 2.5 实现 `services/auth.py` — `hash_password()`、`verify_password()`（bcrypt cost=12）
- [ ] 2.6 实现 `services/auth.py` — `create_access_token()`、`create_refresh_token()`、`decode_token()`
- [ ] 2.7 实现 `routers/auth.py` — `POST /api/auth/register`（用户名唯一校验、密码哈希、返回用户信息）
- [ ] 2.8 实现 `routers/auth.py` — `POST /api/auth/login`（验证凭据、签发双 token、存储 refresh token）
- [ ] 2.9 实现 `routers/auth.py` — `POST /api/auth/refresh`（验证 refresh token、签发新 access token）
- [ ] 2.10 实现 `routers/auth.py` — `GET /api/auth/me`（依赖 `get_current_user` 从 JWT 提取 user_id 查询用户）

**验证**：
```bash
# 注册
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
# 期望: 201 + 用户信息

# 登录
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
# 期望: 200 + access_token + refresh_token

# 获取当前用户
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
# 期望: 200 + 用户信息
```

---

## 3. 后端资料与签到 API

- [ ] 3.1 实现 `routers/auth.py` — `PATCH /api/auth/me`（更新 bio、avatar_url）
- [ ] 3.2 实现 `services/auth.py` — `calculate_level(consecutive_days)` 派生等级（Lv.1-4）
- [ ] 3.3 实现 `routers/auth.py` — `PATCH /api/auth/checkin`（校验今日是否已签到，更新连续天数和 last_checkin_date）
- [ ] 3.4 注册 `routers/auth.py` 到 `main.py`，配置 CORS middleware 允许前端域名

**验证**：
```bash
# 更新资料
curl -X PATCH http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"bio":"热爱学习"}'
# 期望: 200 + 更新后用户信息

# 签到
curl -X PATCH http://localhost:8000/api/auth/checkin \
  -H "Authorization: Bearer <access_token>"
# 期望: 200 + consecutive_days=1, level=1, checked_in_today=true

# 重复签到
curl -X PATCH http://localhost:8000/api/auth/checkin \
  -H "Authorization: Bearer <access_token>"
# 期望: 409 Already checked in today
```

---

## 4. 前端 AuthContext 与路由守卫

- [ ] 4.1 创建 `src/contexts/AuthContext.tsx` — AuthProvider 组件 + `useAuth()` hook
- [ ] 4.2 实现 AuthProvider 初始化逻辑（从 localStorage 读取 token，调用 `/api/auth/me` 验证）
- [ ] 4.3 实现 `login()` 函数（调用 `/api/auth/login`，存储 token 到 localStorage）
- [ ] 4.4 实现 `register()` 函数（调用 `/api/auth/register`，自动登录）
- [ ] 4.5 实现 `logout()` 函数（清除 localStorage token，重置 user 状态）
- [ ] 4.6 实现 `refreshToken()` 函数（调用 `/api/auth/refresh`，更新 access_token）
- [ ] 4.7 实现自动 token 刷新拦截（API 请求返回 401 时自动尝试 refresh，失败则 logout）
- [ ] 4.8 创建 `src/components/ProtectedRoute.tsx`（检查 isAuthenticated，未登录重定向 /login，加载中显示 spinner）

**验证**：
- AuthProvider 包裹 ThemeProvider，App.tsx 中通过 `useAuth()` 可访问 user 和 login/logout
- 未登录访问 `/dashboard` → 重定向至 `/login`
- 登录后访问 `/dashboard` → 正常渲染

---

## 5. 前端登录与注册页面

- [ ] 5.1 创建 `src/pages/LoginPage.tsx`（用户名输入框、密码输入框、登录按钮、错误提示、注册链接）
- [ ] 5.2 登录按钮点击调用 `useAuth().login()`，loading 状态禁用按钮
- [ ] 5.3 登录成功后跳转至 `/dashboard`
- [ ] 5.4 创建 `src/pages/RegisterPage.tsx`（用户名、密码、确认密码输入框，前端校验密码一致性）
- [ ] 5.5 注册按钮点击调用 `useAuth().register()`，成功后跳转至 `/dashboard`
- [ ] 5.6 在 App.tsx 中添加 `/login` 和 `/register` 路由（在 AuthProvider + HashRouter 内）

**验证**：
- 访问 `/#/login` 显示登录页，输入错误凭据显示错误提示
- 访问 `/#/register` 显示注册页，注册成功后自动跳转 Dashboard
- 已登录用户访问 `/login` → 重定向至 `/dashboard`

---

## 6. 前端资料页

- [ ] 6.1 创建 `src/pages/ProfilePage.tsx`（展示头像、用户名、等级徽章、连续学习天数、bio）
- [ ] 6.2 实现等级展示（等级名称 + 距下一级进度条）
- [ ] 6.3 实现编辑模式切换（点击编辑按钮进入编辑态，表单含 bio textarea + avatar_url 输入）
- [ ] 6.4 调用 `PATCH /api/auth/me` 保存编辑内容，显示保存成功/失败提示
- [ ] 6.5 添加签到按钮，调用 `PATCH /api/auth/checkin`，刷新连续天数与等级展示
- [ ] 6.6 在 App.tsx 中添加 `/dashboard/profile` 路由（在 DashboardLayout 内）

**验证**：
- 访问 `/#/dashboard/profile` 显示用户资料
- 点击编辑 → 修改 bio → 保存 → 页面更新
- 点击签到按钮 → 连续天数+1 → 等级随天数更新

---

## 7. 导航与侧边栏集成

- [ ] 7.1 修改 `Sidebar.tsx`，在折叠按钮前添加用户信息区域（UserFooter：头像缩略图 + 用户名），底部添加退出登录按钮
- [ ] 7.2 在导航列表中添加"个人资料"项（href: `/dashboard/profile`），置于"设置"之前
- [ ] 7.3 修改 `Navbar.tsx`，根据 `useAuth().isAuthenticated` 切换显示"登录"或"进入 Dashboard"按钮
- [ ] 7.4 修改 `App.tsx`，用 `<ProtectedRoute>` 包裹 DashboardLayout 路由

**验证**：
- Sidebar 底部显示登录用户头像和用户名
- 点击退出登录 → 清除 token → 跳转 `/login`
- 品牌站 Navbar：未登录显示"登录"，已登录显示"进入 Dashboard"

---

## 8. 后端部署配置

- [ ] 8.1 创建 `backend/Procfile`（web: uvicorn main:app --host 0.0.0.0 --port $PORT）
- [ ] 8.2 创建 `backend/runtime.txt` 指定 Python 版本（3.12）
- [ ] 8.3 后端 CORS 配置允许前端 GitHub Pages 域名
- [ ] 8.4 前端 AuthContext 支持 `VITE_AUTH_ENABLED=false` 降级开关，关闭时跳过认证
- [ ] 8.5 前端 API base URL 通过 `VITE_API_BASE_URL` 环境变量配置

**验证**：
- Railway/Render 部署后端，`/docs` 可访问
- 前端设置 `VITE_API_BASE_URL` 指向部署地址，登录流程正常
- 设置 `VITE_AUTH_ENABLED=false` → Dashboard 公开访问
