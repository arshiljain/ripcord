'use client'

import React from 'react'
import { HistoryItem } from '@/lib/history'

interface HistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: HistoryItem[]
  onSelectUrl: (url: string) => void
  onRemoveItem: (id: string) => void
  onClearAll: () => void
}

export function HistoryDrawer({
  isOpen,
  onClose,
  items,
  onSelectUrl,
  onRemoveItem,
  onClearAll
}: HistoryDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-md h-full bg-zinc-900 border-l border-zinc-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-sky-400">📜</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              recent ripcords ({items.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white px-2 py-0.5 rounded hover:bg-zinc-800 text-xs transition-colors"
          >
            [esc] ✕
          </button>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-zinc-500 text-xs space-y-2">
              <span>no history yet</span>
              <span className="text-[11px] text-zinc-600">
                videos you pull will appear here for quick access
              </span>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="group p-2.5 rounded border border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 transition-all flex gap-3"
              >
                {item.thumbnail && (
                  <div className="shrink-0 w-20 aspect-video rounded bg-zinc-800 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4
                      className="text-xs font-medium text-white truncate cursor-pointer hover:text-sky-400"
                      title={item.title}
                      onClick={() => {
                        onSelectUrl(item.url)
                        onClose()
                      }}
                    >
                      {item.title}
                    </h4>
                    {item.uploader && (
                      <span className="text-[10px] text-zinc-400 truncate block">
                        {item.uploader}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-zinc-600">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectUrl(item.url)
                          onClose()
                        }}
                        className="text-[10px] text-sky-400 hover:text-sky-300 uppercase font-semibold"
                        title="Load into Ripcord"
                      >
                        pull again
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[10px] text-zinc-600 hover:text-rose-400"
                        title="Remove from history"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-xs">
            <button
              onClick={onClearAll}
              className="text-zinc-500 hover:text-rose-400 text-[11px] transition-colors"
            >
              clear all history
            </button>
            <span className="text-zinc-600 text-[10px]">stored locally</span>
          </div>
        )}
      </div>
    </div>
  )
}
