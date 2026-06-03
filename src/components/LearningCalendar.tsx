import { useState, useCallback, useMemo } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'

interface CalendarDay {
  date: string
  duration_minutes: number
}

interface CalendarApiResponse {
  year: number
  month: number
  days: CalendarDay[]
}

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日']

function getColorClass(minutes: number): string {
  if (minutes <= 0) {
    return 'bg-gray-100 dark:bg-gray-800'
  }
  if (minutes <= 30) {
    return 'bg-indigo-200 dark:bg-indigo-900'
  }
  if (minutes <= 120) {
    return 'bg-indigo-400 dark:bg-indigo-600'
  }
  return 'bg-indigo-600 dark:bg-indigo-400'
}

function formatDuration(minutes: number): string {
  if (minutes <= 0) return '无记录'
  if (minutes < 60) return `${minutes} 分钟`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} 小时 ${m} 分钟` : `${h} 小时`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

export function LearningCalendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1) // 1-indexed
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null)

  const { data, loading, error, refetch } = useAnalytics<CalendarApiResponse>(
    `/api/analytics/calendar?year=${year}&month=${month}`
  )

  const canGoNext = useMemo(() => {
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    return year < currentYear || (year === currentYear && month < currentMonth)
  }, [year, month, now])

  const goPrev = useCallback(() => {
    if (month === 1) {
      setYear((y) => y - 1)
      setMonth(12)
    } else {
      setMonth((m) => m - 1)
    }
  }, [month])

  const goNext = useCallback(() => {
    if (!canGoNext) return
    if (month === 12) {
      setYear((y) => y + 1)
      setMonth(1)
    } else {
      setMonth((m) => m + 1)
    }
  }, [month, canGoNext])

  // Build calendar grid: 7 rows × N columns
  const grid = useMemo(() => {
    if (!data?.days) return null

    const days = data.days
    const firstDate = new Date(days[0].date + 'T00:00:00')
    // getDay() returns 0=Sun, 1=Mon, ..., convert to 0=Mon format
    let startDow = firstDate.getDay() - 1
    if (startDow < 0) startDow = 6

    const totalCells = startDow + days.length
    const numCols = Math.ceil(totalCells / 7)
    const cells: (CalendarDay | null)[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: numCols }, () => null)
    )

    // Fill in blanks before first day
    for (let i = 0; i < startDow; i++) {
      cells[i][0] = null
    }

    // Fill in days
    days.forEach((day, idx) => {
      const pos = startDow + idx
      const row = pos % 7
      const col = Math.floor(pos / 7)
      cells[row][col] = day
    })

    return cells
  }, [data])

  const wrapperClasses = 'bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-700'

  // Loading skeleton
  if (loading) {
    return (
      <div className={`${wrapperClasses} animate-pulse`}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex-1 grid grid-cols-7 gap-1">
            {Array.from({ length: 7 * 5 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
          <div className="w-8 flex flex-col gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`${wrapperClasses} text-center py-6`}>
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

  const monthLabel = `${year} 年 ${month} 月`

  return (
    <div className={wrapperClasses}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {monthLabel}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={goPrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg
              text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors"
            aria-label="上个月"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            disabled={!canGoNext}
            className={`w-8 h-8 flex items-center justify-center rounded-lg
              transition-colors
              ${canGoNext
                ? 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
              }`}
            aria-label="下个月"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6">
        {/* Grid */}
        <div className="flex-1">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-center text-[10px] sm:text-xs text-gray-400 dark:text-gray-500"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          {grid && (
            <div className="grid grid-cols-7 gap-1">
              {grid[0]?.map((_, colIdx) =>
                Array.from({ length: 7 }, (_, rowIdx) => {
                  const cell = grid[rowIdx]?.[colIdx]
                  if (!cell) {
                    return <div key={`${colIdx}-${rowIdx}`} className="aspect-square" />
                  }
                  return (
                    <div
                      key={cell.date}
                      className={`aspect-square rounded-sm cursor-pointer
                        transition-colors duration-150
                        hover:ring-2 hover:ring-indigo-400 dark:hover:ring-cyan-400 hover:ring-offset-1
                        ${getColorClass(cell.duration_minutes)}`}
                      onMouseEnter={() => setHoveredDay(cell)}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={`${formatDate(cell.date)}: ${formatDuration(cell.duration_minutes)}`}
                    />
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-col items-center gap-0.5 pt-5">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">时长</span>
          <div className={`w-3 h-3 rounded-sm ${getColorClass(0)}`} title="无记录" />
          <div className={`w-3 h-3 rounded-sm ${getColorClass(15)}`} title="1-30 分钟" />
          <div className={`w-3 h-3 rounded-sm ${getColorClass(60)}`} title="31-120 分钟" />
          <div className={`w-3 h-3 rounded-sm ${getColorClass(150)}`} title=">120 分钟" />
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredDay && (
        <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          {formatDate(hoveredDay.date)} — {formatDuration(hoveredDay.duration_minutes)}
        </div>
      )}
    </div>
  )
}
