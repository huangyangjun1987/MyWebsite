## Context

个人品牌站当前有 Hero、Navigation、Project Section、Particle Background 四个模块。本次新增"关于我"区域，位于 Hero Section 和 Project Section 之间。

## Goals / Non-Goals

**Goals:**
- 实现左右分栏的"关于我"区域：左侧照片、右侧简介文字
- 简介下方展示品牌标签
- 响应式适配：移动端上下堆叠布局
- 支持亮/暗双模式
- 所有图片 lazy loading

**Non-Goals:**
- 不做联系表单（out-of-scope）
- 不修改导航栏（后续变更处理）

## Decisions

**1. 布局方案：CSS Grid `grid-cols-1 md:grid-cols-2`**

选择 Grid 而非 Flexbox 的原因：Grid 在两栏布局中更简洁，`grid-cols-2` 天然保证左右等宽。Flexbox 也能实现相同效果，但 Grid 语义更清晰。

**2. 照片存放位置：`src/assets/`，通过 Vite import 使用**

使用 Vite 的静态资源 import 而非 `public/` 目录，以获得文件名哈希、构建优化和类型安全。照片作为组件 import 后传入 `<img>` 的 `src`，同时设置 `loading="lazy"`。

**3. 品牌标签实现：圆角 pill 样式**

品牌标签"赋范空间"使用带圆角的 pill/badge 组件，配合渐变背景或边框，与整体科技风格一致。

**4. 照片占位：灰色骨架屏**

照片加载前显示灰色骨架屏占位，避免布局抖动。使用 `bg-gray-200 dark:bg-gray-700 animate-pulse` 实现。

**5. 无需新增外部依赖**

全部使用已有技术栈（React + Tailwind CSS），不引入额外库。

## Risks / Trade-offs

- 照片文件大小可能影响首屏 → 图片使用 lazy loading + 响应式尺寸（WebP 格式优先），不影响首屏 Hero 渲染
- 移动端照片占比较大 → 移动端使用较小的照片容器，堆叠布局让文字优先可读
