## MODIFIED Requirements

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

### Requirement: 用户资料导航访问

用户可通过侧边栏底部头像下拉菜单中的「个人资料」选项导航至 `/dashboard/profile` 页面。

#### Scenario: 点击进入资料页

- **GIVEN** 用户在 Dashboard 任意页面
- **WHEN** 用户点击底部头像 → 下拉菜单中的「个人资料」
- **THEN** 内容区切换至 `/dashboard/profile`（ProfilePage），下拉菜单关闭
