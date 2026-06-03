## Context

当前项目为全栈 AI 学习平台（StudyPal），前端 React 19 + Tailwind CSS v4，后端 FastAPI + SQLite。已有用户认证系统（JWT）、学习仪表盘（统计卡片、每日目标、趋势图表）、用户资料页。Dashboard 侧边栏已包含"AI 助手"导航项，但对应路由仅渲染占位页（"即将推出"）。

本变更将 AI 对话功能落地，接入 DeepSeek API，使 AI 能读取用户学习数据并给出个性化建议。

## Goals / Non-Goals

**Goals:**
- 实现 `/dashboard/ai-chat` 页面（普通消息列表，非气泡样式）
- 实现后端聊天 API（SSE 流式响应 + DeepSeek 集成）
- AI 回复注入用户学习上下文（统计、目标、连续天数等）
- 聊天消息持久化到 SQLite，支持历史加载
- 前端 Markdown 渲染 + 消息自动滚动

**Non-Goals:**
- 消息气泡 UI 样式（后续迭代）
- JWT 鉴权保护 API 端点（后续迭代）
- 语音输入、文件上传、模型切换
- 多轮对话分支、编辑历史消息、对话导出

## Decisions

### 1. 流式传输：SSE over HTTP

**选择**: Server-Sent Events (SSE)，前端通过 `fetch` + `ReadableStream` 消费。

**理由**:
- SSE 比 WebSocket 更简单，单向推送即可满足需求（用户发送消息，AI 流式回复）
- `fetch` + `ReadableStream` 比原生 `EventSource` API 更适合：支持 POST 请求、自定义请求头、请求体
- 后端使用 `sse-starlette` 库，与 FastAPI 原生集成

**替代方案**: WebSocket — 过度设计，本项目无需双向实时通信。

### 2. DeepSeek API 集成

**选择**: `httpx` 异步客户端调用 DeepSeek Chat API，流式转发。

```
User → Frontend (fetch POST) → Backend (httpx stream) → DeepSeek API
                                  ↑
                           注入学习数据到 system prompt
```

**配置** (已有 `config.py`):
- `DEEPSEEK_API_KEY`: API 密钥
- `DEEPSEEK_BASE_URL`: `https://api.deepseek.com`
- `DEEPSEEK_MODEL`: `deepseek-chat`

**System Prompt 策略**: 后端根据 `user_id` 查询学习数据（统计、目标、连续天数、等级），注入到 system prompt 中，使 AI 能给出个性化建议。

### 3. 聊天历史存储

**选择**: 新建 SQLite 表 `chat_messages`，使用 SQLAlchemy ORM。

```python
class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id: int (PK)
    user_id: int (索引，关联 users 表)
    role: str ("user" | "assistant")
    content: str
    created_at: datetime
```

**理由**: SQLite 足够支撑个人学习平台的消息量；使用已有数据库基础设施（`Base`、`SessionLocal`、`get_db`、WAL 模式）。

### 4. 无需 JWT 鉴权

**选择**: 聊天 API 端点不校验 JWT token，通过请求体中的 `user_id` 识别用户。

**理由**: 前端 ProtectedRoute 已保证用户登录后才能访问页面；后续迭代再加入服务端鉴权。

**风险**: 任何人可直接调用 API 并伪造 user_id。在当前项目阶段（个人使用、无敏感数据）可接受。

### 5. 前端组件架构

```
ChatPage
├── ChatMessages (消息列表容器)
│   └── ChatMessage (单条消息: role badge + Markdown content)
├── ChatInput (输入框 + 发送按钮)
└── ChatEmptyState (无历史时的欢迎提示)
```

**理由**: 简单分层，ChatPage 管理状态（消息列表、加载态、错误态），子组件纯展示/输入。

### 6. 流式渲染策略

**选择**: 前端累积已接收的文本片段，逐步更新 AI 消息内容（乐观更新 + 增量渲染）。

- 用户发送消息 → 立即将用户消息追加到列表
- 创建空的 assistant 消息占位
- 每收到一个 SSE chunk → 拼接到占位消息的 content
- 流结束（`[DONE]` token）→ 标记消息完成

### 7. Markdown 渲染

**选择**: `react-markdown` 库，配置语法高亮。

**理由**: DeepSeek 回复可能包含代码块、列表、表格等 Markdown 格式；`react-markdown` 是 React 生态最成熟的 Markdown 渲染库。

### 8. API 端点设计

| Method | Path | 说明 |
|--------|------|------|
| POST | `/api/chat/send` | 发送消息，返回 SSE 流 |
| GET | `/api/chat/history/{user_id}` | 获取用户聊天历史 |

**POST /api/chat/send** Request:
```json
{
  "user_id": 1,
  "message": "今天该重点学什么？"
}
```

**POST /api/chat/send** Response: SSE 流
```
data: {"content": "根据"}
data: {"content": "你的"}
data: {"content": "学习"}
...
data: [DONE]
```

**GET /api/chat/history/{user_id}** Response:
```json
{
  "messages": [
    {"id": 1, "role": "user", "content": "今天该重点学什么？", "created_at": "..."},
    {"id": 2, "role": "assistant", "content": "...", "created_at": "..."}
  ]
}
```

## Risks / Trade-offs

- **[无 JWT 鉴权]**: 任何人都可调用 API 并伪造 user_id。后续迭代加入 token 验证后修复，当前通过前端 ProtectedRoute 做页面级保护。
- **[SQLite 写入并发]**: WAL 模式已启用，支持并发读写。单用户场景下无瓶颈。
- **[DeepSeek API 可用性]**: 依赖外部服务，需处理超时和错误（设计 30s 超时，失败时前端显示错误提示）。
- **[SSE 代理兼容性]**: 部分反向代理可能缓冲 SSE 响应。开发阶段直接连接 FastAPI，部署时注意配置（GitHub Pages 仅托管前端，后端需独立部署）。
