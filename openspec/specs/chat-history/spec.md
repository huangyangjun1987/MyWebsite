# Chat History

## Purpose

聊天历史持久化 — 消息存储、按用户查询历史、清空对话。

## Requirements

### Requirement: 消息持久化

系统 SHALL 将每条用户消息和 AI 回复存储到 `chat_messages` 表中。

#### Scenario: 保存用户消息

- **GIVEN** 用户成功发送一条消息
- **WHEN** 后端接收到 `/api/chat/send` 请求
- **THEN** 系统将消息写入 `chat_messages` 表：`role='user'`、`content` 为用户输入、`user_id` 为请求中的 user_id、`created_at` 为当前 UTC 时间

#### Scenario: 保存 AI 回复

- **GIVEN** DeepSeek API 返回完整回复
- **WHEN** 回复内容已接收
- **THEN** 系统将完整回复写入 `chat_messages` 表：`role='assistant'`、`content` 为完整回复文本、`user_id` 同当前请求

### Requirement: 按用户查询聊天历史

系统 SHALL 提供 `GET /api/chat/history/{user_id}` 端点，返回指定用户的完整对话历史。

#### Scenario: 成功获取历史

- **GIVEN** 用户存在聊天记录
- **WHEN** 客户端向 `/api/chat/history/1` 发送 GET 请求
- **THEN** 系统返回 200，body 为 `{"messages": [...]}`，消息按 `created_at` 升序排列，每项包含 `id`、`role`、`content`、`created_at`

#### Scenario: 用户无聊天记录

- **GIVEN** 用户无聊天记录
- **WHEN** 客户端请求 `/api/chat/history/1`
- **THEN** 系统返回 200，body 为 `{"messages": []}`

#### Scenario: user_id 参数无效

- **GIVEN** URL 中的 `user_id` 不是有效整数
- **WHEN** 客户端向 `/api/chat/history/abc` 发送 GET 请求
- **THEN** 系统返回 422 `{"detail": "Invalid user ID"}`

### Requirement: 清空聊天历史

系统 SHALL 提供 `DELETE /api/chat/history/{user_id}` 端点，删除指定用户的全部聊天记录。

#### Scenario: 成功清空

- **GIVEN** 用户存在聊天记录
- **WHEN** 客户端向 `/api/chat/history/1` 发送 DELETE 请求
- **THEN** 系统返回 200 `{"detail": "ok"}`，数据库中对应用户的消息全部删除
