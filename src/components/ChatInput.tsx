import { useState, useRef, type KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const trimmed = input.trim()

  const handleSend = () => {
    if (!trimmed || disabled) return
    onSend(trimmed)
    setInput('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <div className="flex gap-3 max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的学习问题..."
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!trimmed || disabled}
          className="shrink-0 rounded-lg bg-indigo-500 dark:bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-600 dark:hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          发送
        </button>
      </div>
    </div>
  )
}
