# Chat API

## Purpose

后端聊天 API — SSE 流式响应、DeepSeek 集成、学习数据上下文注入。

## ADDED Requirements

### Requirement: 发送消息并获取流式回复

系统 SHALL 提供 `POST /api/chat/send` 端点，接收用户消息并通过 SSE 流式返回 AI 回复。

#### Scenario: 成功发送消息

- **GIVEN** 用户提供有效的 `user_id`（整数）和 `message`（字符串，1-4000 字符）
- **WHEN** 客户端向 `/api/chat/send` 发送 POST 请求
- **THEN** 系统返回 `Content-Type: text/event-stream`，流式推送 AI 回复内容块，每块格式为 `data: {"content": "..."}\n\n`

#### Scenario: 流结束标记

- **GIVEN** DeepSeek API 已完成回复
- **WHEN** 后端读完 DeepSeek 流
- **THEN** 系统发送最终事件 `data: [DONE]\n\n` 后关闭连接

#### Scenario: 消息内容为空

- **GIVEN** 请求中 `message` 为空字符串或仅含空白字符
- **WHEN** 客户端向 `/api/chat/send` 发送 POST 请求
- **THEN** 系统返回 422 `{"detail": "Message cannot be empty"}`

### Requirement: DeepSeek API 集成

系统 SHALL 将用户消息转发至 DeepSeek Chat API，使用配置的 API Key、Base URL 和 Model，并将 DeepSeek 的流式响应逐块转发至客户端。

#### Scenario: 成功调用 DeepSeek

- **GIVEN** DeepSeek API 可用且配置正确
- **WHEN** 后端接收到有效的用户消息
- **THEN** 系统以 `httpx` 异步客户端向 DeepSeek `/v1/chat/completions` 发起流式请求，设置 `stream: true`，将每个 delta content chunk 封装为 SSE 格式发送给前端

#### Scenario: DeepSeek API 超时

- **GIVEN** DeepSeek API 在 30 秒内未响应
- **WHEN** 请求超时
- **THEN** 系统发送 SSE 错误事件 `data: {"error": "AI 服务响应超时，请稍后重试"}`，关闭连接

#### Scenario: DeepSeek API 鉴权失败

- **GIVEN** `DEEPSEEK_API_KEY` 无效或已过期
- **WHEN** 后端向 DeepSeek 发起请求
- **THEN** 系统发送 SSE 错误事件 `data: {"error": "AI 服务暂时不可用"}`，关闭连接，不在错误信息中暴露 API Key

### Requirement: 学习数据上下文注入

系统 SHALL 在调用 DeepSeek API 时，将用户的当前学习数据注入到 system prompt 中，使 AI 能提供个性化学习建议。

#### Scenario: 注入学习数据

- **GIVEN** 用户已在系统中累积学习数据（连续天数、等级、统计数据、每日目标）
- **WHEN** 后端构建 DeepSeek 请求
- **THEN** system prompt 包含：用户等级、连续学习天数、学习统计数据摘要、每日目标完成情况，格式为结构化文本

#### Scenario: 新用户无学习数据

- **GIVEN** 用户刚注册，无学习记录
- **WHEN** 后端查询用户学习数据为空
- **THEN** system prompt 仅包含基本角色设定（"你是一个 AI 学习助手"），不注入空数据字段
