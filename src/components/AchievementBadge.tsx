import type { ReactNode } from 'react'

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

interface AchievementBadgeProps {
  achievement: AchievementData
}

const ICON_SVGS: Record<string, ReactNode> = {
  star: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  fire: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  target: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  chat: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return iso.slice(0, 10)
  }
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const { name, description, icon, unlocked, unlocked_at } = achievement
  const IconComponent = ICON_SVGS[icon] || ICON_SVGS.star

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors
        ${unlocked
          ? 'bg-indigo-50 dark:bg-cyan-950/50'
          : 'bg-gray-50 dark:bg-gray-800/50'
        }`}
    >
      {/* Icon */}
      <span
        className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full
          ${unlocked
            ? 'text-indigo-600 dark:text-cyan-400 bg-indigo-100 dark:bg-cyan-900/50'
            : 'text-gray-400 dark:text-gray-600 bg-gray-200 dark:bg-gray-700'
          }`}
      >
        {IconComponent}
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate
            ${unlocked
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-500'
            }`}
        >
          {name}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
          {unlocked
            ? `已解锁 · ${formatDate(unlocked_at)}`
            : description
          }
        </p>
      </div>

      {/* Unlocked checkmark */}
      {unlocked && (
        <svg className="w-5 h-5 text-indigo-500 dark:text-cyan-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd" />
        </svg>
      )}
    </div>
  )
}
