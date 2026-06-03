## ADDED Requirements

### Requirement: 统计卡片行展示

系统 SHALL 在 Dashboard 首页顶部展示 4 个数据统计卡片（今日学习时长、完成目标数、连续打卡天数、课程总进度），数据来源于 mock 常量。

#### Scenario: 正常渲染统计卡片

- **GIVEN** Dashboard 首页加载
- **WHEN** mock 数据完整且有效
- **THEN** 水平排列 4 个卡片，每个包含图标、数值、标签文本、副标题（趋势描述如"较昨日 +12%"）

#### Scenario: 响应式布局

- **GIVEN** 统计卡片已渲染
- **WHEN** 视口宽度 < 768px
- **THEN** 卡片从 4 列变为 2 列网格；视口 < 480px 时变为单列堆叠

#### Scenario: 错误：缺失数据字段

- **GIVEN** mock 数据中某卡片的 `value` 字段为 `undefined`
- **WHEN** 组件尝试渲染该卡片
- **THEN** 该卡片数值显示占位符 `--`，不导致页面崩溃

### Requirement: 暗色模式适配

统计卡片 SHALL 支持亮/暗模式切换，使用对应主题的语义化色值。

#### Scenario: 暗色模式切换

- **GIVEN** 当前为亮色模式
- **WHEN** 用户切换至暗色模式
- **THEN** 卡片背景、文字色、图标色均切换为暗色主题对应的语义色值
