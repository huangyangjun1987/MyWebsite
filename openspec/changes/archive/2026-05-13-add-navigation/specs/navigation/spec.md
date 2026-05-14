## ADDED Requirements

### Requirement: 固定顶部导航栏
系统 SHALL 在页面顶部渲染一个固定导航栏，包含站点标识和导航链接。

#### Scenario: 桌面端导航栏渲染
- **GIVEN** 用户使用桌面浏览器访问站点
- **WHEN** 页面加载完成
- **THEN** 导航栏固定在视口顶部（position: fixed, top: 0）
- **AND** 左侧显示姓名"黄阳君"
- **AND** 右侧依次显示导航链接"首页"、"项目"、"联系我"
- **AND** 导航栏不遮挡 HeroSection 的可读内容

#### Scenario: 移动端导航栏渲染
- **GIVEN** 用户使用移动设备（viewport ≤ 768px）访问站点
- **WHEN** 页面加载完成
- **THEN** 导航栏固定在视口顶部
- **AND** 导航栏高度适配移动端
- **AND** 导航链接文字不溢出屏幕

### Requirement: 导航栏背景模糊效果
系统 SHALL 在用户向下滚动页面时，为导航栏添加背景模糊效果。

#### Scenario: 滚动超过阈值时显示模糊背景
- **GIVEN** 用户正在浏览页面顶部（scrollY = 0）
- **AND** 导航栏背景为透明
- **WHEN** 用户向下滚动超过 50px
- **THEN** 导航栏背景变为半透明并添加 backdrop-blur 效果
- **AND** 过渡过程无视觉闪烁

#### Scenario: 滚动回到顶部时恢复透明
- **GIVEN** 用户已向下滚动超过 50px
- **AND** 导航栏具有背景模糊效果
- **WHEN** 用户滚动回到顶部（scrollY < 10px）
- **THEN** 导航栏背景恢复为透明
- **AND** backdrop-blur 效果消失

### Requirement: 导航链接平滑滚动
系统 SHALL 在用户点击导航链接后，平滑滚动到对应的页面 section。

#### Scenario: 点击导航链接滚动到目标 section
- **GIVEN** 页面中存在对应 id 的目标 section
- **WHEN** 用户点击导航栏中的链接
- **THEN** 页面平滑滚动（behavior: smooth）到对应 section 顶部
- **AND** 滚动完成后导航链接状态不变

#### Scenario: 目标 section 不存在时点击链接
- **GIVEN** 页面中不存在对应 id 的目标 section
- **WHEN** 用户点击导航栏中的链接
- **THEN** 页面静默无操作
- **AND** 不抛出控制台错误

### Requirement: 导航栏 z-index 层级
系统 SHALL 确保导航栏在所有页面内容之上可见。

#### Scenario: 导航栏覆盖粒子背景
- **GIVEN** HeroSection 正在渲染 Canvas 粒子背景
- **WHEN** 页面加载完成
- **THEN** 导航栏渲染在粒子背景之上
- **AND** 导航栏不被粒子或任何页面元素遮挡
