import { DailyGoals } from '../components/DailyGoals'
import { TrendChart } from '../components/TrendChart'

export function LearningGoalsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        学习目标
      </h1>

      {/* Weekly completion rate mini chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart title="本周目标完成趋势" trendType="weekly" height={200} />
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-sm
          border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            月度统计
          </h3>
          <div className="space-y-4">
            <StatRow label="本月目标总数" value="--" />
            <StatRow label="本月已完成" value="--" />
            <StatRow label="完成率" value="--" />
            <StatRow label="连续达标天数" value="--" />
          </div>
        </div>
      </div>

      {/* Full daily goals */}
      <DailyGoals />
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  )
}
