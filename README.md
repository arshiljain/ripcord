# ⚡ Ripcord

```text
█▀█ █ █▀█ █▀▀ █▀█ █▀█ █▀▄
█▀▄ █ █▀▀ █   █ █ █▀▄ █ █
▀ ▀ ▀ ▀   ▀▀▀ ▀▀▀ ▀ ▀ ▀▀▀
```

> **pull the ripcord. grab any stream. done.**

**Ripcord** is a lightning-fast, ad-free web application for streaming and downloading video and audio from YouTube, X/Twitter, Instagram, TikTok, Threads, Reddit, Vimeo, Twitch, and over 1,800+ sites.

Created by **[Dopamine Agency](https://github.com/arshiljain)** ([Arshil Jain](https://github.com/arshiljain)), Ripcord features a retro-terminal aesthetic, animated ASCII sweep banner, keyboard navigation, and seamless Vercel deployment.

---

## ⚡ 22 Core Features (All Native to the UI/UX)

1. **🛡️ 100% Ad-Free Direct Stream Resolution:** No spam, popups, redirects, or shady download links. Direct stream extraction powered by `yt-dlp`.
2. **⚡ Animated ASCII Matrix Shimmer Sweep:** Real-time canvas/DOM matrix beam sweep animation over the `RIPCORD` wordmark with retro physics.
3. **🎯 Live Platform Auto-Detection:** Automatically identifies YouTube, Twitter/X, Instagram, TikTok, Threads, Reddit, Vimeo, Twitch, Facebook, and Bluesky as you paste.
4. **🏷️ Multi-Platform Filter Badges:** Interactive platform tag chips displaying supported sources.
5. **🔍 Instant URL Validator & Sanitizer:** Pre-flight validation catches typos and invalid URLs before contacting the extractor.
6. **📋 One-Click Clipboard Auto-Paste:** Dedicated paste trigger with clipboard permission detection.
7. **✕ One-Click Clear Action:** Instantly wipe and reset the URL input.
8. **⌛ 10-Frame Braille Status Spinner:** Dynamic rotating Braille spinner (`⠋ ⠙ ⠹...`) displaying stage-by-stage probe diagnostics.
9. **🛑 Probe Cancellation (`Esc`):** Abort in-flight network probe requests at any moment.
10. **🖼️ High-Res Media Thumbnail & Duration:** Crisp video preview thumbnail with an overlay duration indicator (`MM:SS` / `HH:MM:SS`).
11. **👤 Uploader & Channel Attribution:** Displays creator name, channel handle, and platform badge.
12. **📸 One-Click HD Cover Art Extractor:** "🖼️ HD cover" chip to view and download full-resolution cover art and thumbnails.
13. **🔗 Copy Direct Stream URL:** "🔗 copy link" chip to grab the raw resolved video stream link for VLC or external players.
14. **✂️ Precision Clip Timestamp Trimmer:** "✂ trim clip" drawer to specify Start (`00:00`) and End (`00:30`) times to extract only the clip you need.
15. **🎧 High-Quality MP3 Audio (320k):** Extracts pristine 320kbps MP3 audio directly from any video stream.
16. **🍏 Native AAC / M4A Audio Extraction:** High-efficiency AAC audio stream extraction for Apple/iOS devices.
17. **🎞️ Multi-Resolution Video Selector:** Automatically scores and lists 4K, 1440p, 1080p, 720p, 480p, and 360p with estimated file sizes.
18. **⌨️ Terminal Keyboard Navigation:** Navigate quality choices with `↑` / `↓` and confirm with `Enter`.
19. **▶️ In-Browser Media Preview Player:** Built-in HTML5 modal video/audio player to preview content before downloading.
20. **📊 ASCII Progress Bar & ETA:** Retro `[██████░░░░] 64%` progress bar with speed (MB/s) and remaining time estimates.
21. **📜 Persistent History Drawer:** Slide-out drawer tracking up to 20 previously pulled streams stored in `localStorage` for 1-click re-pulling.
22. **🌓 Dark / Light Retro Terminal Theme:** High-contrast palette toggle with retro CRT scanline backdrop.

---

## 🚀 Quickstart (Local Development)

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- `npm`, `pnpm`, or `yarn`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/arshiljain/ripcord.git
cd ripcord
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Ripcord will automatically resolve or fetch the appropriate platform `yt-dlp` executable.

---

## 🧪 Testing & Verification

Run the full automated test suite:
```bash
npm test
```

Run TypeScript compilation check:
```bash
npm run typecheck
```

Build the production application:
```bash
npm run build
```

---

## ☁️ Deploying to Vercel

Ripcord is pre-configured with `vercel.json` for one-click deployment:

1. Push your repository to GitHub: `https://github.com/arshiljain/ripcord`.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Select the `ripcord` repository and click **Deploy**.
4. The serverless functions will automatically handle execution permissions and `/tmp` storage caching.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Next.js 14+ (App Router), React 18/19, Tailwind CSS.
- **Backend:** Next.js Serverless API routes (`/api/probe`, `/api/download`, `/api/stream`).
- **Engine:** `yt-dlp` standalone binary with automatic platform resolution + `ffmpeg-static`.
- **Testing:** Node.js native test runner + `tsx`.

---

## 👤 Author & Credits

Created by **[Dopamine Agency](https://github.com/arshiljain)** ([Arshil Jain](https://github.com/arshiljain)).

- GitHub: [https://github.com/arshiljain/ripcord](https://github.com/arshiljain/ripcord)
- Profile: [https://github.com/arshiljain](https://github.com/arshiljain)

License: [MIT](LICENSE)
