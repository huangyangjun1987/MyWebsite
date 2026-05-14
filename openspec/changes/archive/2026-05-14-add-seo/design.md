## Context

当前站点 `index.html` 仅包含最小化的 `<title>` 和 `<meta charset>`，缺少搜索引擎所需的关键 meta 标签和社交分享标签。`robots.txt` 不存在，`lang` 属性为 `en` 而非 `zh-CN`。本站部署在 GitHub Pages（`/my-website/`），需要让 Google 能正确索引。

## Goals / Non-Goals

**Goals:**
- 设置描述性 `<title>` 和 `<meta description>`
- 添加 Open Graph 和 Twitter Card 标签，使社交分享显示富媒体预览
- 将 `lang="en"` 修正为 `lang="zh-CN"`
- 添加 `robots.txt`，允许所有爬虫索引并声明 sitemap
- 审查并修正语义化 HTML 问题（heading 层级、landmark 标签）

**Non-Goals:**
- 不做 JSON-LD 结构化数据
- 不自动生成 sitemap.xml（手动引用 GitHub Pages 默认 sitemap 或后续处理）
- 不做 Google Search Console 验证

## Decisions

**1. Title 格式：`黄阳君 - 全栈开发工程师`**

将姓名和职业组合，既包含个人品牌名也包含关键搜索词。备选方案是仅用姓名或仅用职业——前者对搜索不友好，后者失去品牌属性。

**2. Social 标签：同时支持 Open Graph 和 Twitter Card**

Open Graph 是 Facebook/LinkedIn 等平台的标准，Twitter Card 是 Twitter/X 的标准。两者互补，只需在 `<head>` 中添加约 10 行标签，成本极低。Twitter 在缺少自有标签时会 fallback 到 OG 标签，但显式声明更可靠。

**3. OG 图片：使用 Vite 已有的 `public/favicon.svg` 或生成简单的文字 SVG**

目前没有合适的社交分享大图（推荐 1200×630）。先用 favicon.svg 作为 fallback，后续可替换为专门的 OG 图片。这比引入一个外部图片生成工具简单。

**4. robots.txt：全允许 + sitemap 引用**

```robots.txt
User-agent: *
Allow: /
Sitemap: https://<username>.github.io/my-website/sitemap.xml
```

允许所有爬虫，不做任何路径屏蔽。同时声明 sitemap URL 供搜索引擎发现。

**5. 语义化 HTML：在 App.tsx 中包裹 `<main>` landmark**

当前组件已使用 `<nav>`、`<section>`、`<h1>`/`<h2>`，结构基本合理。唯一的明显缺失是缺少 `<main>` landmark。在 App.tsx 的内容区外包裹 `<main>` 即可。

## Risks / Trade-offs

- robots.txt 中的 sitemap URL 需要与最终 GitHub Pages URL 一致 → 部署前确认 username 和 repo name
- OG 图片使用 SVG 可能不被所有平台支持 → 限制：LinkedIn 不支持 SVG 作为 OG 图片，但对目前阶段可接受（后续可替换为 PNG）
