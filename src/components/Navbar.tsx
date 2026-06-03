import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'

const NAV_LINKS = [
  { label: '首页', href: '#hero' },
  { label: '项目', href: '#projects' },
  { label: '联系我', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    function handleScroll() {
      setScrolled((prev) => window.scrollY > 50 ? true : window.scrollY < 10 ? false : prev)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter] duration-300
        ${scrolled
          ? 'bg-white/70 dark:bg-gray-950/70 backdrop-blur-md'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900 dark:text-white select-none">
          黄阳君
        </span>

        <div className="flex items-center gap-6">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400
                             transition-colors duration-200
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                             dark:focus-visible:ring-cyan-400 rounded"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              {!isLoading && (
                isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400
                               transition-colors duration-200
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                               dark:focus-visible:ring-cyan-400 rounded"
                  >
                    进入 Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400
                               transition-colors duration-200
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                               dark:focus-visible:ring-cyan-400 rounded"
                  >
                    登录
                  </Link>
                )
              )}
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
