## 1. 导航栏组件（Navbar Component）

- [x] 1.1 创建 Navbar 组件：fixed top-0 定位、z-50 层级、左右两端布局（左侧姓名、右侧导航链接列表）、背景色半透明带 backdrop-blur、暗色模式适配（dark: 前缀）
- [x] 1.2 实现导航链接点击平滑滚动：点击链接时通过 id 查找目标元素 → `scrollIntoView({ behavior: 'smooth' })`，目标不存在时静默无操作
- [x] 1.3 实现 scroll 背景模糊效果：监听 window scroll 事件（passive），scrollY > 50px 时切换背景模糊状态，回到顶部时恢复透明

## 2. 主题切换迁移（ThemeToggle Migration）

- [x] 2.1 将 ThemeToggle 渲染到 Navbar 右侧（导航链接"联系我"之后），确保与导航链接在同一水平线对齐
- [x] 2.2 从 HeroSection.tsx 移除 ThemeToggle：删除 ThemeToggle 导入、JSX 中的 `absolute top-4 right-4 z-20` 容器及相关代码

## 3. 集成与验证（Integration & Verification）

- [x] 3.1 在 App.tsx 中集成 Navbar（放在 ThemeProvider 内、HeroSection 前），添加 `id="hero"` 到 HeroSection、添加 `id="contact"` 占位 section，验证导航链接可平滑滚动到各目标
- [x] 3.2 端到端验证：亮/暗模式切换正常、导航栏背景模糊在滚动时生效、移动端适配无溢出、组件卸载无 scroll listener 泄漏
