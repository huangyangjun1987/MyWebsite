# Dashboard Layout

## Purpose

Dashboard 整体布局框架 — 侧边栏、路由、品牌站与 Dashboard 共存。

## Requirements

### Requirement: Dashboard 整体布局

系统 SHALL 在 `/dashboard` 路径下提供左侧固定导航栏 + 右侧内容区的 Dashboard 布局。

#### Scenario: 用户访问 Dashboard 首页

- **GIVEN** 用户已打开应用
- **WHEN** 用户导航至 `/#/dashboard`
- **THEN** 页面渲染左侧侧边栏（宽度 240px）和右侧 DashboardHome 内容区

#### Scenario: 移动端默认折叠侧边栏

- **GIVEN** 用户使用移动设备访问 Dashboard
- **WHEN** 视口宽度 < 768px
- **THEN** 侧边栏默认隐藏，内容区占满全宽，页面显示汉堡菜单按钮

#### Scenario: 错误：访问不存在的 Dashboard 子路由

- **GIVEN** 用户在 Dashboard 页面
- **WHEN** 用户导航至未定义的路由如 `/#/dashboard/nonexistent`
- **THEN** 系统显示 404 提示信息，页面不崩溃

### Requirement: 侧边栏导航

侧边栏 SHALL 包含 3 项核心导航项（学习数据、AI 对话建议、学习目标），点击后切换路由并高亮当前激活项。侧边栏底部 SHALL 展示当前登录用户头像缩略图，点击展开下拉菜单（个人资料、设置、退出登录）。

#### Scenario: 导航项点击切换

- **GIVEN** 用户在 Dashboard 首页
- **WHEN** 用户点击侧边栏中的导航项（学习数据 / AI 对话建议 / 学习目标）
- **THEN** 内容区切换至对应页面，该导航项显示激活态样式（高亮背景 + 左侧指示条）

#### Scenario: 侧边栏折叠/展开

- **GIVEN** 侧边栏处于展开状态（240px）
- **WHEN** 用户点击折叠按钮
- **THEN** 侧边栏收窄至 64px（仅显示图标），再次点击恢复至 240px，折叠偏好持久化至 localStorage。折叠状态下用户信息区域仅显示头像缩略图，不显示下拉菜单

#### Scenario: 用户头像下拉菜单

- **GIVEN** 用户已登录且在 Dashboard 页面
- **WHEN** 用户点击侧边栏底部的用户头像缩略图
- **THEN** 弹出下拉菜单，包含「个人资料」「设置」「退出登录」三个选项

#### Scenario: 退出登录

- **GIVEN** 用户已登录且在 Dashboard 页面
- **WHEN** 用户点击下拉菜单中的退出登录选项
- **THEN** 系统清除认证状态，跳转至 `/login`

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

### Requirement: 用户资料导航访问

用户可通过侧边栏底部头像下拉菜单中的「个人资料」选项导航至 `/dashboard/profile` 页面。

#### Scenario: 点击进入资料页

- **GIVEN** 用户在 Dashboard 任意页面
- **WHEN** 用户点击底部头像 → 下拉菜单中的「个人资料」
- **THEN** 内容区切换至 `/dashboard/profile`（ProfilePage），下拉菜单关闭
