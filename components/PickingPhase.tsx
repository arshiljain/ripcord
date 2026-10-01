'use client'

import React, { useState, useEffect } from 'react'
import { ProbeResult } from '@/lib/ytdlp-server'
import { DownloadChoice } from '@/lib/choices'
import { formatDuration } from '@/lib/format'

interface PickingPhaseProps {
  probe: ProbeResult
  onSelectChoice: (choice: DownloadChoice) => void
  onPreview: () => void
  onBack: () => void
}

export function PickingPhase({ probe, onSelectChoice, onPreview, onBack }: PickingPhaseProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Keyboard navigation support: Up, Down, Enter, Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % probe.choices.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + probe.choices.length) % probe.choices.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        onSelectChoice(probe.choices[selectedIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [probe.choices, selectedIndex, onSelectChoice, onBack])

  return (
    <div className="space-y-5">
      {/* Media Details Card */}
      <div className="flex flex-col sm:flex-row gap-4 p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg">
        {probe.thumbnail && (
          <div className="relative shrink-0 w-full sm:w-40 aspect-video rounded overflow-hidden bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={probe.thumbnail}
              alt={probe.title}
              className="w-full h-full object-cover"
              onError={e => {
                // Hide broken images gracefully
                (e.target as HTMLElement).style.display = 'none'
              }}
            />
            {probe.duration > 0 && (
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                {formatDuration(probe.duration)}
              </span>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-sky-400 border border-zinc-700">
                {probe.platform.label}
              </span>
              <span className="text-xs font-mono text-zinc-400 truncate">
                {probe.uploader}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-mono font-bold text-white line-clamp-2" title={probe.title}>
              {probe.title}
            </h3>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onPreview}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border border-zinc-700 hover:border-zinc-500 rounded bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 transition-colors"
            >
              <span>▶</span> preview stream
            </button>
          </div>
        </div>
      </div>

      {/* Format Options List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            select quality / format:
          </span>
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
            navigate with [↑ / ↓]
          </span>
        </div>

        <div className="space-y-1.5">
          {probe.choices.map((choice, index) => {
            const isSelected = index === selectedIndex
            return (
              <div
                key={choice.id}
                onClick={() => setSelectedIndex(index)}
                onDoubleClick={() => onSelectChoice(choice)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded border font-mono text-xs cursor-pointer select-none transition-all ${
                  isSelected
                    ? 'bg-zinc-800/90 border-sky-500 text-white shadow-sm'
                    : 'bg-zinc-950/40 border-zinc-800/90 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-sm ${isSelected ? 'text-sky-400 font-bold' : 'text-zinc-600'}`}>
                    {isSelected ? '❯' : ' '}
                  </span>
                  <span className="text-xs">
                    {choice.kind === 'audio' ? '♪' : '▶'}
                  </span>
                  <span className={`font-medium ${isSelected ? 'text-white' : ''}`}>
                    {choice.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      selected
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
        <button
          onClick={onBack}
          className="px-3 py-1.5 text-xs font-mono border border-zinc-700 hover:border-zinc-500 rounded bg-zinc-800/40 text-zinc-400 hover:text-white transition-colors"
        >
          [esc] back
        </button>

        <button
          onClick={() => onSelectChoice(probe.choices[selectedIndex])}
          className="px-5 py-2 bg-white text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider rounded hover:bg-zinc-200 active:scale-98 transition-all shadow-md"
        >
          Pull Ripcord ↵
        </button>
      </div>
    </div>
  )
}
