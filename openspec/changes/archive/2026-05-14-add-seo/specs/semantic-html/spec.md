## ADDED Requirements

### Requirement: 正确的 lang 属性

系统 SHALL 在 `<html>` 标签上声明正确的语言属性为简体中文。

#### Scenario: lang 属性为 zh-CN

- **GIVEN** 用户或搜索引擎爬虫访问站点
- **WHEN** 解析 HTML 文档的根元素
- **THEN** `<html>` 标签的 `lang` 属性值为 `zh-CN`
- **AND** 屏幕阅读器使用中文语音引擎朗读内容

#### Scenario: lang 属性缺失或错误

- **GIVEN** `<html>` 标签没有 `lang` 属性或设为 `en`
- **WHEN** 屏幕阅读器或翻译工具解析页面
- **THEN** 可能使用错误的语言引擎（如英文语音朗读中文内容）
- **AND** 用户体验受损

### Requirement: 语义化 Landmark 标签

系统 SHALL 在页面中使用正确的 HTML5 landmark 标签，使辅助技术能够快速导航。

#### Scenario: 页面包含完整 landmark 结构

- **GIVEN** 用户使用屏幕阅读器访问站点
- **WHEN** 屏幕阅读器解析页面结构
- **THEN** 页面包含 `<nav>` landmark（导航栏）
- **AND** 页面包含 `<main>` landmark（主要内容区）
- **AND** 导航栏包裹在 `<nav>` 中，主要内容包裹在 `<main>` 中

#### Scenario: 缺少 `<main>` landmark 时的 fallback

- **GIVEN** 页面内容没有包裹在 `<main>` 标签中
- **WHEN** 屏幕阅读器用户使用 landmark 快捷键导航
- **THEN** 用户无法通过 landmark 跳转到主要内容区
- **AND** 必须逐行浏览内容才能定位到核心区域

### Requirement: 正确的 Heading 层级

系统 SHALL 确保页面 heading 标签层级连续，不跳级。

#### Scenario: Heading 层级合理

- **GIVEN** 页面包含多个 section 的标题
- **WHEN** 审查 heading 标签结构
- **THEN** 每个页面或 landmark 内只有一个 `<h1>`
- **AND** `<h2>` 用于各 Section 标题
- **AND** 不存在从 `<h1>` 直接跳到 `<h3>` 或 `<h4>` 的跳级情况

#### Scenario: 多个 h1 存在时的检测

- **GIVEN** 页面意外包含多个 `<h1>` 标签
- **WHEN** SEO 工具或 Lighthouse 审计页面
- **THEN** 审计报告显示 heading 层级警告
- **AND** 搜索引擎对页面结构的理解可能受影响
