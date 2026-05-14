## Why

当前站点 SEO 基础薄弱：`<title>` 仅为"my-website"、缺少 meta description、无社交分享标签（Open Graph / Twitter Card）、`lang` 属性为英文而非中文、没有 robots.txt。这导致搜索引擎无法正确索引站点内容，社交分享时也无法显示富媒体预览。

## What Changes

- `index.html` 中设置正确的 `<title>`、`<meta description>`、Open Graph 和 Twitter Card 标签
- `index.html` 中将 `lang="en"` 修正为 `lang="zh-CN"`
- 审查现有组件的语义化 HTML 结构，确保正确使用 heading 层级、landmark 标签
- 在 `public/` 目录添加 `robots.txt`，允许 Google 爬虫索引
- 生成社交分享用的 OG 图片（可选，先用文字 fallback）

## Capabilities

### New Capabilities

- `seo-meta`: HTML 元数据（title、description、Open Graph、Twitter Card），确保搜索引擎和社交平台正确解析页面内容
- `robots-txt`: robots.txt 文件，声明爬虫规则，允许 Google 索引并指向 sitemap 位置
- `semantic-html`: 语义化 HTML 审查与修正，确保 heading 层级合理、landmark 标签正确使用、`lang` 属性准确

### Modified Capabilities

无（本次变更不修改现有 spec 的 REQUIREMENTS，仅改善 HTML 结构层面的语义）

## Impact

- 修改 `index.html`（title、meta 标签、lang 属性）
- 新增 `public/robots.txt`
- 可能微调组件中的 heading 层级或语义标签（如 `<main>`、`<article>` 等）
- 不影响现有功能，无 breaking changes
- **Out-of-scope**：结构化数据（JSON-LD / Schema.org）、sitemap.xml 自动生成、Google Search Console 验证
