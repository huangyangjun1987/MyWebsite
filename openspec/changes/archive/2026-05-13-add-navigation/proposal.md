## Why

个人品牌站当前仅有 Hero Section 和占位项目区，缺少导航栏——访客无法直观了解站内有哪些内容，也无法在不同区域间快速跳转。导航栏是整个站点的基础 UI 骨架，需要在 Hero Section 之后优先落地。

## What Changes

- 新增固定顶部导航栏（sticky），左侧展示姓名/logo，右侧放置导航链接（首页、项目、联系我）
- 导航栏随页面滚动添加背景模糊效果（backdrop-blur），初始透明
- 点击导航链接平滑滚动到对应 section（#hero、#projects、#contact）
- 将 ThemeToggle 从 HeroSection 右上角迁移至导航栏右侧，作为导航栏的固定元素
- 在 App.tsx 中添加 `#contact` 占位 section，作为"联系我"锚点目标

## Out of Scope（严禁实现）

- 搜索功能
- 多级下拉菜单
- 用户登录和注册
- 汉堡菜单（移动端导航折叠）
- 导航链接的高亮（当前 section 指示/scroll spy）
- 导航栏入场/离场动画
- 联系我 Section 的具体内容实现（仅放置占位元素作为锚点目标）

## Capabilities

### New Capabilities

- `navigation`：固定顶部导航栏——布局、logo/姓名展示、导航链接、背景模糊效果、平滑滚动

### Modified Capabilities

- `theme`：ThemeToggle 从 HeroSection 右上角迁移至导航栏——变更"主题切换按钮位置"需求

## Impact

- **App.tsx**：引入 Navbar 组件，包裹在 ThemeProvider 内、HeroSection 外；将 `<div className="absolute top-4 right-4 z-20">` 包装的 ThemeToggle 移除（改为在 Navbar 中渲染）；新增 `#hero` id 给 HeroSection 供导航定位；新增 `#contact` 占位 section
- **HeroSection.tsx**：移除内部 ThemeToggle 渲染（ThemeToggle 导入和 JSX 中的 absolute 定位容器），HeroSection 不再负责主题切换按钮
- **新增文件**：`Navbar.tsx`
- **依赖**：无新增外部依赖
- **性能**：导航栏自身极轻量，不引入额外性能开销
