import { useAnalytics } from '../hooks/useAnalytics'
import { StatCard } from './StatCard'
import type { StatData } from '../data/dashboard'

interface OverviewData {
  today_duration_minutes: number
  goals_completed: number
  goals_total: number
  streak_days: number
  streak_record: number
  course_progress_pct: number
}

function mapOverviewToStats(data: OverviewData): StatData[] {
  const hours = (data.today_duration_minutes / 60).toFixed(1)
  return [
    {
      label: '今日学习',
      value: `${hours}h`,
      subtitle: `累计 ${data.today_duration_minutes} 分钟`,
      icon: 'clock',
    },
    {
      label: '完成目标',
      value: data.goals_completed,
      subtitle: `共 ${data.goals_total} 个目标`,
      icon: 'target',
    },
    {
      label: '连续打卡',
      value: data.streak_days,
      subtitle: `最长 ${data.streak_record} 天`,
      icon: 'flame',
    },
    {
      label: '课程进度',
      value: `${data.course_progress_pct}%`,
      subtitle: '总体学习进度',
      icon: 'book',
    },
  ]
}

export function StatsCards() {
  const { data, loading, error, refetch } = useAnalytics<OverviewData>('/api/analytics/overview')

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-sm
              border border-gray-100 dark:border-gray-700 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm
        border border-gray-100 dark:border-gray-700 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-3">数据加载失败</p>
        <button
          onClick={refetch}
          className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-cyan-400
            bg-indigo-50 dark:bg-cyan-950 rounded-lg
            hover:bg-indigo-100 dark:hover:bg-cyan-900 transition-colors"
        >
          重试
        </button>
      </div>
    )
  }

  const stats = data ? mapOverviewToStats(data) : []

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} data={stat} />
      ))}
    </div>
  )
}
