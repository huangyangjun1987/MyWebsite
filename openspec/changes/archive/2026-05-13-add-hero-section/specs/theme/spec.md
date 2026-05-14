## ADDED Requirements

### Requirement: 手动切换亮/暗模式
系统 SHALL 提供一个可点击的切换按钮，允许用户在亮色和暗色模式之间手动切换。

#### Scenario: 从亮色切换到暗色
- **GIVEN** 当前主题为亮色模式
- **WHEN** 用户点击主题切换按钮
- **THEN** `<html>` 元素添加 `dark` class
- **AND** 页面所有 Tailwind `dark:` 前缀样式生效
- **AND** 切换按钮图标更新为暗色模式指示（月亮图标）

#### Scenario: 从暗色切换到亮色
- **GIVEN** 当前主题为暗色模式
- **WHEN** 用户点击主题切换按钮
- **THEN** `<html>` 元素的 `dark` class 被移除
- **AND** 页面所有 Tailwind `dark:` 前缀样式失效
- **AND** 切换按钮图标更新为亮色模式指示（太阳图标）

### Requirement: 主题状态持久化
系统 SHALL 将用户选择的主题持久化到 localStorage，并在用户再次访问时恢复。

#### Scenario: 主题持久化到 localStorage
- **GIVEN** 用户手动切换了主题
- **WHEN** 主题变更
- **THEN** 新主题值被写入 `localStorage` 的 `theme` 键
- **AND** 值为 `"dark"` 或 `"light"`

#### Scenario: 从 localStorage 恢复主题
- **GIVEN** 用户之前选择了暗色模式（localStorage 中 `theme = "dark"`）
- **WHEN** 用户重新访问站点
- **THEN** 页面以暗色模式加载
- **AND** `<html>` 元素在首次渲染前已包含 `dark` class（避免闪烁）

#### Scenario: 首次访问无 localStorage
- **GIVEN** 用户首次访问站点（localStorage 中无 `theme` 键）
- **WHEN** 页面加载
- **THEN** 主题回退为系统偏好（`prefers-color-scheme`）
- **AND** 若系统偏好也为空，默认使用亮色模式

#### Scenario: localStorage 值非法
- **GIVEN** localStorage 中 `theme` 的值不是 `"dark"` 或 `"light"`（如被手动篡改为 `"blue"`）
- **WHEN** 页面加载
- **THEN** 系统忽略非法值，回退为系统偏好
- **AND** 不抛出异常，页面正常渲染

### Requirement: 主题切换按钮位置
系统 SHALL 将主题切换按钮渲染在 Hero Section 的右上角。

#### Scenario: 切换按钮在 Hero 右上角可见
- **GIVEN** 用户访问站点
- **WHEN** Hero Section 渲染完成
- **THEN** 主题切换按钮固定在 Hero 右上角
- **AND** 按钮不随页面滚动而移动（absolute 定位在 Hero 内）
- **AND** 按钮可点击，不被其他元素遮挡（z-index: 20）
