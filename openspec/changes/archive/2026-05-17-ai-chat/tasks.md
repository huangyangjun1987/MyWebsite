## 1. Backend — 数据模型与配置

- [x] 1.1 创建 `backend/models/chat.py`，定义 `ChatMessage` SQLAlchemy 模型（id, user_id, role, content, created_at）
- [x] 1.2 在 `backend/models/__init__.py` 中导出 `ChatMessage`
- [x] 1.3 在 `backend/config.py` 中添加 `CHAT_MAX_MESSAGE_LENGTH`（默认 4000）和 `CHAT_TIMEOUT_SECONDS`（默认 30）配置项

**Verify**: 启动后端（`uvicorn main:app`），确认 `chat_messages` 表自动创建；访问 `GET /chat/history/1` 不应 404

## 2. Backend — DeepSeek 服务层

- [x] 2.1 创建 `backend/services/deepseek.py`，实现 `stream_deepseek(prompt: str, system_prompt: str) -> AsyncGenerator[str, None]`，使用 httpx 异步客户端调用 DeepSeek `/v1/chat/completions`（stream: true），逐 chunk yield delta content
- [x] 2.2 创建 `backend/services/chat.py`，实现：
  - `save_message(db, user_id, role, content)` — 保存消息到 chat_messages 表
  - `get_history(db, user_id) -> list[dict]` — 按 created_at 升序查询用户历史
  - `build_system_prompt(db, user_id) -> str` — 查询用户学习数据（User 模型中的 level、consecutive_days、bio），拼接为 DeepSeek system prompt 文本

**Verify**: 编写临时测试脚本或使用 `python -c` 调用 `build_system_prompt`，确认返回正确的 system prompt 文本；调用 `stream_deepseek` 确认可以流式获取 DeepSeek 回复

## 3. Backend — API 端点

- [x] 3.1 创建 `backend/routers/chat.py`，实现 `POST /api/chat/send`：
  - 接收 `{user_id, message}` JSON body，校验 message 非空（1-4000 字符）
  - 调用 `save_message(db, user_id, "user", message)` 保存用户消息
  - 调用 `build_system_prompt` 构建上下文
  - 调用 `stream_deepseek` 获取流式回复
  - 使用 `sse-starlette` 的 `EventSourceResponse` 返回 SSE 流，每个 chunk 为 `{"content": "..."}`，结束发送 `[DONE]`
  - 流结束后调用 `save_message(db, user_id, "assistant", full_content)` 保存完整 AI 回复
- [x] 3.2 创建 `GET /api/chat/history/{user_id}` 端点，校验 user_id 为整数，返回 `{"messages": [...]}`
- [x] 3.3 在 `backend/main.py` 中注册 `chat_router`（`app.include_router(chat_router)`）

**Verify**: 使用 curl 测试：
- `curl -X POST http://localhost:8000/api/chat/send -H "Content-Type: application/json" -d '{"user_id":1,"message":"你好"}'` 应返回 SSE 流
- `curl http://localhost:8000/api/chat/history/1` 应返回 JSON（可能为空数组）

## 4. Frontend — 聊天页面组件

- [x] 4.1 安装前端依赖 `react-markdown`
- [x] 4.2 创建 `src/components/ChatMessage.tsx`，接收 `role`（user/assistant）和 `content`（string），用户消息右对齐灰底，AI 消息左对齐，使用 `react-markdown` 渲染 AI 消息 content
- [x] 4.3 创建 `src/components/ChatInput.tsx`，包含 textarea 输入框和发送按钮，支持 Enter 发送（Shift+Enter 换行），发送后清空输入框，发送按钮在输入为空时禁用
- [x] 4.4 创建 `src/pages/ChatPage.tsx`，实现：
  - 页面挂载时调用 `GET /api/chat/history/{user_id}` 加载历史消息
  - 发送消息时：追加用户消息到列表 → 创建空的 AI 消息占位 → 通过 `fetch` + `ReadableStream` 消费 POST `/api/chat/send` 的 SSE 响应 → 逐 chunk 更新 AI 消息 content → 收到 `[DONE]` 后标记完成
  - 自动滚动：新消息到达时 `scrollIntoView`（用户向上滚动查看历史时不强制滚动）
  - 空状态：无历史消息时显示"你好！我是你的 AI 学习助手，有什么学习问题想问我吗？"
  - Loading 状态：等待 AI 首个 chunk 超过 500ms 时显示加载指示器
  - 错误处理：网络异常或 API 错误时显示"发送失败，请稍后重试"
  - 从 AuthContext 读取当前用户的 `user.id` 作为 `user_id`

**Verify**: 浏览器访问 `http://localhost:5173/#/dashboard/ai-chat`（确保后端运行），测试发送消息 → 看到流式 AI 回复 → 刷新页面 → 历史消息恢复

## 5. Frontend — 路由集成

- [x] 5.1 在 `src/App.tsx` 中导入 `ChatPage`，将 `/dashboard/ai-chat` 路由从 `PlaceholderPage` 替换为 `<ChatPage />`
- [x] 5.2 端到端验证：从侧边栏点击"AI 助手"导航项 → 进入聊天页面 → 发送多条消息 → 确认 AI 回复内容正确且为流式渲染 → 刷新页面确认历史保留 → 切换亮/暗模式确认样式正常

**Verify**: 完整用户流程无报错；消息发送和接收正常；历史持久化正常；暗色模式适配
