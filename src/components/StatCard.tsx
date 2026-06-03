import type { ReactNode } from 'react'
import type { StatData } from '../data/dashboard'

interface StatCardProps {
  data: StatData
}

const ICON_MAP: Record<StatData['icon'], ReactNode> = {
  clock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  target: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  flame: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  book: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
}

export function StatCard({ data }: StatCardProps) {
  const displayValue = data.value != null ? String(data.value) : '--'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-sm
      border border-gray-100 dark:border-gray-700
      hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg
          bg-indigo-100 dark:bg-cyan-950
          text-indigo-600 dark:text-cyan-400">
          {ICON_MAP[data.icon]}
        </span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {data.label}
        </span>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {displayValue}
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500">
        {data.subtitle}
      </div>
    </div>
  )
}
