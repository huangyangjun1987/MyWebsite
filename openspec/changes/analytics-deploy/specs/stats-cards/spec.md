## MODIFIED Requirements

### Requirement: 统计卡片行展示

系统 SHALL 在 Dashboard 学习数据页顶部展示 4 个数据统计卡片（今日学习时长、完成目标数、连续打卡天数、课程总进度），数据来源于 `GET /api/analytics/overview` API 响应。

#### Scenario: 正常渲染统计卡片

- **GIVEN** Dashboard 学习数据页加载
- **WHEN** API 返回有效数据（`today_duration_minutes`、`goals_completed`、`goals_total`、`streak_days`、`streak_record`、`course_progress_pct`）
- **THEN** 水平排列 4 个卡片，每个包含图标、数值、标签文本、副标题（趋势描述如「连续 7 天 | 最长 21 天」）

#### Scenario: 响应式布局

- **GIVEN** 统计卡片已渲染
- **WHEN** 视口宽度 < 768px
- **THEN** 卡片从 4 列变为 2 列网格；视口 < 480px 时变为单列堆叠

#### Scenario: 加载中状态

- **GIVEN** API 请求尚未完成
- **WHEN** 组件等待响应
- **THEN** 卡片显示骨架屏（skeleton）占位，不展示具体数值

#### Scenario: 错误：API 请求失败

- **GIVEN** API `/api/analytics/overview` 返回错误或网络异常
- **WHEN** 组件尝试渲染卡片
- **THEN** 卡片数值显示占位符 `--`，不导致页面崩溃，可点击重试按钮重新请求

### Requirement: 暗色模式适配

统计卡片 SHALL 支持亮/暗模式切换，使用对应主题的语义化色值。

#### Scenario: 暗色模式切换

- **GIVEN** 当前为亮色模式
- **WHEN** 用户切换至暗色模式
- **THEN** 卡片背景、文字色、图标色均切换为暗色主题对应的语义色值
