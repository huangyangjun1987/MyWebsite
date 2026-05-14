## ADDED Requirements

### Requirement: 项目区渲染在 Hero Section 下方
系统 SHALL 在 Hero Section 下方渲染项目展示区，包含标题和至少 4 个项目卡片。

#### Scenario: 桌面端项目区布局
- **GIVEN** 用户使用桌面浏览器访问站点
- **WHEN** 用户滚动到 Hero Section 下方
- **THEN** 项目展示区可见，位于 Hero Section 之后
- **AND** 项目区包含标题"我的项目"
- **AND** 项目卡片以 3 列网格布局展示
- **AND** 至少展示 4 个项目

#### Scenario: 移动端项目区布局
- **GIVEN** 用户使用移动设备（viewport ≤ 768px）访问站点
- **WHEN** 用户滚动到项目区
- **THEN** 项目卡片以单列布局展示
- **AND** 所有卡片内容完整可见，无水平滚动条

#### Scenario: 项目列表为空
- **GIVEN** 项目数据数组为空
- **WHEN** ProjectSection 组件渲染
- **THEN** 展示区标题仍可见
- **AND** 卡片区域显示空状态提示"暂无项目展示"
- **AND** 不抛出异常

### Requirement: 项目卡片内容展示
系统 SHALL 在每个项目卡片中展示项目截图、名称、简介和 GitHub 链接。

#### Scenario: 卡片包含完整信息
- **GIVEN** 项目数据包含 image、name、description、githubUrl
- **WHEN** 项目卡片渲染
- **THEN** 卡片顶部显示项目截图（lazy loading）
- **AND** 截图下方显示项目名称
- **AND** 名称下方显示项目简介
- **AND** 卡片底部显示 GitHub 链接按钮

#### Scenario: 项目没有 GitHub 链接
- **GIVEN** 某个项目的 `githubUrl` 字段为空或未定义
- **WHEN** 项目卡片渲染
- **THEN** GitHub 链接按钮不显示
- **AND** 卡片布局不错乱，其他内容正常展示

#### Scenario: 项目截图加载失败
- **GIVEN** 某个项目的截图 URL 无效或加载失败
- **WHEN** 浏览器尝试加载截图
- **THEN** 截图区域显示占位图（回退样式）
- **AND** 卡片其他内容不受影响

### Requirement: 卡片 hover 微特效
系统 SHALL 在桌面端为用户鼠标悬浮在项目卡片上时提供视觉反馈。

#### Scenario: 鼠标悬浮卡片
- **GIVEN** 用户使用桌面浏览器（支持 hover）
- **WHEN** 用户将鼠标悬浮在任意项目卡片上
- **THEN** 卡片阴影增强（shadow-lg）
- **AND** 卡片轻微上浮（translateY 负移）
- **AND** 卡片边框颜色高亮
- **AND** 过渡动画持续约 300ms

#### Scenario: 触摸设备无 hover 效果
- **GIVEN** 用户使用触摸设备访问站点
- **WHEN** 用户点击或触摸项目卡片
- **THEN** 不触发 hover 微特效
- **AND** 卡片保持默认样式

### Requirement: 项目区锚点承接
系统 SHALL 以 `id="projects"` 标记项目展示区，以承接导航栏链接和 Hero CTA 的平滑滚动。

#### Scenario: 导航栏"项目"链接滚动到项目区
- **GIVEN** 用户正在浏览其他页面区域
- **WHEN** 用户点击导航栏中的"项目"链接
- **THEN** 页面平滑滚动到项目展示区顶部
- **AND** 项目区 `id="projects"` 与链接目标匹配

#### Scenario: Hero CTA 按钮滚动到项目区
- **GIVEN** 用户正在查看 Hero Section
- **WHEN** 用户点击 CTA 按钮
- **THEN** 页面平滑滚动到项目展示区顶部
