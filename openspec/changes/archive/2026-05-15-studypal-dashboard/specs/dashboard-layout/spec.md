## ADDED Requirements

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

侧边栏 SHALL 包含导航项列表，点击后切换路由并高亮当前激活项。

#### Scenario: 导航项点击切换

- **GIVEN** 用户在 Dashboard 首页
- **WHEN** 用户点击侧边栏中的导航项
- **THEN** 内容区切换至对应页面，该导航项显示激活态样式（高亮背景 + 左侧指示条）

#### Scenario: 侧边栏折叠/展开

- **GIVEN** 侧边栏处于展开状态（240px）
- **WHEN** 用户点击折叠按钮
- **THEN** 侧边栏收窄至 64px（仅显示图标），再次点击恢复至 240px，折叠偏好持久化至 localStorage

### Requirement: 品牌站与 Dashboard 共存

系统 SHALL 在 `/#/` 路径下保留完整品牌站页面，与 Dashboard 路由隔离。

#### Scenario: 品牌站访问不受影响

- **GIVEN** 路由重构已完成
- **WHEN** 用户访问 `/#/`
- **THEN** 渲染原有品牌站（HeroSection、AboutSection、ProjectSection），Navbar 锚点导航正常

#### Scenario: 从品牌站导航至 Dashboard

- **GIVEN** 用户在品牌站页面
- **WHEN** 用户点击 Navbar 中新增的"学习助手"链接
- **THEN** 浏览器导航至 `/#/dashboard`，品牌站页面卸载
