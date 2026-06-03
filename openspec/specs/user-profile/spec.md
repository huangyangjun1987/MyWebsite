# User Profile

## Purpose

用户资料管理 — 查看和编辑个人信息、每日签到、用户等级系统。

## Requirements

### Requirement: 用户资料页

系统 SHALL 在 `/dashboard/profile` 提供用户资料页，展示用户个人信息、学习统计和等级。

#### Scenario: 查看资料页

- **GIVEN** 用户已登录，导航至 `/dashboard/profile`
- **WHEN** 页面渲染
- **THEN** 显示用户头像（默认占位图或自定义 URL）、用户名、简介（bio）、当前等级、连续学习天数、注册日期

#### Scenario: 未登录访问资料页

- **GIVEN** 用户未登录
- **WHEN** 用户导航至 `/dashboard/profile`
- **THEN** 系统重定向至 `/login`

---

### Requirement: 编辑用户资料

系统 SHALL 提供资料编辑功能，允许用户更新 bio 和 avatar_url。

#### Scenario: 编辑简介

- **GIVEN** 用户在资料页
- **WHEN** 用户点击编辑按钮，修改 bio 字段（最长 200 字符），提交保存
- **THEN** 系统调用 `PATCH /api/auth/me`，成功后显示更新后的内容

#### Scenario: 修改头像 URL

- **GIVEN** 用户在编辑模式
- **WHEN** 用户输入新的 avatar_url 并保存
- **THEN** 头像更新为新的 URL 图片，若 URL 无效则显示默认占位图

#### Scenario: 编辑验证失败

- **GIVEN** 用户输入超过 200 字符的 bio
- **WHEN** 用户提交保存
- **THEN** 前端显示字符数超限错误提示，不发起 API 请求

---

### Requirement: 每日签到

系统 SHALL 提供 `PATCH /api/auth/checkin` 端点，支持用户每日签到并更新连续学习天数。

#### Scenario: 当天首次签到

- **GIVEN** 用户当天尚未签到
- **WHEN** 用户向 `/api/auth/checkin` 发送 PATCH 请求
- **THEN** 系统将 `consecutive_days` 加 1（若上次签到为昨天）或重置为 1（若中断），返回更新后的连续天数、等级和 `checked_in_today: true`

#### Scenario: 连续签到升级

- **GIVEN** 用户连续签到第 6 天，当前等级为 Lv.1
- **WHEN** 用户完成第 7 天签到
- **THEN** 连续天数更新为 7，`level` 更新为 2（学徒）

#### Scenario: 签到中断

- **GIVEN** 用户上次签到日期距今超过 1 天
- **WHEN** 用户再次签到
- **THEN** `consecutive_days` 重置为 1，等级按新连续天数重新计算

#### Scenario: 重复签到

- **GIVEN** 用户当天已完成签到
- **WHEN** 用户再次发送签到请求
- **THEN** 系统返回 409 `{"detail": "Already checked in today"}`

---

### Requirement: 用户等级

系统 SHALL 根据连续学习天数自动计算用户等级，并在用户信息和资料页中展示。

#### Scenario: 等级定义

- **GIVEN** 用户连续学习天数为 N
- **WHEN** 系统计算等级
- **THEN** 等级规则为：N 0-6 → Lv.1（新手），N 7-29 → Lv.2（学徒），N 30-89 → Lv.3（进阶者），N ≥90 → Lv.4（专家）

#### Scenario: 资料页展示等级

- **GIVEN** 用户当前为 Lv.2（学徒），连续学习 15 天
- **WHEN** 用户在资料页查看等级区域
- **THEN** 显示等级徽章"Lv.2 学徒"和进度条（距下一级还需 15 天）

---

### Requirement: Sidebar 用户信息区域

Sidebar 底部 SHALL 显示当前登录用户的头像缩略图、用户名，并提供退出登录按钮。

#### Scenario: 已登录时显示用户信息

- **GIVEN** 用户已登录，用户名"zhangsan"，avatar_url 为 null
- **WHEN** Sidebar 渲染
- **THEN** 底部显示默认头像占位图、用户名"zhangsan"，以及退出登录图标按钮

#### Scenario: 退出登录操作

- **GIVEN** 用户在 Dashboard 页面
- **WHEN** 用户点击 Sidebar 底部的退出登录按钮
- **THEN** 系统调用 `logout()`，清除 token，跳转至 `/login`
