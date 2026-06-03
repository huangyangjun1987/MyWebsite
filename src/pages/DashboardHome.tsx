import { StatsCards } from '../components/StatsCards'
import { DailyGoals } from '../components/DailyGoals'
import { TrendChart } from '../components/TrendChart'

export function DashboardHome() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        学习仪表盘
      </h1>

      <StatsCards />

      <DailyGoals />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart title="本周学习趋势" trendType="weekly" height={200} />
        <TrendChart title="本月学习趋势" trendType="monthly" height={200} />
      </div>
    </div>
  )
}
