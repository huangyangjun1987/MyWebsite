import { useState, useEffect, useCallback, useRef } from 'react'
import { NavLink } from 'react-router'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'

const NAV_ITEMS = [
  { label: '学习数据', href: '/dashboard', icon: AnalyticsIcon },
  { label: 'AI 对话建议', href: '/dashboard/ai-chat', icon: AIChatIcon },
  { label: '学习目标', href: '/dashboard/goals', icon: GoalsIcon },
]

const COLLAPSE_KEY = 'sidebar-collapsed'

function getInitialCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === 'true'
  } catch {
    return false
  }
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(getInitialCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(COLLAPSE_KEY, String(next))
      } catch { /* ignore */ }
      return next
    })
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [menuOpen])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const sidebarWidth = collapsed ? 'w-16' : 'w-60'

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen((prev) => !prev)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg
          bg-white dark:bg-gray-800 shadow-md
          text-gray-700 dark:text-gray-300"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen
          ${sidebarWidth}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          flex flex-col
          transition-[width,transform] duration-300`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 px-3">
          {collapsed ? (
            <span className="text-lg font-bold text-indigo-600 dark:text-cyan-400">SP</span>
          ) : (
            <span className="text-lg font-bold text-gray-900 dark:text-white truncate">StudyPal</span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="flex flex-col gap-1 px-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  end={item.href === '/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${collapsed ? 'justify-center' : ''}
                    ${isActive
                      ? 'bg-indigo-50 dark:bg-cyan-950 text-indigo-600 dark:text-cyan-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <item.icon />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800">
          {/* User menu area */}
          {user && (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`w-full p-3 flex items-center gap-2
                  hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
                  ${collapsed ? 'justify-center' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <svg className="w-4 h-4 text-indigo-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                {!collapsed && (
                  <>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate flex-1 text-left">
                      {user.username}
                    </span>
                    <svg
                      className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <div className={`absolute bottom-full left-2 right-2 mb-1
                  bg-white dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  rounded-lg shadow-lg py-1 z-50
                  animate-[fadeIn_150ms_ease-out]`}>
                  <NavLink
                    to="/dashboard/profile"
                    onClick={() => { setMenuOpen(false); setMobileOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400
                      hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    个人资料
                  </NavLink>
                  <NavLink
                    to="/dashboard/settings"
                    onClick={() => { setMenuOpen(false); setMobileOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400
                      hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    设置
                  </NavLink>
                  <button
                    onClick={() => { setMenuOpen(false); logout() }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 dark:text-red-400
                      hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    退出登录
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom controls */}
          <div className="p-3 flex items-center gap-2">
            <div className={collapsed ? 'mx-auto' : ''}>
              <ThemeToggle />
            </div>
            {!collapsed && (
              <button
                onClick={toggleCollapsed}
                className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600
                  dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                  transition-colors"
                aria-label="Collapse sidebar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

function AnalyticsIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function AIChatIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}

function GoalsIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
}
