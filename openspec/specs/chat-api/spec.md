# Chat API

## Purpose

后端聊天 API — DeepSeek 集成、多轮对话上下文、学习数据注入。

## Requirements

### Requirement: 发送消息并获取回复

系统 SHALL 提供 `POST /api/chat/send` 端点，接收用户消息并返回 AI 回复。

#### Scenario: 成功发送消息

- **GIVEN** 用户提供有效的 `user_id`（整数）和 `message`（字符串，1-4000 字符）
- **WHEN** 客户端向 `/api/chat/send` 发送 POST 请求
- **THEN** 系统返回 `Content-Type: application/json`，body 为 `{"reply": "AI 回复内容"}`

#### Scenario: 消息内容为空

- **GIVEN** 请求中 `message` 为空字符串或仅含空白字符
- **WHEN** 客户端向 `/api/chat/send` 发送 POST 请求
- **THEN** 系统返回 422 `{"detail": "Message cannot be empty"}`

### Requirement: DeepSeek API 集成

系统 SHALL 将用户消息及对话历史转发至 DeepSeek Chat API，使用配置的 API Key、Base URL 和 Model，返回完整 AI 回复。

#### Scenario: 成功调用 DeepSeek

- **GIVEN** DeepSeek API 可用且配置正确
- **WHEN** 后端接收到有效的用户消息
- **THEN** 系统使用 openai SDK 同步客户端向 DeepSeek 发起 `stream=False` 请求，将完整回复返回给前端

#### Scenario: DeepSeek API 不可用

- **GIVEN** DeepSeek API 返回错误或无法连接
- **WHEN** 后端向 DeepSeek 发起请求
- **THEN** 系统返回 502 `{"detail": "AI 服务暂时不可用"}`，不在错误信息中暴露 API Key

### Requirement: 多轮对话上下文

系统 SHALL 在每次请求时将最近 20 轮对话历史拼接至 messages 数组，实现多轮对话连贯性。

#### Scenario: 延续上下文

- **GIVEN** 用户已有历史对话记录
- **WHEN** 用户发送新消息
- **THEN** 后端从数据库读取最近 20 轮历史（user + assistant 消息），按 `system → 历史消息 → 当前消息` 顺序拼接为 messages 数组发给 DeepSeek

### Requirement: 学习数据上下文注入

系统 SHALL 在调用 DeepSeek API 时，将用户的当前学习数据注入到 system prompt 中，使 AI 能提供个性化学习建议。

#### Scenario: 注入学习数据

- **GIVEN** 用户已在系统中累积学习数据（等级、连续天数、个人简介）
- **WHEN** 后端构建 system prompt
- **THEN** system prompt 包含：用户等级、连续学习天数、个人简介，格式为结构化文本

#### Scenario: 新用户无学习数据

- **GIVEN** 用户刚注册，无学习记录
- **WHEN** 后端查询用户学习数据为空
- **THEN** system prompt 仅包含基本角色设定（"你是一个 AI 学习助手"），不注入空数据字段
