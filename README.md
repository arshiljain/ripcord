# ⚡ Ripcord

```text
█▀█ █ █▀█ █▀▀ █▀█ █▀█ █▀▄
█▀▄ █ █▀▀ █   █ █ █▀▄ █ █
▀ ▀ ▀ ▀   ▀▀▀ ▀▀▀ ▀ ▀ ▀▀▀
```

> **pull the ripcord. grab any stream. done.**

**Ripcord** is a lightning-fast, ad-free web application for streaming and downloading video and audio from YouTube, X/Twitter, Instagram, TikTok, Threads, Reddit, Vimeo, Twitch, and over 1,800+ sites.

Built by [Arshil Jain](https://github.com/arshiljain), Ripcord features a retro-terminal aesthetic, animated ASCII sweep banner, keyboard navigation, and seamless Vercel deployment.

---

## ✨ Features

- **🛡️ 100% Clean & Ad-Free:** No spam, popups, or sketchy redirects. Direct stream resolution powered by `yt-dlp`.
- **💻 Cyber-Terminal Aesthetic:** Dark/Light theme toggle, monospaced typography, retro framed containers, and subtle CRT scanlines.
- **⚡ Animated ASCII Sweep:** Dynamic matrix beam sweep animation over the `RIPCORD` wordmark.
- **🎯 Live Platform Detection:** Instant recognition of 9+ major platforms as you paste:
  - 🔴 YouTube & YouTube Music
  - 🐦 X / Twitter
  - 📷 Instagram (Reels & Posts)
  - 🎵 TikTok
  - 🧵 Threads
  - 🤖 Reddit
  - 🎬 Vimeo
  - 🟣 Twitch
  - 🔵 Facebook
  - 🦋 Bluesky
  - 🌐 1,800+ sites
- **🎞️ Smart Quality & Format Choices:**
  - Video: 4K, 1440p, 1080p, 720p, 480p, 360p (MP4) with live file size estimates.
  - Audio: High-Quality MP3 (320kbps) & AAC / M4A.
- **✂️ Video Timestamp Trimmer:** Trim clips on the fly! Set start and end timestamps (e.g. `00:15` to `00:45`) to extract only the clip you need.
- **🖼️ One-Click HD Thumbnail Extractor:** Download full-resolution cover art and thumbnails with one click.
- **🔗 Copy Direct Stream URL:** Copy the raw resolved media stream link to play directly in VLC, QuickTime, or embed elsewhere.
- **▶️ In-Browser Media Previewer:** Stream and watch or listen to the media right in the web app before downloading.
- **📜 Local Download History:** Slide-out drawer tracking previously pulled streams stored in `localStorage`.
- **⌨️ Keyboard First Navigation:**
  - `Enter`: Pull Ripcord / Confirm selection / Pull another
  - `↑` / `↓`: Navigate format choices
  - `Esc`: Back / Cancel / Close modals
  - `Cmd+V` / `Ctrl+V`: Quick paste

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

1. Push your repository to GitHub (`https://github.com/arshiljain/ripcord`).
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

## 👤 Author

Created with ⚡ by **[Arshil Jain](https://github.com/arshiljain)**.

License: [MIT](LICENSE)
