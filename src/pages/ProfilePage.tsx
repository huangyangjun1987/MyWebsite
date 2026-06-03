import { useState } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const LEVEL_LABELS: Record<number, string> = {
  1: '新手',
  2: '学徒',
  3: '进阶者',
  4: '专家',
}

const LEVEL_NEXT_DAYS: Record<number, number> = {
  1: 7,
  2: 30,
  3: 90,
  4: 0,
}

export function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(user?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [saving, setSaving] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [message, setMessage] = useState('')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const currentLevel = user?.level || 1
  const consecutiveDays = user?.consecutive_days || 0
  const nextLevelDays = LEVEL_NEXT_DAYS[currentLevel]
  const daysUntilNext = nextLevelDays ? nextLevelDays - consecutiveDays : 0

  function getLevelProgress(): number {
    if (currentLevel === 4) return 100
    const rangeStart = currentLevel === 1 ? 0 : currentLevel === 2 ? 7 : 30
    const rangeEnd = nextLevelDays
    return Math.min(100, Math.round(((consecutiveDays - rangeStart) / (rangeEnd - rangeStart)) * 100))
  }

  async function handleSave() {
    setSaving(true)
    setMessage('')
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio, avatar_url: avatarUrl || null }),
      })
      if (!res.ok) throw new Error('保存失败')
      await res.json()
      setEditing(false)
      setMessage('保存成功')
      // Refresh user in context via a page reload for simplicity
      setTimeout(() => window.location.reload(), 500)
    } catch {
      setMessage('保存失败，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  async function handleCheckin() {
    setCheckingIn(true)
    setMessage('')
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch(`${API_BASE}/api/auth/checkin`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || '签到失败')
      }
      const data = await res.json()
      setMessage(`签到成功！连续学习 ${data.consecutive_days} 天`)
      setTimeout(() => window.location.reload(), 800)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '签到失败')
    } finally {
      setCheckingIn(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">个人资料</h1>

      {message && (
        <div className="mb-4 text-sm rounded-lg px-3 py-2 bg-indigo-50 dark:bg-cyan-950/30 border border-indigo-200 dark:border-cyan-800 text-indigo-700 dark:text-cyan-300">
          {message}
        </div>
      )}

      {/* Avatar & username */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <svg className="w-8 h-8 text-indigo-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.username}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Lv.{currentLevel} {LEVEL_LABELS[currentLevel]}
          </span>
        </div>
      </div>

      {/* Level progress */}
      {nextLevelDays > 0 && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Lv.{currentLevel} {LEVEL_LABELS[currentLevel]}</span>
            <span>Lv.{currentLevel + 1} {LEVEL_LABELS[currentLevel + 1]}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-indigo-600 dark:bg-cyan-400 transition-all"
              style={{ width: `${getLevelProgress()}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            距下一级还需 {daysUntilNext} 天
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600 dark:text-cyan-400">{consecutiveDays}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">连续学习天数</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600 dark:text-cyan-400">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '--'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">注册日期</div>
        </div>
      </div>

      {/* Checkin button */}
      <button
        onClick={handleCheckin}
        disabled={checkingIn}
        className="mb-6 w-full rounded-lg bg-indigo-600 dark:bg-cyan-500 text-white font-medium py-2.5 hover:bg-indigo-700 dark:hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {checkingIn ? '签到中...' : '今日签到'}
      </button>

      {/* Bio editor */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">个人简介</h3>
          {!editing && (
            <button
              onClick={() => {
                setBio(user?.bio || '')
                setAvatarUrl(user?.avatar_url || '')
                setEditing(true)
              }}
              className="text-sm text-indigo-600 dark:text-cyan-400 hover:underline"
            >
              编辑
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                头像 URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-400 focus:outline-none text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                简介（最多 200 字）
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={200}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-400 focus:outline-none text-sm resize-none"
              />
              <span className="text-xs text-gray-400">{bio.length}/200</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-indigo-600 dark:bg-cyan-500 text-white font-medium px-4 py-2 text-sm hover:bg-indigo-700 dark:hover:bg-cyan-600 transition-colors disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {user?.bio || '暂无简介'}
          </p>
        )}
      </div>
    </div>
  )
}
