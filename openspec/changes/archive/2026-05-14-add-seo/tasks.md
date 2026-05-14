## 1. SEO 元数据设置（index.html）

- [x] 1.1 修改 `<title>` 为 "黄阳君 - 全栈开发工程师"
- [x] 1.2 添加 `<meta name="description">` 标签（160 字符以内的中文简介）
- [x] 1.3 将 `<html lang="en">` 修正为 `<html lang="zh-CN">`

## 2. 社交分享标签（Open Graph + Twitter Card）

- [x] 2.1 添加 Open Graph 标签（og:title, og:description, og:image, og:url, og:type）
- [x] 2.2 添加 Twitter Card 标签（twitter:card, twitter:title, twitter:description, twitter:image）

## 3. robots.txt

- [x] 3.1 创建 `public/robots.txt`，声明 `User-agent: *` + `Allow: /` + Sitemap 引用

## 4. 语义化 HTML 审查与修正

- [x] 4.1 审查 App.tsx 和所有组件的 heading 层级，确保只有一个 h1、h2 不跳级
- [x] 4.2 在 App.tsx 中添加 `<main>` landmark 包裹核心内容区
- [x] 4.3 检查图片 `alt` 属性、链接 `aria-label` 等无障碍属性是否缺失

## 5. 验证

- [x] 5.1 使用 Lighthouse 审计 SEO 分数，目标 ≥ 90
- [x] 5.2 使用浏览器 DevTools 检查 `<head>` 中所有 meta 标签是否正确渲染
- [x] 5.3 验证 `robots.txt` 通过 `/robots.txt` 路径可访问
