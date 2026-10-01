'use client'

import React, { useEffect, useState } from 'react'

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const STATUS_STEPS = [
  'probing target url…',
  'fetching stream manifest…',
  'resolving audio & video codecs…',
  'scoring available resolutions…'
]

interface ProbingPhaseProps {
  url: string
  onCancel: () => void
}

export function ProbingPhase({ url, onCancel }: ProbingPhaseProps) {
  const [frameIndex, setFrameIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const spinnerTimer = setInterval(() => {
      setFrameIndex(i => (i + 1) % SPINNER_FRAMES.length)
    }, 80)

    const stepTimer = setInterval(() => {
      setStepIndex(i => (i < STATUS_STEPS.length - 1 ? i + 1 : i))
    }, 1800)

    return () => {
      clearInterval(spinnerTimer)
      clearInterval(stepTimer)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
      <div className="flex items-center gap-3 text-sky-400 font-mono text-xl sm:text-2xl font-bold">
        <span className="inline-block animate-pulse">{SPINNER_FRAMES[frameIndex]}</span>
        <span>{STATUS_STEPS[stepIndex]}</span>
      </div>

      <p className="text-xs font-mono text-zinc-400 max-w-md truncate px-4">
        target: <span className="text-zinc-300">{url}</span>
      </p>

      <div className="pt-4">
        <button
          onClick={onCancel}
          className="px-3.5 py-1.5 text-xs font-mono border border-zinc-700 hover:border-zinc-500 rounded bg-zinc-800/40 text-zinc-400 hover:text-white transition-colors"
        >
          [esc] cancel probe
        </button>
      </div>
    </div>
  )
}
