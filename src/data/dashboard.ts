export interface StatData {
  label: string
  value: string | number
  subtitle: string
  icon: 'clock' | 'target' | 'flame' | 'book'
}

export interface GoalItem {
  id: string
  title: string
  course: string
  completed: boolean
}

export interface TrendPoint {
  label: string
  value: number
}

export const mockStats: StatData[] = [
  { label: '今日学习', value: '2.5h', subtitle: '较昨日 +12%', icon: 'clock' },
  { label: '完成目标', value: 3, subtitle: '共 4 个目标', icon: 'target' },
  { label: '连续打卡', value: 7, subtitle: '最长 21 天', icon: 'flame' },
  { label: '课程进度', value: '68%', subtitle: '3/5 门课程', icon: 'book' },
]

export const mockDailyGoals: GoalItem[] = [
  { id: '1', title: '完成 React 19 新特性学习', course: 'React 进阶', completed: true },
  { id: '2', title: '阅读 Tailwind CSS v4 文档', course: 'CSS 工程化', completed: true },
  { id: '3', title: '完成算法练习 3 题', course: '数据结构与算法', completed: false },
  { id: '4', title: '整理 Notion 学习笔记', course: '学习方法论', completed: false },
]

export const mockWeeklyTrend: TrendPoint[] = [
  { label: '周一', value: 2.5 },
  { label: '周二', value: 3.0 },
  { label: '周三', value: 1.5 },
  { label: '周四', value: 4.0 },
  { label: '周五', value: 2.0 },
  { label: '周六', value: 5.0 },
  { label: '周日', value: 3.5 },
]

export const mockMonthlyTrend: TrendPoint[] = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  value: Math.round((Math.random() * 4 + 1) * 10) / 10,
}))
