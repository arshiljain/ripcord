'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AsciiLogo } from '@/components/AsciiLogo'
import { FramedBox } from '@/components/FramedBox'
import { ThemeToggle, ThemeMode } from '@/components/ThemeToggle'
import { ShortcutsBar, AppPhaseName } from '@/components/ShortcutsBar'
import { InputPhase } from '@/components/InputPhase'
import { ProbingPhase } from '@/components/ProbingPhase'
import { PickingPhase } from '@/components/PickingPhase'
import { ProgressPhase } from '@/components/ProgressPhase'
import { DonePhase } from '@/components/DonePhase'
import { MediaPreviewModal } from '@/components/MediaPreviewModal'
import { HistoryDrawer } from '@/components/HistoryDrawer'
import { FeaturesDrawer } from '@/components/FeaturesDrawer'
import { ProbeResult } from '@/lib/ytdlp-server'
import { DownloadChoice } from '@/lib/choices'
import {
  HistoryItem,
  loadHistory,
  saveHistory,
  addToHistoryList,
  removeFromHistoryList,
  clearHistory
} from '@/lib/history'

export default function RipcordPage() {
  const [phase, setPhase] = useState<AppPhaseName>('input')
  const [targetUrl, setTargetUrl] = useState('')
  const [probeData, setProbeData] = useState<ProbeResult | null>(null)
  const [selectedChoice, setSelectedChoice] = useState<DownloadChoice | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [theme, setTheme] = useState<ThemeMode>('dark')

  // Modals & Drawers
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false)
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])

  // Load history from localStorage on client mount
  useEffect(() => {
    setHistoryItems(loadHistory())
  }, [])

  // Sync theme to DOM
  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  // Handle probe request
  const handlePull = useCallback(async (url: string) => {
    setTargetUrl(url)
    setPhase('probing')
    setErrorMessage(null)

    try {
      const res = await fetch('/api/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to probe video details.')
      }

      setProbeData(data.info)
      setPhase('picking')
    } catch (err: any) {
      console.error('Probe failed:', err)
      setErrorMessage(err.message || 'Could not resolve stream info.')
      setPhase('error')
    }
  }, [])

  // Handle format choice selection & trigger download
  const handleSelectChoice = useCallback(
    (choice: DownloadChoice, trimStart?: string, trimEnd?: string) => {
      if (!probeData) return

      setSelectedChoice(choice)
      setPhase('downloading')

      let dlUrl = `/api/download?url=${encodeURIComponent(targetUrl)}&choiceId=${encodeURIComponent(
        choice.id
      )}&title=${encodeURIComponent(probeData.title)}`

      if (trimStart) dlUrl += `&trimStart=${encodeURIComponent(trimStart)}`
      if (trimEnd) dlUrl += `&trimEnd=${encodeURIComponent(trimEnd)}`

      setDownloadUrl(dlUrl)

      // Save to history
      const historyEntry: HistoryItem = {
        id: probeData.id,
        url: targetUrl,
        title: probeData.title,
        thumbnail: probeData.thumbnail,
        uploader: probeData.uploader,
        duration: probeData.duration,
        formatLabel: choice.label,
        timestamp: Date.now()
      }

      setHistoryItems(prev => {
        const updated = addToHistoryList(prev, historyEntry)
        saveHistory(updated)
        return updated
      })

      // Simulated progress delay before triggering download
      setTimeout(() => {
        // Trigger browser download via invisible link
        const link = document.createElement('a')
        link.href = dlUrl
        link.download = ''
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setPhase('done')
      }, 2800)
    },
    [probeData, targetUrl]
  )

  // Reset to input phase
  const handleReset = useCallback(() => {
    setPhase('input')
    setProbeData(null)
    setSelectedChoice(null)
    setErrorMessage(null)
  }, [])

  // History operations
  const handleRemoveHistoryItem = (id: string) => {
    setHistoryItems(prev => {
      const updated = removeFromHistoryList(prev, id)
      saveHistory(updated)
      return updated
    })
  }

  const handleClearHistory = () => {
    clearHistory()
    setHistoryItems([])
  }

  const handleSelectFromHistory = (url: string) => {
    setTargetUrl(url)
    handlePull(url)
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 bg-[#18181b] dark:bg-[#18181b] text-white overflow-x-hidden font-mono">
      {/* Background CRT scanline overlay */}
      <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between py-2 border-b border-zinc-800/80 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <span className="text-base font-black tracking-widest text-sky-400">
            RIPCORD
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            v1.2.0
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsFeaturesOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs border border-zinc-700 hover:border-sky-500 rounded bg-zinc-800/60 hover:bg-zinc-800 text-sky-400 transition-colors"
          >
            <span>⚡</span>
            <span>22 features</span>
          </button>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-zinc-700 hover:border-zinc-500 rounded bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
          >
            <span>📜</span>
            <span>history</span>
            {historyItems.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-sky-500 text-zinc-950 font-bold text-[10px]">
                {historyItems.length}
              </span>
            )}
          </button>

          <ThemeToggle theme={theme} onToggle={handleToggleTheme} />

          <a
            href="https://github.com/arshiljain/ripcord"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-zinc-400 hover:text-white transition-colors"
            title="GitHub Repository"
          >
            github ↗
          </a>
        </div>
      </header>

      {/* Main Terminal Experience */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center my-auto space-y-6">
        {/* Animated ASCII sweep logo */}
        <AsciiLogo isDark={theme === 'dark'} />

        {/* Framed Interactive Terminal Box */}
        <FramedBox
          title={
            phase === 'input'
              ? 'ripcord@terminal:~'
              : phase === 'probing'
              ? 'ripcord@terminal:~/probe'
              : phase === 'picking'
              ? 'ripcord@terminal:~/select'
              : phase === 'downloading'
              ? 'ripcord@terminal:~/stream'
              : phase === 'done'
              ? 'ripcord@terminal:~/complete'
              : 'ripcord@terminal:~/error'
          }
          badge={phase}
        >
          {phase === 'input' && (
            <InputPhase
              onPull={handlePull}
              initialUrl={targetUrl}
            />
          )}

          {phase === 'probing' && (
            <ProbingPhase
              url={targetUrl}
              onCancel={handleReset}
            />
          )}

          {phase === 'picking' && probeData && (
            <PickingPhase
              probe={probeData}
              onSelectChoice={handleSelectChoice}
              onPreview={() => setIsPreviewOpen(true)}
              onBack={handleReset}
            />
          )}

          {phase === 'downloading' && selectedChoice && (
            <ProgressPhase
              choice={selectedChoice}
              onCancel={handleReset}
            />
          )}

          {phase === 'done' && probeData && selectedChoice && downloadUrl && (
            <DonePhase
              title={probeData.title}
              formatLabel={selectedChoice.label}
              downloadUrl={downloadUrl}
              onPreview={() => setIsPreviewOpen(true)}
              onPullAnother={handleReset}
            />
          )}

          {phase === 'error' && (
            <div className="py-6 space-y-4 text-center">
              <div className="text-rose-400 text-lg font-bold">
                ⚠ probe failed
              </div>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                {errorMessage || 'An error occurred while probing the media URL.'}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => handlePull(targetUrl)}
                  className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded border border-zinc-600 transition-colors"
                >
                  retry
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-1.5 bg-white text-zinc-950 font-bold text-xs rounded hover:bg-zinc-200 transition-colors"
                >
                  [esc] back to start
                </button>
              </div>
            </div>
          )}
        </FramedBox>

        {/* Keyboard shortcut hints */}
        <ShortcutsBar phase={phase} />
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl py-6 mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/80 gap-2">
        <span>
          created by <a href="https://github.com/arshiljain" target="_blank" rel="noreferrer" className="underline hover:text-white font-medium">Dopamine Agency</a>
        </span>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/arshiljain/ripcord"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            github repository ↗
          </a>
          <span>·</span>
          <span>pull the ripcord. grab any stream. done.</span>
        </div>
      </footer>

      {/* Media Preview Modal */}
      <MediaPreviewModal
        url={targetUrl}
        title={probeData?.title || 'Stream Preview'}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* History Slide-out Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onSelectUrl={handleSelectFromHistory}
        onRemoveItem={handleRemoveHistoryItem}
        onClearAll={handleClearHistory}
      />

      {/* 22 Features Drawer */}
      <FeaturesDrawer
        isOpen={isFeaturesOpen}
        onClose={() => setIsFeaturesOpen(false)}
      />
    </main>
  )
}
