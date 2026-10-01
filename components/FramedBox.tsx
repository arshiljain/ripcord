'use client'

import React, { ReactNode } from 'react'

interface FramedBoxProps {
  title?: string
  badge?: string
  children: ReactNode
  className?: string
}

export function FramedBox({ title, badge, children, className = '' }: FramedBoxProps) {
  return (
    <div
      className={`w-full max-w-2xl border border-zinc-700/80 dark:border-zinc-800 rounded-lg bg-zinc-900/90 dark:bg-[#18181b] shadow-2xl backdrop-blur-md overflow-hidden ${className}`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-800 bg-zinc-950/60 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          </div>
          {title && (
            <span className="text-xs font-mono text-zinc-400 font-medium ml-1">
              {title}
            </span>
          )}
        </div>
        {badge && (
          <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
            {badge}
          </span>
        )}
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  )
}
