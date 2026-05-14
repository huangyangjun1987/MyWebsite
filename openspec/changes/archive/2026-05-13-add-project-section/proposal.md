## Why

个人品牌站的"项目"section 目前仅有一个占位元素。作为展示开发能力的关键区域，需要用真实项目卡片替换占位内容，让访客可以直观看到作品集——截图、名称、简介和 GitHub 链接。

## What Changes

- 替换现有 `#projects` 占位 section 为完整的项目展示区（ProjectSection）
- 项目以卡片网格布局展示，每张卡片包含：项目截图、名称、简介、GitHub 链接
- 最少展示 4 个项目
- 卡片支持 hover 微特效（阴影上浮 + 边框高亮）
- Hero Section 的 CTA 按钮继续指向 `#projects`（已存在的锚点行为，无需修改 HeroSection 代码）

## Out of Scope（严禁实现）

- 项目详情页（点击卡片不应导航到独立详情页）
- 项目搜索/筛选功能
- 卡片入场动画（如从下方淡入）
- GitHub API 调用、Star 数等动态数据
- 数据库或 CMS 后端

## Capabilities

### New Capabilities

- `project-section`：项目展示区——卡片网格布局、项目数据模型（截图/名称/简介/GitHub 链接）、hover 微特效、响应式网格

### Modified Capabilities

无（HeroSection CTA 已指向 `#projects`，新 ProjectSection 以 `id="projects"` 承接，无需修改 HeroSection spec）

## Impact

- **App.tsx**：将 `<section id="projects">` 占位元素替换为 `<ProjectSection />` 组件
- **新增文件**：`ProjectSection.tsx`、`ProjectCard.tsx`、`data/projects.ts`
- **新增资源**：4 个项目截图放入 `src/assets/projects/`（占位图片，后续替换为真实截图）
- **依赖**：无新增外部依赖
- **性能**：所有截图使用 `<img loading="lazy">`；不引入额外 JS 运行时开销
