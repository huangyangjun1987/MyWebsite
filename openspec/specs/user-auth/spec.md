# User Auth

## Purpose

认证系统 — 用户注册、登录、JWT token 签发与验证、前端会话管理。

## Requirements

### Requirement: 用户注册

系统 SHALL 提供 `POST /api/auth/register` 端点，允许新用户通过用户名和密码注册账户。

#### Scenario: 成功注册

- **GIVEN** 用户提供未被占用的用户名（3-32 字符）和密码（6-128 字符）
- **WHEN** 用户向 `/api/auth/register` 发送 POST 请求
- **THEN** 系统创建用户记录，密码经 bcrypt 哈希存储，返回 201 及用户信息（不含密码）

#### Scenario: 用户名已存在

- **GIVEN** 用户名已被注册
- **WHEN** 用户向 `/api/auth/register` 发送注册请求
- **THEN** 系统返回 409 错误 `{"detail": "Username already exists"}`

#### Scenario: 输入验证失败

- **GIVEN** 用户提供的用户名少于 3 字符或密码少于 6 字符
- **WHEN** 用户提交注册
- **THEN** 系统返回 422 及字段级验证错误信息

---

### Requirement: 用户登录

系统 SHALL 提供 `POST /api/auth/login` 端点，验证用户名和密码后签发 JWT access token 和 refresh token。

#### Scenario: 成功登录

- **GIVEN** 用户提供正确的用户名和密码
- **WHEN** 用户向 `/api/auth/login` 发送 POST 请求
- **THEN** 系统返回 200，包含 access_token（15 分钟有效）、refresh_token（7 天有效）和用户信息

#### Scenario: 凭据错误

- **GIVEN** 用户提供错误的用户名或密码
- **WHEN** 用户发送登录请求
- **THEN** 系统返回 401 `{"detail": "Invalid username or password"}`

---

### Requirement: JWT Token 刷新

系统 SHALL 提供 `POST /api/auth/refresh` 端点，允许客户端使用有效的 refresh token 获取新的 access token。

#### Scenario: 成功刷新

- **GIVEN** 用户持有有效的 refresh token
- **WHEN** 用户向 `/api/auth/refresh` 发送 POST 请求
- **THEN** 系统验证 refresh token 在数据库中存在且未过期，返回新的 access_token

#### Scenario: Refresh token 无效或已过期

- **GIVEN** 用户持有无效或已过期的 refresh token
- **WHEN** 用户发送刷新请求
- **THEN** 系统返回 401 `{"detail": "Invalid or expired refresh token"}`，并删除数据库中该 token 记录

---

### Requirement: 获取当前用户

系统 SHALL 提供 `GET /api/auth/me` 端点，返回当前已认证用户的信息。

#### Scenario: 获取用户信息

- **GIVEN** 请求头包含有效的 `Authorization: Bearer <access_token>`
- **WHEN** 用户向 `/api/auth/me` 发送 GET 请求
- **THEN** 系统返回 200 及用户信息（id、username、avatar_url、bio、level、consecutive_days、created_at）

#### Scenario: Token 无效

- **GIVEN** 请求头包含无效或已过期的 access token
- **WHEN** 用户向 `/api/auth/me` 发送请求
- **THEN** 系统返回 401 `{"detail": "Invalid or expired token"}`

---

### Requirement: AuthContext 会话管理

前端 SHALL 通过 AuthContext 全局管理用户登录状态，提供 `useAuth()` hook 供所有组件访问。

#### Scenario: 页面加载时恢复会话

- **GIVEN** localStorage 中存在有效的 access_token
- **WHEN** AuthProvider 首次挂载
- **THEN** AuthProvider 调用 `/api/auth/me` 验证 token，验证通过则 `user` 为非 null，`isAuthenticated` 为 true

#### Scenario: Token 过期自动刷新

- **GIVEN** access_token 已过期但 refresh_token 仍有效
- **WHEN** 任何组件通过 `useAuth()` 访问受保护资源
- **THEN** AuthContext 自动调用 `/api/auth/refresh` 获取新 access_token 并重试原请求

#### Scenario: 退出登录

- **GIVEN** 用户已登录
- **WHEN** 用户调用 `logout()`
- **THEN** 系统清除 localStorage 中的 access_token 和 refresh_token，`user` 设为 null，页面跳转至 `/login`

#### Scenario: 无有效 token

- **GIVEN** localStorage 中无 access_token
- **WHEN** AuthProvider 挂载
- **THEN** `isAuthenticated` 为 false，`user` 为 null，不发起 API 请求

---

### Requirement: 受保护路由

系统 SHALL 通过 ProtectedRoute 组件守卫 Dashboard 路由，未登录用户重定向至登录页。

#### Scenario: 已登录用户访问 Dashboard

- **GIVEN** `isAuthenticated` 为 true
- **WHEN** 用户导航至 `/dashboard` 或任意子路由
- **THEN** ProtectedRoute 渲染子组件（DashboardLayout），正常显示内容

#### Scenario: 未登录用户访问 Dashboard

- **GIVEN** `isAuthenticated` 为 false
- **WHEN** 用户直接导航至 `/dashboard`
- **THEN** ProtectedRoute 重定向至 `/login`（URL 变为 `/#/login`）

#### Scenario: 认证状态加载中

- **GIVEN** AuthContext 正在验证 localStorage token
- **WHEN** 用户访问 Dashboard 路由
- **THEN** ProtectedRoute 显示加载指示器（spinner），不闪白屏，不重定向

---

### Requirement: 登录与注册页面

系统 SHALL 提供 `/login` 和 `/register` 路由页面，供用户输入凭据完成认证。

#### Scenario: 用户登录页面

- **GIVEN** 用户导航至 `/login`
- **WHEN** 页面渲染
- **THEN** 显示用户名输入框、密码输入框、登录按钮、注册链接（跳转 `/register`），支持暗色模式

#### Scenario: 登录成功跳转

- **GIVEN** 用户在登录页输入正确凭据
- **WHEN** 用户点击"登录"按钮
- **THEN** 系统调用 `login()`，成功后跳转至 `/dashboard`，按钮显示 loading 状态期间不可重复点击

#### Scenario: 登录失败提示

- **GIVEN** 用户输入错误凭据
- **WHEN** 用户点击登录
- **THEN** 页面显示错误提示"用户名或密码错误"，不清空已输入的内容

#### Scenario: 注册页面

- **GIVEN** 用户导航至 `/register`
- **WHEN** 页面渲染
- **THEN** 显示用户名输入框、密码输入框、确认密码输入框（前端校验一致性）、注册按钮、登录链接
