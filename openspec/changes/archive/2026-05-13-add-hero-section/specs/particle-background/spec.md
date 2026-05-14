## ADDED Requirements

### Requirement: Canvas 粒子背景渲染
系统 SHALL 在指定容器上叠加一个 Canvas 元素，渲染随机浮动粒子作为科技感背景装饰。

#### Scenario: 桌面端粒子渲染
- **GIVEN** 用户使用桌面浏览器访问站点
- **AND** 未启用 prefers-reduced-motion
- **WHEN** Canvas 组件挂载
- **THEN** Canvas 上渲染约 120 个粒子
- **AND** 每个粒子以随机速度缓慢浮动
- **AND** 距离小于阈值的相邻粒子之间绘制半透明连线
- **AND** Canvas 尺寸与父容器一致

#### Scenario: 移动端粒子降级
- **GIVEN** 用户使用移动设备（viewport ≤ 768px）
- **AND** 未启用 prefers-reduced-motion
- **WHEN** Canvas 组件挂载
- **THEN** Canvas 上渲染约 50 个粒子
- **AND** 粒子之间不绘制连线
- **AND** Canvas 尺寸与父容器一致

#### Scenario: 减弱动画偏好
- **GIVEN** 用户系统启用了 prefers-reduced-motion
- **WHEN** Canvas 组件挂载
- **THEN** Canvas 回退为隐藏状态
- **AND** 背景仅显示 CSS 静态渐变

### Requirement: 粒子色板适配主题
系统 SHALL 根据当前亮/暗模式切换粒子和连线的颜色。

#### Scenario: 暗色模式粒子色板
- **GIVEN** 当前主题为暗色模式（`<html class="dark">`）
- **WHEN** Canvas 动画循环运行
- **THEN** 粒子颜色使用青色系（`#22d3ee`）
- **AND** 连线颜色为半透明青（`rgba(34,211,238,0.10)`）

#### Scenario: 亮色模式粒子色板
- **GIVEN** 当前主题为亮色模式（`<html>` 无 `dark` class）
- **WHEN** Canvas 动画循环运行
- **THEN** 粒子颜色使用靛蓝色系（`#6366f1`）
- **AND** 连线颜色为半透明靛蓝（`rgba(99,102,241,0.12)`）

### Requirement: Canvas 性能与健壮性
系统 SHALL 在各种边界条件下保证 Canvas 不造成内存泄漏或白屏。

#### Scenario: Canvas 初始化失败回退
- **GIVEN** 浏览器不支持 Canvas API 或 Canvas 上下文获取失败
- **WHEN** Canvas 组件尝试初始化
- **THEN** 组件静默失败，Canvas 不渲染
- **AND** 背景回退为纯 CSS 渐变
- **AND** 不抛出未捕获异常

#### Scenario: 组件卸载清理
- **GIVEN** Canvas 动画循环正在运行
- **WHEN** 包含 Canvas 的父组件卸载
- **THEN** `requestAnimationFrame` 被取消
- **AND** window resize 事件监听器被移除
- **AND** 无内存泄漏

#### Scenario: 窗口 resize 响应
- **GIVEN** Canvas 当前正在渲染粒子
- **WHEN** 用户调整浏览器窗口大小
- **THEN** Canvas 尺寸在 200ms debounce 后重新适配
- **AND** 粒子坐标按新尺寸重新分布

#### Scenario: Retina 高 DPI 屏幕
- **GIVEN** 用户设备的 devicePixelRatio > 1
- **WHEN** Canvas 初始化
- **THEN** Canvas 内部按 devicePixelRatio 缩放（上限 2x）
- **AND** 粒子渲染清晰无模糊
