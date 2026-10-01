'use client'

import React from 'react'

export type ThemeMode = 'dark' | 'light'

interface ThemeToggleProps {
  theme: ThemeMode
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      title="Toggle Dark / Light Mode"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border border-zinc-700 hover:border-zinc-500 rounded bg-zinc-800/40 hover:bg-zinc-800/80 transition-colors"
    >
      <span className="text-zinc-400">theme:</span>
      <span className="font-semibold">{theme}</span>
    </button>
  )
}
