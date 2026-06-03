## Why

用户需要一个 AI 学习助手，能够基于其学习数据（学习统计、目标达成率、连续学习天数等）提供个性化学习建议。目前系统已具备数据采集和仪表盘展示能力，但缺乏将这些数据转化为可操作建议的桥梁。接入 DeepSeek API 提供智能对话，让用户可以直接询问学习相关问题并获得定制化指导。

## What Changes

- 新增 `/dashboard/ai-chat` 页面，提供普通消息式聊天界面
- 新增后端聊天 API 端点，支持 SSE 流式响应，对接 DeepSeek API
- 新增聊天消息数据库表，按用户 ID 存储完整对话历史
- AI 回复时注入用户学习数据上下文，实现个性化建议
- 前端支持 Markdown 渲染和消息自动滚动

## Capabilities

### New Capabilities

- `chat-ui`: 前端聊天界面 — 普通消息展示、流式渲染、自动滚动、Markdown 显示、空状态欢迎提示、loading 状态
- `chat-api`: 后端聊天 API — SSE 流式响应、DeepSeek API 集成、注入学习数据上下文
- `chat-history`: 聊天历史持久化 — 消息存储到 SQLite、按用户查询历史、会话列表

### Modified Capabilities

_无。dashboard-layout spec 已包含"AI 助手"导航项，本变更仅实现对应路由页面。_

## Impact

- **新增后端依赖**: FastAPI + SQLAlchemy + sse-starlette（流式响应）、httpx（调用 DeepSeek API）
- **新增前端依赖**: react-markdown（Markdown 渲染）
- **新增数据库表**: `chat_messages`（存储用户对话消息）
- **路由变更**: App.tsx 需添加 `/dashboard/ai-chat` 路由映射到 ChatPage
- **不影响现有功能**: 品牌站、Dashboard 其他页面、认证流程均不受影响

## Out of Scope

- 语音输入
- 文件上传
- 模型切换
- 消息气泡样式
- JWT 鉴权保护
- 多轮对话分支/编辑历史消息
- 对话导出/分享
