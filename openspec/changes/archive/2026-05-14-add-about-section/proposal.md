## Why

个人品牌站目前缺少"关于我"区域——访客无法了解站长的背景、经历和专业领域。添加此区域可以增强个人品牌的信任感，让访客在浏览项目之前快速建立认知。

## What Changes

- 新增"关于我"Section，采用左右分栏布局：左侧展示个人照片，右侧展示三段个人简介文字
- 简介下方展示品牌标签"赋范空间"
- 为 Section 添加 `id="about"` 锚点，供导航栏引用
- 所有图片使用 lazy loading，支持亮/暗双模式

## Capabilities

### New Capabilities

- `about-section`: "关于我"区域，包含个人照片、三段简介文字和品牌标签，支持亮/暗模式和响应式布局

### Modified Capabilities

<!-- 本次变更不修改任何现有 spec 的 REQUIREMENTS -->

无

## Impact

- 新增组件 `src/components/AboutSection.tsx`
- `src/App.tsx` 中引入 AboutSection 组件
- 可能需要新增一张个人照片资源（`src/assets/` 或 `public/` 目录）
- 不影响现有 Hero、Navigation、Project Section 的功能
- 导航栏暂不添加"关于"链接（由后续变更处理）
- **Out-of-scope**：联系我的表单
