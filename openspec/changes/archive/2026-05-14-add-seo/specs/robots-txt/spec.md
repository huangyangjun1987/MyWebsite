## ADDED Requirements

### Requirement: robots.txt 文件可访问

系统 SHALL 在站点根路径提供 `robots.txt` 文件，声明爬虫规则。

#### Scenario: robots.txt 可正常访问

- **GIVEN** 站点已部署到生产环境
- **WHEN** 爬虫请求 `https://<domain>/my-website/robots.txt`
- **THEN** 返回 HTTP 200
- **AND** Content-Type 为 `text/plain`
- **AND** 文件内容为 UTF-8 编码

#### Scenario: robots.txt 不存在时爬虫行为

- **GIVEN** `robots.txt` 文件被意外删除
- **WHEN** Googlebot 请求 `/robots.txt`
- **THEN** 返回 HTTP 404
- **AND** 爬虫默认允许抓取所有路径（无限制）

### Requirement: robots.txt 允许所有爬虫

系统 SHALL 在 robots.txt 中声明允许所有搜索引擎爬虫索引全部路径。

#### Scenario: Googlebot 读取 robots 规则

- **GIVEN** Googlebot 抓取 `robots.txt`
- **WHEN** 解析文件内容
- **THEN** `User-agent: *` 规则应用于所有爬虫
- **AND** `Allow: /` 允许抓取所有路径
- **AND** 不存在 `Disallow` 规则

#### Scenario: robots.txt 包含 Sitemap 声明

- **GIVEN** 搜索引擎爬虫读取 robots.txt
- **WHEN** 解析文件末尾
- **THEN** 文件中包含 `Sitemap:` 行
- **AND** sitemap URL 指向 GitHub Pages 上的 sitemap.xml 完整路径
- **AND** URL 格式合法（以 http:// 或 https:// 开头）
