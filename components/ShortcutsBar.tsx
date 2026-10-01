'use client'

import React from 'react'

export type AppPhaseName = 'input' | 'probing' | 'picking' | 'downloading' | 'done' | 'error'

interface ShortcutsBarProps {
  phase: AppPhaseName
}

const HINTS: Record<AppPhaseName, Array<[string, string]>> = {
  input: [
    ['↵', 'yoink'],
    ['cmd+v', 'paste']
  ],
  probing: [
    ['esc', 'cancel']
  ],
  picking: [
    ['↑↓', 'choose'],
    ['↵', 'yoink'],
    ['esc', 'back']
  ],
  downloading: [
    ['esc', 'cancel']
  ],
  done: [
    ['↵', 'yoink another']
  ],
  error: [
    ['↵', 'try again'],
    ['esc', 'reset']
  ]
}

export function ShortcutsBar({ phase }: ShortcutsBarProps) {
  const hints = HINTS[phase] || []

  return (
    <div className="flex items-center justify-center gap-3 pt-4 text-[11px] font-mono text-zinc-400 select-none">
      {hints.map(([key, action], idx) => (
        <span key={idx} className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">
            {key}
          </kbd>
          <span>{action}</span>
          {idx < hints.length - 1 && <span className="text-zinc-600 ml-1.5">·</span>}
        </span>
      ))}
    </div>
  )
}
