# CLAUDE.md — OpenSpec 工作流规则

## 核心纪律

1. **先读后做**：执行任何 OpenSpec 命令前，先读取：
   - openspec/config.yaml（项目约束）
   - openspec/specs/ 目录下相关域的规范（当前系统行为）
   - openspec/changes/ 当前活跃的变更（如果存在）

2. **不要猜测需求**：如果 spec 中没有明确定义某个行为，问我，不要自行补充。

3. **out-of-scope 是红线**：proposal.md 中标注为 out-of-scope 的功能，严禁实现。

## Apply 阶段规则

1. 每完成一个 tasks.md 中的 Phase，停下来。
2. 总结当前阶段的代码变更（改了什么文件、为什么这么改）。
3. 等待我 review 并确认后，再继续下一 Phase。
4. 如果发现实现偏差或与 spec 冲突，立即停止并说明问题。
5. 严禁一次性实现所有任务。

## 代码标准

- 所有组件使用 TypeScript + 函数式组件
- 样式全部使用 Tailwind CSS，禁止内联 style
- 支持暗色模式（dark: 前缀）
- 所有图片使用 lazy loading
- 组件文件名使用 PascalCase

## 复用优先

- 优先使用已有组件、hooks 和服务，避免重复造轮子
- 新建文件或模块前，先搜索项目中是否已有可复用的实现
- 不创建功能重复的 utility 函数或 helper

## 命名一致性

- OpenSpec change 使用 domain-based naming（如 `user-auth`、`ai-chat`），不用 feature-level naming（如 `add-sidebar`、`fix-layout`）
- Spec 按业务域组织目录（如 `ui/`、`auth/`、`ai/`），每个域下按 capability 命名 spec 文件
- React 组件用 PascalCase（已在上方约束）
- API 端点用 kebab-case（如 `/api/user-sessions`、`/api/chat-history`）
- 数据库表名用 snake_case（如 `user_sessions`、`chat_messages`）
