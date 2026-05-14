## Context

当前 `#projects` 为一个纯占位 `<section>`，仅显示"项目展示区（即将推出）"。需要用含真实数据的项目卡片网格替换。HeroSection CTA 和 Navbar 的"项目"链接均已指向 `#projects`，新组件必须以 `id="projects"` 承接。

## Goals / Non-Goals

**Goals:**
- 卡片网格展示项目：截图、名称、简介、GitHub 链接
- 最少 4 个项目
- 响应式网格：mobile 1 列 / tablet 2 列 / desktop 3 列
- 卡片 hover 微特效：阴影上浮、边框高亮、轻微 translateY
- 所有图片 lazy loading

**Non-Goals:**
- 项目详情页（卡片不可点击导航）
- 搜索/筛选
- 动态数据源（使用静态数据文件）

## Decisions

### 1. 数据模型 → 静态 TypeScript 数组

```ts
interface Project {
  name: string
  description: string
  image: string
  githubUrl?: string
}
```

项目数据定义在 `data/projects.ts` 中，通过 `import` 引入。不依赖外部 API 或 CMS。

### 2. 组件拆分 → ProjectSection + ProjectCard

- `ProjectSection`：负责区段容器、标题、网格布局、`id="projects"` 锚点
- `ProjectCard`：单张卡片，接收 `Project` props，独立 hover 状态

拆分理由：卡片逻辑独立（hover 态、链接渲染），分离后易于单独测试和未来扩展。

### 3. 响应式网格 → CSS Grid + Tailwind

`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`。使用 CSS Grid 而非 Flexbox——固定列宽、对齐一致、不需要手动计算。

### 4. Hover 微特效 → Tailwind translate + shadow + border

```css
hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1
hover:border-indigo-300 dark:hover:border-cyan-700
transition-all duration-300
```

不使用 framer-motion 等动画库——仅 CSS transition 足够。`transition-all` 确保 shadow、transform、border 同步过渡。

### 5. 占位图片 → SVG placeholder

项目截图使用内联 SVG placeholder（灰色矩形 + 项目名称文字），避免网络请求和 404。后续用户可替换为真实 PNG/JPG 截图。

## Risks / Trade-offs

- **4 个项目截图暂缺** → 使用 SVG 占位图替代，显示项目名称首字母，视觉上不展示空白区域
- **GitHub 链接可选** → `githubUrl` 为 optional，未提供时不渲染链接按钮
- **hover 效果在触摸设备无效** → 不影响核心信息展示，仅在桌面端增强体验
