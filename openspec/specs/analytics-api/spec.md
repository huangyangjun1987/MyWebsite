# Analytics API

## Purpose

学习数据统计 API — FastAPI 端点，通过数据库聚合查询返回用户学习概览、趋势、日历、目标和成就数据。

## Requirements

### Requirement: 学习概览统计 API

系统 SHALL 提供 `GET /api/analytics/overview` 端点，返回当前已认证用户的学习概览统计数据。

#### Scenario: 成功获取概览

- **GIVEN** 用户已认证，且存在当日的 `learning_activities` 记录
- **WHEN** 客户端向 `/api/analytics/overview` 发送 GET 请求（带有效 Bearer token）
- **THEN** 系统返回 200，body 包含 `{"today_duration_minutes": 150, "goals_completed": 3, "goals_total": 4, "streak_days": 7, "streak_record": 21, "course_progress_pct": 68}`，数据来源于数据库聚合查询

#### Scenario: 当日无学习记录

- **GIVEN** 用户当日无 `learning_activities` 记录
- **WHEN** 客户端请求 `/api/analytics/overview`
- **THEN** 系统返回 200，其中 `today_duration_minutes` 和 `goals_completed` 为 0，`streak_days` 和 `streak_record` 从 `users` 表返回实际值

#### Scenario: 未认证请求

- **GIVEN** 请求头不含有效的 Authorization token
- **WHEN** 客户端向 `/api/analytics/overview` 发送 GET 请求
- **THEN** 系统返回 401 `{"detail": "Not authenticated"}`

### Requirement: 学习趋势数据 API

系统 SHALL 提供 `GET /api/analytics/trends` 端点，返回指定时间范围的学习时长趋势数据。

#### Scenario: 获取周趋势

- **GIVEN** 用户已认证，过去 7 天存在学习活动数据
- **WHEN** 客户端向 `/api/analytics/trends?type=weekly` 发送 GET 请求
- **THEN** 系统返回 200，body 包含 `{"type": "weekly", "data": [{"label": "周一", "value": 2.5}, ...]}`（7 个点），按日期升序排列，缺失的日期填充 value=0

#### Scenario: 获取月趋势

- **GIVEN** 用户已认证
- **WHEN** 客户端向 `/api/analytics/trends?type=monthly` 发送 GET 请求
- **THEN** 系统返回 200，body 包含 `{"type": "monthly", "data": [{"label": "1", "value": 1.5}, ...]}`（30 个点），X 轴标签为日期数字字符串

#### Scenario: type 参数无效

- **GIVEN** 用户已认证
- **WHEN** 客户端向 `/api/analytics/trends?type=invalid` 发送 GET 请求
- **THEN** 系统返回 422 `{"detail": "type must be 'weekly' or 'monthly'"}`

### Requirement: 学习日历数据 API

系统 SHALL 提供 `GET /api/analytics/calendar` 端点，返回指定月份的每日学习时长数据。

#### Scenario: 获取月度日历数据

- **GIVEN** 用户已认证，2026 年 6 月有部分天存在学习记录
- **WHEN** 客户端向 `/api/analytics/calendar?year=2026&month=6` 发送 GET 请求
- **THEN** 系统返回 200，body 包含 `{"year": 2026, "month": 6, "days": [{"date": "2026-06-01", "duration_minutes": 0}, {"date": "2026-06-02", "duration_minutes": 120}, ...]}`，涵盖当月所有日期

#### Scenario: 参数校验失败

- **GIVEN** 用户已认证
- **WHEN** 客户端向 `/api/analytics/calendar?year=2026&month=13` 发送 GET 请求
- **THEN** 系统返回 422 `{"detail": "month must be 1-12"}`

### Requirement: 今日目标列表 API

系统 SHALL 提供 `GET /api/analytics/goals` 端点，返回当前用户的当日目标列表。

#### Scenario: 成功获取目标列表

- **GIVEN** 用户已认证，存在当日目标记录
- **WHEN** 客户端向 `/api/analytics/goals` 发送 GET 请求
- **THEN** 系统返回 200，body 包含 `{"goals": [{"id": "1", "title": "...", "course": "...", "completed": false}, ...], "completed_count": 2, "total_count": 4}`

#### Scenario: 空目标列表

- **GIVEN** 用户当日无目标记录
- **WHEN** 客户端请求 `/api/analytics/goals`
- **THEN** 系统返回 200，body 为 `{"goals": [], "completed_count": 0, "total_count": 0}`

#### Scenario: 切换目标完成状态

- **GIVEN** 用户已认证，目标 ID 为 "1" 且当前未完成
- **WHEN** 客户端向 `/api/analytics/goals/1/toggle` 发送 PATCH 请求
- **THEN** 系统切换该目标的完成状态为 true，更新 `learning_activities.goals_completed` 计数，返回 200 `{"id": "1", "completed": true}`

### Requirement: 用户成就 API

系统 SHALL 提供 `GET /api/analytics/achievements` 端点，返回所有成就及当前用户的解锁状态。

#### Scenario: 获取成就列表

- **GIVEN** 用户已认证，已解锁部分成就
- **WHEN** 客户端向 `/api/analytics/achievements` 发送 GET 请求
- **THEN** 系统返回 200，body 包含 `{"achievements": [{"id": 1, "key": "first_checkin", "name": "初次签到", "description": "完成首次签到", "icon": "star", "category": "checkin", "unlocked": true, "unlocked_at": "2026-06-01T10:00:00Z"}, ...]}`
