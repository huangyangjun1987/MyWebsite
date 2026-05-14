# Hero Section

## Purpose

全屏 Hero 区域，居中展示用户个人信息（姓名、职业、一句话介绍），提供 CTA 按钮实现平滑锚点滚动。

## Requirements

### Requirement: Hero 全屏展示个人信息
系统 SHALL 在页面顶部渲染一个全屏高度（100vh）的 Hero Section，居中展示用户姓名、职业和一句话介绍。

#### Scenario: 桌面端正常渲染
- **GIVEN** 用户使用桌面浏览器（viewport > 768px）访问站点
- **WHEN** 页面加载完成
- **THEN** Hero Section 占满整个视口高度
- **AND** 姓名以加粗大号字体居中显示
- **AND** 职业以较小字号显示在姓名下方
- **AND** 个人介绍显示在职业下方
- **AND** 所有文字水平居中

#### Scenario: 移动端正常渲染
- **GIVEN** 用户使用移动设备（viewport ≤ 768px）访问站点
- **WHEN** 页面加载完成
- **THEN** Hero Section 占满整个视口高度
- **AND** 文字字号适配移动端较小屏幕，不溢出
- **AND** 内容保持居中
- **AND** 无水平滚动条

#### Scenario: 超短视口（横屏手机）
- **GIVEN** 用户使用横屏手机访问站点，视口高度 < 500px
- **WHEN** 页面加载完成
- **THEN** Hero Section 最小高度为 100vh
- **AND** 所有内容仍可见，不被裁剪
- **AND** 内容区不超出视口边界

### Requirement: CTA 按钮跳转项目区
系统 SHALL 在 Hero Section 中提供一个 CTA 按钮，点击后平滑滚动到页面中的项目展示区域。

#### Scenario: 点击 CTA 滚动到项目区
- **GIVEN** 用户正在浏览 Hero Section
- **AND** 页面中存在 `id="projects"` 的元素
- **WHEN** 用户点击 CTA 按钮
- **THEN** 页面平滑滚动到 `#projects` 元素位置
- **AND** 滚动行为为 `smooth`

#### Scenario: 项目区不存在时点击 CTA
- **GIVEN** 用户正在浏览 Hero Section
- **AND** 页面中不存在 `id="projects"` 的元素
- **WHEN** 用户点击 CTA 按钮
- **THEN** 页面静默无操作
- **AND** 不抛出控制台错误
