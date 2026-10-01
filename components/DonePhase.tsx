'use client'

import React, { useEffect } from 'react'

interface DonePhaseProps {
  title: string
  formatLabel: string
  downloadUrl: string
  onPreview: () => void
  onPullAnother: () => void
}

export function DonePhase({
  title,
  formatLabel,
  downloadUrl,
  onPreview,
  onPullAnother
}: DonePhaseProps) {
  // Listen for Enter key to trigger "pull another"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onPullAnother()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPullAnother])

  return (
    <div className="py-6 space-y-6 text-center font-mono">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xl font-bold">
          ✓
        </div>
        <h3 className="text-emerald-400 font-bold text-base sm:text-lg">
          stream pulled successfully!
        </h3>
        <p className="text-xs text-zinc-300 max-w-md truncate px-2" title={title}>
          {title}
        </p>
        <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
          format: {formatLabel}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <a
          href={downloadUrl}
          download
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded border border-zinc-600 transition-colors"
        >
          ⬇ download again
        </a>

        <button
          onClick={onPreview}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sky-400 font-mono text-xs rounded border border-zinc-600 transition-colors"
        >
          ▶ preview in player
        </button>

        <button
          onClick={onPullAnother}
          className="px-5 py-2 bg-white text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider rounded hover:bg-zinc-200 active:scale-98 transition-all shadow-md"
        >
          ↵ pull another
        </button>
      </div>
    </div>
  )
}
