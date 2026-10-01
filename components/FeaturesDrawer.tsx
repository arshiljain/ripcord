'use client'

import React from 'react'

interface FeaturesDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const RIPCORD_FEATURES = [
  { id: 1, title: 'Ad-Free Direct Extraction', desc: 'No popups, redirects, or spam. Resolves media streams directly.' },
  { id: 2, title: 'Animated ASCII Shimmer Banner', desc: 'Real-time matrix sweep beam animation over the RIPCORD wordmark.' },
  { id: 3, title: 'Live Platform Auto-Detection', desc: 'Instantly identifies YouTube, X/Twitter, Instagram, TikTok, Threads, Reddit, Vimeo, Twitch, Facebook, Bluesky, etc.' },
  { id: 4, title: 'Multi-Platform Filter Badges', desc: 'Interactive chips highlighting supported domains.' },
  { id: 5, title: 'Instant URL Validator', desc: 'Pre-flight sanitization catches invalid web addresses before querying.' },
  { id: 6, title: 'One-Click Clipboard Paste', desc: 'Quickly pastes URL from system clipboard with one tap.' },
  { id: 7, title: 'Clear Input Action [✕]', desc: 'Quick reset button to wipe the URL field.' },
  { id: 8, title: '10-Frame Braille Status Spinner', desc: 'Smooth rotating terminal spinner with stage-by-stage probe diagnostics.' },
  { id: 9, title: 'Probe Cancellation [Esc]', desc: 'Abort in-flight network probe requests anytime.' },
  { id: 10, title: 'High-Res Thumbnail & Duration', desc: 'Displays media preview image with duration timestamp overlay.' },
  { id: 11, title: 'Uploader & Channel Attribution', desc: 'Shows creator handle and platform origin badge.' },
  { id: 12, title: 'One-Click HD Cover Art Extractor', desc: 'Extract and download original high-res thumbnail images.' },
  { id: 13, title: 'Direct Media Stream URL Copy', desc: 'Copies the raw resolved video stream link for VLC or external players.' },
  { id: 14, title: 'Precision Clip Timestamp Trimmer', desc: 'Set Start and End times (e.g. 00:15 - 00:45) to download just the desired clip.' },
  { id: 15, title: 'High-Quality MP3 Audio (320k)', desc: 'Extracts pristine 320kbps audio directly from video streams.' },
  { id: 16, title: 'AAC / M4A Audio Extraction', desc: 'Native Apple/iOS compatible audio container option.' },
  { id: 17, title: 'Multi-Resolution Video Selector', desc: 'Sorts 4K, 1440p, 1080p, 720p, 480p, 360p with estimated sizes.' },
  { id: 18, title: 'Terminal Keyboard Navigation', desc: 'Navigate format choices with [↑ / ↓] and confirm with [Enter].' },
  { id: 19, title: 'In-Browser Media Preview Player', desc: 'Built-in video/audio player to preview content before saving.' },
  { id: 20, title: 'ASCII Progress Bar & ETA', desc: 'Real-time terminal progress bar with transfer rate and time remaining.' },
  { id: 21, title: 'Persistent History Drawer', desc: 'Stores up to 20 recently pulled streams in localStorage for quick re-pulling.' },
  { id: 22, title: 'Dark / Light Retro Terminal Theme', desc: 'High-contrast palette toggle with retro CRT scanline backdrop.' }
]

export function FeaturesDrawer({ isOpen, onClose }: FeaturesDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-lg h-full bg-zinc-900 border-l border-zinc-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-sky-400">⚡</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              22 Ripcord Features
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
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {RIPCORD_FEATURES.map(feat => (
            <div
              key={feat.id}
              className="p-3 rounded border border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 transition-all flex items-start gap-3"
            >
              <span className="shrink-0 w-6 h-6 rounded bg-zinc-800 border border-zinc-700 text-sky-400 text-xs font-bold flex items-center justify-center">
                {feat.id}
              </span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">
                  {feat.title}
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
          <span>Created by Dopamine Agency</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] transition-colors"
          >
            close
          </button>
        </div>
      </div>
    </div>
  )
}
