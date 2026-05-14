## 1. 数据与卡片组件（Data & ProjectCard）

- [x] 1.1 定义 Project 接口（name/description/image/githubUrl）并创建 `data/projects.ts`，包含 4 个项目的静态数据，截图使用 SVG placeholder
- [x] 1.2 创建 ProjectCard 组件：卡片容器（圆角 + 边框 + 背景）、截图区域（loading="lazy" + onError 回退）、项目名称、简介、GitHub 链接按钮（可选渲染）、暗色模式适配
- [x] 1.3 实现 hover 微特效：`hover:shadow-lg hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-cyan-700 transition-all duration-300`

## 2. 项目区布局（ProjectSection）

- [x] 2.1 创建 ProjectSection 组件：`id="projects"` 锚点、标题"我的项目"、响应式网格（1 列/2 列/3 列）、集成 ProjectCard
- [x] 2.2 处理边界情况：空项目列表显示"暂无项目展示"、githubUrl 缺失时不渲染链接按钮、截图 onError 显示占位符

## 3. 集成与验证（Integration & Verification）

- [x] 3.1 在 App.tsx 中将占位 `<section id="projects">` 替换为 `<ProjectSection />`，验证 Hero CTA 和导航栏"项目"链接均可平滑滚动到项目区
- [x] 3.2 端到端验证：桌面/平板/移动端网格布局、hover 特效正常、暗色模式适配、所有图片 lazy loading、GitHub 链接新标签页打开、TypeScript 编译零错误
