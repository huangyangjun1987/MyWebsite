import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface User {
  id: number
  username: string
  avatar_url: string | null
  bio: string | null
  level: number
  consecutive_days: number
  created_at: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED !== 'false'
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  return res
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getAccessToken = () => localStorage.getItem('access_token')
  const getRefreshToken = () => localStorage.getItem('refresh_token')

  const refreshToken = useCallback(async (): Promise<string | null> => {
    const rt = getRefreshToken()
    if (!rt) return null
    try {
      const res = await apiFetch('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: rt }),
      })
      if (!res.ok) {
        logout()
        return null
      }
      const data = await res.json()
      localStorage.setItem('access_token', data.access_token)
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }
      return data.access_token
    } catch {
      return null
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }, [])

  useEffect(() => {
    if (!AUTH_ENABLED) {
      setIsLoading(false)
      return
    }

    async function initAuth() {
      const token = getAccessToken()
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const res = await apiFetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const newToken = await refreshToken()
          if (newToken) {
            const retry = await apiFetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${newToken}` },
            })
            if (retry.ok) {
              setUser(await retry.json())
            }
          }
        } else {
          setUser(await res.json())
        }
      } catch {
        // backend unreachable, leave user as null
      }
      setIsLoading(false)
    }

    initAuth()
  }, [refreshToken])

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Login failed')
    }
    const data = await res.json()
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    setUser(data.user)
  }, [])

  const register = useCallback(async (username: string, password: string) => {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Registration failed')
    }
    await login(username, password)
  }, [login])

  const isAuthenticated = AUTH_ENABLED ? !!user : true

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
