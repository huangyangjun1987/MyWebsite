import { useState, useCallback } from 'react'
import { useAnalytics, apiFetch } from '../hooks/useAnalytics'
import type { GoalItem } from '../data/dashboard'

interface GoalsApiResponse {
  goals: GoalItem[]
  completed_count: number
  total_count: number
}

export function DailyGoals() {
  const { data, loading, error, refetch } = useAnalytics<GoalsApiResponse>('/api/analytics/goals')
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  const goals = data?.goals ?? []
  const total = data?.total_count ?? goals.length
  const done = data?.completed_count ?? 0
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0

  const toggleGoal = useCallback(async (id: string) => {
    setTogglingIds((prev) => new Set(prev).add(id))
    try {
      await apiFetch(`/api/analytics/goals/${id}/toggle`, { method: 'PATCH' })
      refetch()
    } catch {
      // silently fail, user can retry
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }, [refetch])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-sm
        border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5">
            <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
              <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm
        border border-gray-100 dark:border-gray-700 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-3">目标数据加载失败</p>
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-sm
      border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        今日目标
      </h3>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-500 dark:text-gray-400">完成进度</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            已完成 {done}/{total}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 dark:bg-cyan-500 rounded-full transition-[width] duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Goal list */}
      {goals.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-600 text-sm py-4 text-center">
          今日暂无学习目标
        </p>
      ) : (
        <ul className="space-y-2">
          {goals.map((goal) => {
            const isDone = goal.completed
            const isToggling = togglingIds.has(goal.id)
            return (
              <li key={goal.id}>
                <button
                  onClick={() => toggleGoal(goal.id)}
                  disabled={isToggling}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    transition-colors duration-200 text-left
                    disabled:opacity-50"
                >
                  {/* Checkbox */}
                  <span className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                    transition-colors duration-200
                    ${isDone
                      ? 'bg-indigo-500 dark:bg-cyan-500 border-indigo-500 dark:border-cyan-500'
                      : 'border-gray-300 dark:border-gray-600'
                    }`}>
                    {isDone && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate
                      ${isDone
                        ? 'line-through text-gray-400 dark:text-gray-500'
                        : 'text-gray-900 dark:text-white'
                      }`}>
                      {goal.title || '--'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {goal.course}
                    </p>
                  </div>

                  {isToggling && (
                    <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
