'use client'

import React, { useEffect, useMemo, useState } from 'react'

const ART = [
  '█▀█ █ █▀█ █▀▀ █▀█ █▀█ █▀▄',
  '█▀▄ █ █▀▀ █   █ █ █▀▄ █ █',
  '▀ ▀ ▀ ▀   ▀▀▀ ▀▀▀ ▀ ▀ ▀▀▀',
]

const GRID = ART.map(line => [...line])
const ROWS = GRID.length
const COLS = GRID[0].length

const INTRO_MS = 900
const INTRO_SPREAD_MS = 550
const SWEEP_MS = 1000
const SWEEP_EVERY_MS = 6000
const TILT = 2
const HALF = 2.4

const LIGHTER: Record<string, string> = { '█': '▒', '▓': '░' }
const HALF_BLOCKS = new Set(['▀', '▄'])

const ease = (t: number) => 1 - Math.pow(1 - t, 3)

type Phase = 'intro' | 'idle' | 'sweep'

export function AsciiLogo({ isDark = true }: { isDark?: boolean }) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [phaseTime, setPhaseTime] = useState<number>(0)

  // Seeded per-column delays so glyphs resolve left-to-right with jitter
  const delays = useMemo(() => {
    return Array.from({ length: COLS }, (_, col) => {
      const prog = col / (COLS - 1)
      const jitter = ((col * 37) % 17) / 17
      return Math.round(prog * (INTRO_SPREAD_MS - 150) + jitter * 150)
    })
  }, [])

  useEffect(() => {
    let start = performance.now()
    let animationFrameId: number

    const tick = (now: number) => {
      const elapsed = now - start

      if (phase === 'intro') {
        setPhaseTime(elapsed)
        if (elapsed >= INTRO_MS) {
          setPhase('idle')
          start = performance.now()
        }
      } else if (phase === 'idle') {
        setPhaseTime(elapsed)
        if (elapsed >= SWEEP_EVERY_MS) {
          setPhase('sweep')
          start = performance.now()
        }
      } else if (phase === 'sweep') {
        setPhaseTime(elapsed)
        if (elapsed >= SWEEP_MS) {
          setPhase('idle')
          start = performance.now()
        }
      }

      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrameId)
  }, [phase])

  const primaryColor = isDark ? '#ffffff' : '#18181b'
  const grayColor = isDark ? '#71717a' : '#a1a1aa'
  const beamColor = isDark ? '#38bdf8' : '#0284c7' // subtle cyan glow on sweep

  function cellAt(ch: string, row: number, col: number) {
    if (ch === ' ' || phase === 'idle') {
      return { ch, color: primaryColor, opacity: 1 }
    }

    if (phase === 'intro') {
      const dt = phaseTime - delays[col]
      if (dt < 0) return { ch: ' ', color: primaryColor, opacity: 0 }
      if (dt < 110) return { ch: HALF_BLOCKS.has(ch) ? ch : '░', color: grayColor, opacity: 0.5 }
      if (dt < 220) return { ch: HALF_BLOCKS.has(ch) ? ch : '▒', color: grayColor, opacity: 0.8 }
      return { ch, color: primaryColor, opacity: 1 }
    }

    // sweep phase: beam tilts across like /
    const pMin = -TILT * ROWS - HALF
    const pMax = COLS + HALF
    const p = pMin + ease(Math.min(1, phaseTime / SWEEP_MS)) * (pMax - pMin)
    const d = Math.abs(col - (ROWS - 1 - row) * TILT - p)

    if (d <= HALF && 1 - d / HALF > 0.35) {
      if (HALF_BLOCKS.has(ch)) return { ch, color: beamColor, opacity: 0.8 }
      return { ch: LIGHTER[ch] ?? ch, color: beamColor, opacity: 1 }
    }

    return { ch, color: primaryColor, opacity: 1 }
  }

  return (
    <div className="flex flex-col items-center select-none font-mono text-center tracking-wider leading-none py-2">
      {GRID.map((row, r) => (
        <div key={r} className="whitespace-pre flex justify-center text-sm sm:text-base md:text-xl font-bold">
          {row.map((ch, c) => {
            const cell = cellAt(ch, r, c)
            return (
              <span
                key={c}
                style={{
                  color: cell.color,
                  opacity: cell.opacity,
                  transition: 'opacity 0.05s ease-out',
                }}
              >
                {cell.ch}
              </span>
            )
          })}
        </div>
      ))}
      <div className="mt-2 text-xs sm:text-sm font-mono tracking-widest uppercase opacity-75">
        pull the ripcord. grab any stream. done.
      </div>
    </div>
  )
}
