## ADDED Requirements

### Requirement: 每日目标清单展示

系统 SHALL 在 Dashboard 首页展示当日学习任务清单，每项包含标题、所属课程名、完成状态。

#### Scenario: 正常渲染目标清单

- **GIVEN** Dashboard 首页加载完成
- **WHEN** mock 目标数据有效
- **THEN** 显示"今日目标"区域，每项任务展示 checkbox、标题、课程名

#### Scenario: 勾选完成任务

- **GIVEN** 目标清单中存在未完成任务
- **WHEN** 用户点击未完成任务的 checkbox
- **THEN** 该任务标题添加删除线，checkbox 显示勾选状态，进度计数更新

#### Scenario: 取消完成任务

- **GIVEN** 目标清单中存在已完成任务
- **WHEN** 用户点击已完成任务的 checkbox
- **THEN** 该任务恢复为未完成状态，删除线移除，checkbox 恢复空心

#### Scenario: 空清单状态

- **GIVEN** mock 数据中目标列表为空数组
- **WHEN** 组件渲染
- **THEN** 显示空状态提示文案

#### Scenario: 错误：目标数据格式异常

- **GIVEN** mock 数据中某目标的 `title` 字段缺失
- **WHEN** 组件渲染该目标项
- **THEN** 该项标题显示占位符文本，不影响其他列表项渲染

### Requirement: 完成进度指示

系统 SHALL 在目标清单区域顶部显示当日完成进度条，随勾选操作实时更新。

#### Scenario: 部分完成时进度条更新

- **GIVEN** 目标清单有 4 项，其中 2 项已完成
- **WHEN** 用户勾选第 3 项任务
- **THEN** 进度条宽度更新为 75%，文本更新为"已完成 3/4"
