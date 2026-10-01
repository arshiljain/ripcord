'use client'

import React, { useEffect, useState } from 'react'

interface MediaPreviewModalProps {
  url: string
  title: string
  isOpen: boolean
  onClose: () => void
}

export function MediaPreviewModal({ url, title, isOpen, onClose }: MediaPreviewModalProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setStreamUrl(null)
      setIsLoading(true)
      setError(null)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    // Fetch stream url from /api/stream
    fetch(`/api/stream?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return
        if (data.success && data.streamUrl) {
          setStreamUrl(data.streamUrl)
        } else {
          setError(data.error || 'Unable to resolve direct stream URL for preview.')
        }
      })
      .catch(err => {
        if (!isMounted) return
        setError(err.message || 'Network error fetching stream.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      isMounted = false
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, url, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl border border-zinc-700 bg-zinc-900 rounded-lg shadow-2xl overflow-hidden font-mono">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="text-sky-400 text-xs">▶</span>
            <span className="text-xs font-bold text-white truncate" title={title}>
              preview: {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white px-2 py-0.5 rounded hover:bg-zinc-800 text-xs transition-colors"
          >
            [esc] ✕
          </button>
        </div>

        {/* Video / Player Area */}
        <div className="p-4 sm:p-6 bg-black flex flex-col items-center justify-center min-h-[300px]">
          {isLoading && (
            <div className="flex flex-col items-center gap-2 text-sky-400 text-sm">
              <span className="animate-spin text-xl">⠋</span>
              <span>buffering stream preview…</span>
            </div>
          )}

          {error && (
            <div className="text-center space-y-3 px-4">
              <div className="text-rose-400 text-sm font-semibold">⚠ {error}</div>
              <p className="text-xs text-zinc-400">
                Note: Some platforms restrict direct browser streaming via CORS tokens.
                You can still download the full stream via Ripcord!
              </p>
            </div>
          )}

          {!isLoading && !error && streamUrl && (
            <video
              src={streamUrl}
              controls
              autoPlay
              className="w-full max-h-[60vh] rounded bg-black outline-none"
            >
              Your browser does not support HTML5 video preview.
            </video>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-zinc-950/80 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
          <span>In-browser player preview</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
