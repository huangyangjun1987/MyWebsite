import { useState } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'
import { AchievementBadge } from './AchievementBadge'

interface AchievementData {
  id: number
  key: string
  name: string
  description: string
  icon: string
  category: string
  unlocked: boolean
  unlocked_at: string | null
}

interface AchievementsApiResponse {
  achievements: AchievementData[]
}

const CATEGORY_LABELS: Record<string, string> = {
  checkin: '签到',
  duration: '学习时长',
  goals: '学习目标',
  chat: 'AI 对话',
}

export function AchievementPanel() {
  const { data, loading, error, refetch } = useAnalytics<AchievementsApiResponse>(
    '/api/analytics/achievements'
  )

  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  function toggleCategory(cat: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) {
        next.delete(cat)
      } else {
        next.add(cat)
      }
      return next
    })
  }

  const wrapperClasses =
    'bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-700'

  // Group by category
  const grouped = groupByCategory(data?.achievements ?? [])

  // Loading skeleton
  if (loading) {
    return (
      <div className={`${wrapperClasses} animate-pulse`}>
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-3">
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`${wrapperClasses} text-center py-4`}>
        <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">成就数据加载失败</p>
        <button
          onClick={refetch}
          className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-cyan-400
            bg-indigo-50 dark:bg-cyan-950 rounded-lg
            hover:bg-indigo-100 dark:hover:bg-cyan-900 transition-colors"
        >
          重试
        </button>
      </div>
    )
  }

  const categories = Object.keys(grouped)
  const totalCount = data?.achievements.length ?? 0
  const unlockedCount = data?.achievements.filter((a) => a.unlocked).length ?? 0

  return (
    <div className={wrapperClasses}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          成就
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {unlockedCount}/{totalCount}
        </span>
      </div>

      {/* Categories */}
      {categories.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-600 text-sm py-4 text-center">
          暂无成就
        </p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => {
            const achievements = grouped[cat]
            const catLabel = CATEGORY_LABELS[cat] || cat
            const isCollapsed = collapsedCategories.has(cat)
            const catUnlocked = achievements.filter((a) => a.unlocked).length

            return (
              <div key={cat}>
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center gap-2 mb-2 text-left
                    hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-1 py-0.5
                    transition-colors"
                >
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {catLabel}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-600">
                    {catUnlocked}/{achievements.length}
                  </span>
                  <svg
                    className={`w-3 h-3 ml-auto text-gray-400 dark:text-gray-500 transition-transform duration-200
                      ${isCollapsed ? '' : 'rotate-180'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Achievement list */}
                {!isCollapsed && (
                  <div className="space-y-1">
                    {achievements.map((a) => (
                      <AchievementBadge key={a.id} achievement={a} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function groupByCategory(achievements: AchievementData[]): Record<string, AchievementData[]> {
  const groups: Record<string, AchievementData[]> = {}
  for (const a of achievements) {
    if (!groups[a.category]) {
      groups[a.category] = []
    }
    groups[a.category].push(a)
  }
  return groups
}
