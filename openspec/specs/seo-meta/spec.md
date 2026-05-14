# SEO Meta

## Purpose

HTML 元数据（title、description、Open Graph、Twitter Card），确保搜索引擎和社交平台正确解析页面内容。

## Requirements

### Requirement: 页面 Title 和 Description

系统 SHALL 在 HTML `<head>` 中提供描述性的 `<title>` 和 `<meta name="description">` 标签，使搜索引擎正确理解页面内容。

#### Scenario: Title 正确渲染

- **GIVEN** 用户访问站点任意页面
- **WHEN** 浏览器加载 HTML 文档
- **THEN** `<title>` 内容为 "黄阳君 - 全栈开发工程师"
- **AND** 浏览器标签页显示该标题

#### Scenario: Description 正确设置

- **GIVEN** 搜索引擎爬虫抓取页面
- **WHEN** 解析 `<meta name="description">`
- **THEN** content 属性包含对站长的简短中文描述（不超过 160 字符）
- **AND** 描述准确反映页面内容

#### Scenario: 缺少 Description 时的 fallback

- **GIVEN** `<meta name="description">` 标签存在但 content 为空
- **WHEN** Google 或社交媒体平台抓取页面
- **THEN** 平台从页面正文内容自动生成摘要
- **AND** 不显示空白或错误信息

### Requirement: Open Graph 社交分享标签

系统 SHALL 提供 Open Graph 标签，使 Facebook、LinkedIn 等平台分享链接时显示富媒体预览。

#### Scenario: Facebook 分享时显示预览

- **GIVEN** 用户在 Facebook 或 LinkedIn 中粘贴站点链接
- **WHEN** 平台抓取页面 HTML
- **THEN** 平台读取 `og:title` 作为分享标题
- **AND** 平台读取 `og:description` 作为分享描述
- **AND** 平台读取 `og:image` 作为分享缩略图
- **AND** `og:type` 为 `website`
- **AND** `og:url` 为站点完整 URL

#### Scenario: 缺少 OG 标签时的行为

- **GIVEN** `<meta property="og:image">` 指向的图片文件不存在
- **WHEN** 社交平台尝试加载 OG 图片
- **THEN** 平台显示默认的无图预览
- **AND** 文本标题和描述仍正常显示
- **AND** 不抛出控制台错误

### Requirement: Twitter Card 标签

系统 SHALL 提供 Twitter Card 标签，使 Twitter/X 平台分享链接时显示大图卡片。

#### Scenario: Twitter 分享时显示大图卡片

- **GIVEN** 用户在 Twitter/X 中粘贴站点链接
- **WHEN** 平台抓取页面 HTML
- **THEN** 平台读取 `twitter:card` 且值为 `summary_large_image`
- **AND** 平台读取 `twitter:title` 作为卡片标题
- **AND** 平台读取 `twitter:description` 作为卡片描述
- **AND** 平台读取 `twitter:image` 作为卡片大图

#### Scenario: Twitter 标签不存在时的 fallback

- **GIVEN** `<meta name="twitter:card">` 标签被意外删除
- **WHEN** Twitter 抓取页面
- **THEN** Twitter 使用 Open Graph 标签作为 fallback
- **AND** 分享卡片仍可正常显示（仅卡片尺寸可能不为大图）
