# Chat UI

## Purpose

AI 学习助手聊天页面 — 消息展示、Markdown 渲染、自动滚动、清空对话。

## Requirements

### Requirement: 聊天页面路由

系统 SHALL 在 `/dashboard/ai-chat` 路由下提供 AI 对话页面。

#### Scenario: 用户进入 AI 助手页面

- **GIVEN** 用户已登录且位于 Dashboard
- **WHEN** 用户点击侧边栏"AI 助手"导航项
- **THEN** 内容区渲染聊天页面，显示欢迎提示（空状态）

#### Scenario: 无历史消息时显示空状态

- **GIVEN** 用户首次进入聊天页面
- **WHEN** 当前用户无聊天历史
- **THEN** 页面显示欢迎提示："你好！我是你的 AI 学习助手，有什么学习问题想问我吗？"及输入框

### Requirement: 消息展示

聊天页面 SHALL 以普通消息列表形式展示对话，区分用户消息与 AI 消息。

#### Scenario: 用户发送消息后列表更新

- **GIVEN** 用户在聊天页面
- **WHEN** 用户输入文本并点击发送
- **THEN** 消息列表末尾追加用户消息（右对齐），同时显示 AI 消息占位（左侧，loading 状态）

#### Scenario: AI 回复完成后展示

- **GIVEN** AI 回复请求已返回
- **WHEN** 前端收到 JSON 响应 `{"reply": "..."}`
- **THEN** AI 消息占位替换为完整回复内容，以 Markdown 格式渲染，loading 指示器移除

### Requirement: 自动滚动

聊天页面 SHALL 在新消息到达时自动滚动到列表底部。

#### Scenario: 新消息到达时滚动

- **GIVEN** 消息列表包含多条消息
- **WHEN** 用户发送新消息或 AI 回复返回
- **THEN** 消息列表自动滚动至底部，最新消息完整可见

#### Scenario: 用户在查看历史时不受影响

- **GIVEN** 用户向上滚动查看历史消息
- **WHEN** AI 回复返回（当前在等待回复）
- **THEN** 页面不强制滚动，保持用户当前视口位置

### Requirement: Markdown 渲染

系统 SHALL 使用 react-markdown 渲染 AI 回复中的 Markdown 内容（代码块、列表、表格、粗斜体）。

#### Scenario: AI 回复包含代码块

- **GIVEN** AI 回复包含 Markdown 代码块（用 ``` 包裹）
- **WHEN** 消息渲染
- **THEN** 代码块以等宽字体、带背景色样式显示，其余文本正常渲染

### Requirement: Loading 状态

页面 SHALL 在等待 AI 回复期间显示 loading 指示器。

#### Scenario: 等待 AI 回复

- **GIVEN** 用户已发送消息，等待后端响应
- **WHEN** 请求尚未完成
- **THEN** 消息列表底部显示 AI 消息占位及跳跃圆点动画

### Requirement: 错误处理

聊天页面 SHALL 在网络异常或 API 错误时显示错误提示，不崩溃。

#### Scenario: API 请求失败

- **GIVEN** 后端服务不可用或返回错误
- **WHEN** 用户发送消息
- **THEN** 页面显示错误提示"发送失败，请稍后重试"，用户可点击重试

### Requirement: 清空对话

聊天页面 SHALL 提供清空对话按钮，清除当前用户所有聊天记录。

#### Scenario: 清空对话

- **GIVEN** 消息列表包含多条消息
- **WHEN** 用户点击"清空对话"按钮
- **THEN** 数据库中该用户消息全部删除，页面消息列表清空，显示空状态欢迎提示
