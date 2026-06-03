## ADDED Requirements

### Requirement: 用户资料导航项

侧边栏导航列表 SHALL 在"设置"项之前包含"个人资料"导航项。

#### Scenario: 点击进入资料页

- **GIVEN** 用户在 Dashboard 任意页面
- **WHEN** 用户点击侧边栏"个人资料"导航项
- **THEN** 内容区切换至 `/dashboard/profile`（ProfilePage），导航项显示激活态样式

---

## MODIFIED Requirements

### Requirement: 侧边栏导航

侧边栏 SHALL 包含导航项列表（学习仪表盘、课程管理、学习笔记、AI 助手、个人资料、设置），点击后切换路由并高亮当前激活项。侧边栏底部 SHALL 展示当前登录用户信息区域（头像缩略图 + 用户名）及退出登录按钮。

#### Scenario: 导航项点击切换

- **GIVEN** 用户在 Dashboard 首页
- **WHEN** 用户点击侧边栏中的导航项
- **THEN** 内容区切换至对应页面，该导航项显示激活态样式（高亮背景 + 左侧指示条）

#### Scenario: 侧边栏折叠/展开

- **GIVEN** 侧边栏处于展开状态（240px）
- **WHEN** 用户点击折叠按钮
- **THEN** 侧边栏收窄至 64px（仅显示图标），再次点击恢复至 240px，折叠偏好持久化至 localStorage。折叠状态下用户信息区域仅显示头像缩略图

#### Scenario: 退出登录

- **GIVEN** 用户已登录且在 Dashboard 页面
- **WHEN** 用户点击侧边栏底部的退出登录按钮
- **THEN** 系统清除认证状态，跳转至 `/login`

---

### Requirement: 品牌站与 Dashboard 共存

系统 SHALL 在 `/#/` 路径下保留完整品牌站页面，与 Dashboard 路由隔离。Navbar SHALL 根据用户登录状态显示不同操作按钮。

#### Scenario: 品牌站访问不受影响

- **GIVEN** 路由包含品牌站和 Dashboard
- **WHEN** 用户访问 `/#/`
- **THEN** 渲染原有品牌站（HeroSection、AboutSection、ProjectSection），Navbar 锚点导航正常

#### Scenario: 未登录时 Navbar 按钮

- **GIVEN** 用户未登录，在品牌站页面
- **WHEN** Navbar 渲染
- **THEN** 显示"登录"按钮，点击跳转至 `/#/login`

#### Scenario: 已登录时 Navbar 按钮

- **GIVEN** 用户已登录，在品牌站页面
- **WHEN** Navbar 渲染
- **THEN** 显示"进入 Dashboard"按钮，点击跳转至 `/#/dashboard`

#### Scenario: 从品牌站导航至 Dashboard

- **GIVEN** 用户在品牌站页面
- **WHEN** 用户点击 Navbar 中的"进入 Dashboard"链接
- **THEN** 浏览器导航至 `/#/dashboard`，品牌站页面卸载
