'use client'

import React, { useState, useEffect } from 'react'
import { detectPlatform, isProbablyUrl } from '@/lib/platforms'

interface InputPhaseProps {
  onPull: (url: string) => void
  disabled?: boolean
  initialUrl?: string
}

const SUPPORTED_SITES = [
  'YouTube',
  'X / Twitter',
  'Instagram',
  'TikTok',
  'Threads',
  'Reddit',
  'Vimeo',
  'Twitch',
  '1800+ more'
]

export function InputPhase({ onPull, disabled = false, initialUrl = '' }: InputPhaseProps) {
  const [url, setUrl] = useState(initialUrl)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl)
    }
  }, [initialUrl])

  const platform = url.trim() ? detectPlatform(url) : null
  const isValid = isProbablyUrl(url)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setUrl(text.trim())
        setError(null)
      }
    } catch {
      setError('Clipboard access was blocked. Please paste manually.')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      setError('Please paste or type a video link.')
      return
    }
    if (!isValid) {
      setError('Please enter a valid web link (starting with http:// or https://).')
      return
    }
    setError(null)
    onPull(url.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Input row */}
      <div className="relative flex flex-col gap-1.5">
        <label className="text-xs font-mono text-zinc-400 flex items-center justify-between">
          <span>{'>'} stream source:</span>
          {platform && platform.key !== 'unknown' && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-sky-400 border border-zinc-700">
              detected: <strong className="text-white">{platform.label}</strong>
            </span>
          )}
        </label>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={e => {
                setUrl(e.target.value)
                if (error) setError(null)
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={disabled}
              autoFocus
              className="w-full bg-zinc-950/80 border border-zinc-700/80 focus:border-sky-500 rounded px-3 py-2 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-white px-1"
                title="Clear input"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handlePaste}
            disabled={disabled}
            className="px-3 py-2 text-xs font-mono border border-zinc-700 hover:border-zinc-500 bg-zinc-800/60 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white transition-colors select-none"
            title="Paste from clipboard"
          >
            📋 paste
          </button>
        </div>

        {error && <span className="text-xs font-mono text-rose-400 mt-1">⚠ {error}</span>}
      </div>

      {/* Action button */}
      <div className="flex items-center justify-between pt-2">
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
          <span>supported:</span>
          <div className="flex flex-wrap gap-1">
            {SUPPORTED_SITES.map(s => (
              <span key={s} className="px-1.5 py-0.5 rounded bg-zinc-800/40 text-zinc-400 border border-zinc-800">
                {s}
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled || !url.trim()}
          className="ml-auto w-full sm:w-auto px-5 py-2.5 bg-white text-zinc-900 dark:bg-white dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider rounded hover:bg-zinc-200 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
        >
          Pull Ripcord ↵
        </button>
      </div>
    </form>
  )
}
