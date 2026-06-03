## ADDED Requirements

### Requirement: AI 建议学习面板

系统 SHALL 在 Dashboard 首页展示 AI 建议面板，包含若干推荐卡片（数据来源于 mock 常量）。

#### Scenario: 正常渲染建议卡片

- **GIVEN** Dashboard 首页加载完成
- **WHEN** mock 建议数据有效
- **THEN** 显示"AI 学习建议"区域，标题旁有 AI 标识图标，渲染 2-3 张建议卡片（含类型标签、标题、描述、操作按钮）

#### Scenario: 建议卡片类型区分

- **GIVEN** 建议列表包含多种类型的建议
- **WHEN** 渲染建议列表
- **THEN** 课程推荐使用蓝色标签，复习提醒使用橙色标签，技能拓展使用绿色标签

#### Scenario: 空建议列表

- **GIVEN** mock 数据中建议列表为空
- **WHEN** 组件渲染
- **THEN** 显示空状态提示文案

#### Scenario: 错误：建议数据格式异常

- **GIVEN** 某建议项的 `title` 字段缺失
- **WHEN** 组件渲染该建议卡片
- **THEN** 该卡片标题显示占位符文本，不影响其他卡片渲染
