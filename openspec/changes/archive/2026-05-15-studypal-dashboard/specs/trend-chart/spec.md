## ADDED Requirements

### Requirement: 周学习趋势图

系统 SHALL 在 Dashboard 首页展示过去 7 天学习时长的柱状图，使用纯 SVG 渲染。

#### Scenario: 正常渲染周趋势

- **GIVEN** Dashboard 首页加载完成
- **WHEN** mock 周趋势数据有效
- **THEN** 显示"本周学习趋势"区域，X 轴标注周一至周日，Y 轴标注时长刻度，柱状图使用纯 SVG 渲染

#### Scenario: 柱状图暗色模式

- **GIVEN** 周趋势图已渲染
- **WHEN** 用户切换至暗色模式
- **THEN** 柱子颜色和坐标轴标签色切换为暗色主题的语义色值

#### Scenario: 柱状图响应式

- **GIVEN** 周趋势图已渲染
- **WHEN** 视口宽度 < 640px
- **THEN** X 轴标签简化为单字缩写，图表宽度自适应容器

### Requirement: 月学习趋势图

系统 SHALL 在 Dashboard 首页展示过去 30 天学习时长的折线图，使用纯 SVG 渲染。

#### Scenario: 正常渲染月趋势

- **GIVEN** Dashboard 首页加载完成
- **WHEN** mock 月趋势数据有效
- **THEN** 显示"本月学习趋势"区域，X 轴每 5 天一个刻度，折线包含数据点圆点标记

#### Scenario: 错误：空趋势数据

- **GIVEN** mock 趋势数据为空数组
- **WHEN** 组件尝试渲染图表
- **THEN** 图表区域显示占位提示文案，不空白崩溃
