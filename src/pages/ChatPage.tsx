import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ChatMessage } from '../components/ChatMessage'
import { ChatInput } from '../components/ChatInput'

interface Message {
  uid: number
  role: 'user' | 'assistant'
  content: string
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
let uidCounter = 0

export function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const sendingRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const isNearBottom = () => {
    const el = messagesContainerRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight < 100
  }

  useEffect(() => {
    if (!user) return
    fetch(`${API_BASE}/api/chat/history/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages.map((m: Record<string, unknown>) => ({
          uid: ++uidCounter,
          role: m.role as 'user' | 'assistant',
          content: m.content as string,
        })))
      })
      .catch(() => {})
      .finally(() => setHistoryLoaded(true))
  }, [user])

  useEffect(() => {
    if (historyLoaded && messages.length > 0) scrollToBottom()
  }, [historyLoaded])

  useEffect(() => {
    if (isNearBottom()) scrollToBottom()
  }, [messages])

  async function sendMessage(text: string) {
    if (!user || sendingRef.current) return
    sendingRef.current = true
    setError(null)
    setIsLoading(true)

    const userUid = ++uidCounter
    const aiUid = ++uidCounter
    setMessages((prev) => [
      ...prev,
      { uid: userUid, role: 'user', content: text },
      { uid: aiUid, role: 'assistant', content: '' },
    ])

    try {
      const res = await fetch(`${API_BASE}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, message: text }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: '发送失败' }))
        setError(err.detail || '发送失败，请稍后重试')
        setMessages((prev) => prev.filter((m) => m.uid !== userUid && m.uid !== aiUid))
        return
      }

      const data = await res.json() as { reply: string }
      setMessages((prev) =>
        prev.map((m) => (m.uid === aiUid ? { ...m, content: data.reply } : m))
      )
    } catch {
      setError('发送失败，请稍后重试')
      setMessages((prev) => prev.filter((m) => m.uid !== aiUid || m.content !== ''))
    } finally {
      setIsLoading(false)
      sendingRef.current = false
    }
  }

  const clearHistory = async () => {
    if (!user) return
    await fetch(`${API_BASE}/api/chat/history/${user.id}`, { method: 'DELETE' })
    setMessages([])
    setError(null)
  }

  const retry = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    if (lastUser) {
      setMessages((prev) => {
        const idx = prev.findLastIndex((m) => m.role === 'user')
        return prev.slice(0, idx + 1)
      })
      setError(null)
      sendMessage(lastUser.content)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {messages.length > 0 && (
        <div className="flex justify-end px-4 pt-3">
          <button
            onClick={clearHistory}
            className="text-xs text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            清空对话
          </button>
        </div>
      )}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {!historyLoaded ? (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 dark:border-cyan-500 border-t-transparent" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  你好！我是你的 AI 学习助手
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  有什么学习问题想问我吗？
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage key={msg.uid} role={msg.role} content={msg.content} />
            ))
          )}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2">
                <span>{error}</span>
                <button onClick={retry} className="underline hover:no-underline font-medium">重试</button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
