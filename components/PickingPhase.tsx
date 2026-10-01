'use client'

import React, { useState, useEffect } from 'react'
import { ProbeResult } from '@/lib/ytdlp-server'
import { DownloadChoice } from '@/lib/choices'
import { formatDuration } from '@/lib/format'

interface PickingPhaseProps {
  probe: ProbeResult
  onSelectChoice: (choice: DownloadChoice, trimStart?: string, trimEnd?: string) => void
  onPreview: () => void
  onBack: () => void
}

export function PickingPhase({ probe, onSelectChoice, onPreview, onBack }: PickingPhaseProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copiedStream, setCopiedStream] = useState(false)
  const [showTrimmer, setShowTrimmer] = useState(false)
  const [trimStart, setTrimStart] = useState('')
  const [trimEnd, setTrimEnd] = useState('')

  // Keyboard navigation support: Up, Down, Enter, Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in trim inputs
      if ((e.target as HTMLElement).tagName === 'INPUT') return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % probe.choices.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + probe.choices.length) % probe.choices.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        onSelectChoice(probe.choices[selectedIndex], trimStart || undefined, trimEnd || undefined)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [probe.choices, selectedIndex, onSelectChoice, onBack, trimStart, trimEnd])

  const handleCopyStream = async () => {
    try {
      const res = await fetch(`/api/stream?url=${encodeURIComponent(probe.webpage_url)}`)
      const data = await res.json()
      if (data.success && data.streamUrl) {
        await navigator.clipboard.writeText(data.streamUrl)
        setCopiedStream(true)
        setTimeout(() => setCopiedStream(false), 2500)
      } else {
        alert(data.error || 'Could not fetch stream URL')
      }
    } catch {
      alert('Failed to copy stream link.')
    }
  }

  const handleDownloadThumbnail = () => {
    if (!probe.thumbnail) return
    window.open(probe.thumbnail, '_blank')
  }

  return (
    <div className="space-y-5">
      {/* Media Details Card */}
      <div className="flex flex-col sm:flex-row gap-4 p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg">
        {probe.thumbnail && (
          <div className="relative shrink-0 w-full sm:w-40 aspect-video rounded overflow-hidden bg-zinc-800 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={probe.thumbnail}
              alt={probe.title}
              className="w-full h-full object-cover"
              onError={e => {
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

          {/* Quick Action Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={onPreview}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border border-zinc-700 hover:border-zinc-500 rounded bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 transition-colors"
            >
              <span>▶</span> preview stream
            </button>

            {probe.thumbnail && (
              <button
                onClick={handleDownloadThumbnail}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono border border-zinc-700 hover:border-zinc-500 rounded bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 transition-colors"
                title="Download high-resolution thumbnail"
              >
                <span>🖼️</span> HD cover
              </button>
            )}

            <button
              onClick={handleCopyStream}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono border border-zinc-700 hover:border-zinc-500 rounded bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 transition-colors"
              title="Copy direct stream link"
            >
              <span>{copiedStream ? '✓ copied!' : '🔗 copy link'}</span>
            </button>

            <button
              onClick={() => setShowTrimmer(!showTrimmer)}
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-mono border rounded transition-colors ${
                showTrimmer
                  ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                  : 'border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300'
              }`}
              title="Clip video section"
            >
              <span>✂ trim clip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Timestamp Trimmer Bar */}
      {showTrimmer && (
        <div className="p-3 bg-zinc-950/80 border border-sky-500/40 rounded-lg flex flex-col sm:flex-row items-center gap-3 text-xs font-mono">
          <span className="text-sky-400 font-bold">✂ clip section:</span>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">start:</span>
            <input
              type="text"
              placeholder="00:00"
              value={trimStart}
              onChange={e => setTrimStart(e.target.value)}
              className="w-20 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-center text-white focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">end:</span>
            <input
              type="text"
              placeholder="00:30"
              value={trimEnd}
              onChange={e => setTrimEnd(e.target.value)}
              className="w-20 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-center text-white focus:outline-none focus:border-sky-500"
            />
          </div>
          <span className="text-[10px] text-zinc-400 hidden sm:inline ml-auto">
            formats: mm:ss or hh:mm:ss
          </span>
        </div>
      )}

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
                onDoubleClick={() =>
                  onSelectChoice(choice, trimStart || undefined, trimEnd || undefined)
                }
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
          onClick={() =>
            onSelectChoice(probe.choices[selectedIndex], trimStart || undefined, trimEnd || undefined)
          }
          className="px-5 py-2 bg-white text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider rounded hover:bg-zinc-200 active:scale-98 transition-all shadow-md"
        >
          Pull Ripcord ↵
        </button>
      </div>
    </div>
  )
}
