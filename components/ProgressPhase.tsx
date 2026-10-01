'use client'

import React, { useEffect, useState } from 'react'
import { DownloadChoice } from '@/lib/choices'

interface ProgressPhaseProps {
  choice: DownloadChoice
  onCancel: () => void
}

export function ProgressPhase({ choice, onCancel }: ProgressPhaseProps) {
  const [percent, setPercent] = useState(12)
  const [stage, setStage] = useState('initializing download stream…')

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent(p => {
        if (p < 45) {
          setStage('downloading video stream…')
          return p + Math.floor(Math.random() * 5 + 3)
        }
        if (p < 80) {
          setStage('fetching audio stream…')
          return p + Math.floor(Math.random() * 4 + 2)
        }
        if (p < 95) {
          setStage('merging containers with ffmpeg…')
          return p + Math.floor(Math.random() * 2 + 1)
        }
        setStage('finalizing output file…')
        return 96
      })
    }, 400)

    return () => clearInterval(timer)
  }, [])

  // 24-character ASCII progress bar
  const BAR_LENGTH = 24
  const filled = Math.min(BAR_LENGTH, Math.round((percent / 100) * BAR_LENGTH))
  const empty = Math.max(0, BAR_LENGTH - filled)
  const asciiBar = '█'.repeat(filled) + '░'.repeat(empty)

  return (
    <div className="py-6 space-y-5 text-center font-mono">
      <div className="space-y-1">
        <span className="text-xs uppercase tracking-wider text-zinc-400">
          pulling: <strong className="text-white">{choice.label}</strong>
        </span>
        <div className="text-sky-400 text-sm font-semibold">{stage}</div>
      </div>

      {/* ASCII Progress Bar */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-base sm:text-lg tracking-widest text-sky-400">
          [{asciiBar}] <span className="text-white font-bold">{percent}%</span>
        </div>
        <div className="text-xs text-zinc-400 flex gap-4">
          <span>speed: ~4.2 MB/s</span>
          <span>eta: 00:04</span>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onCancel}
          className="px-3.5 py-1.5 text-xs font-mono border border-zinc-700 hover:border-zinc-500 rounded bg-zinc-800/40 text-zinc-400 hover:text-white transition-colors"
        >
          [esc] cancel
        </button>
      </div>
    </div>
  )
}
