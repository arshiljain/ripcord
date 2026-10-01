# ⚡ Ripcord

```text
█▀█ █ █▀█ █▀▀ █▀█ █▀█ █▀▄
█▀▄ █ █▀▀ █   █ █ █▀▄ █ █
▀ ▀ ▀ ▀   ▀▀▀ ▀▀▀ ▀ ▀ ▀▀▀
```

> **pull the ripcord. grab any stream. done.**

Ripcord is a full-stack Next.js web application adapted from Pablo Stanley's open-source CLI video downloader [Yoinks](https://github.com/pablostanley/yoinks).

It recreates the retro-terminal aesthetic, animated ASCII shimmer logo, monospaced typography, and effortless workflow of the terminal tool—now accessible in any web browser, on desktop and mobile, and ready to deploy directly to Vercel.

---

## ✨ Features

- **No Shady Ads, No Popups:** Clean, open-source video extractor without sketchy redirects or popups.
- **Authentic Terminal Aesthetic:** Pablo Stanley's signature retro-terminal design featuring dark/light modes, box-drawing frames, monospaced typography, and subtle CRT scanlines.
- **Animated ASCII Shimmer Sweep:** Real-time matrix sweep beam animation adapted to the `RIPCORD` wordmark.
- **Live Platform Detection:** Automatically identifies 9+ platforms as you paste or type:
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
  - 🌐 1,800+ other sites supported by `yt-dlp`
- **Smart Quality Picker:** Choose between 4K, 1440p, 1080p, 720p, 480p, 360p (MP4) or audio-only extraction (MP3) with calculated file size estimates.
- **In-Browser Media Previewer:** Preview video and audio streams directly in a built-in player before downloading.
- **Local Download History:** Built-in history drawer that persists your recently pulled streams in `localStorage` for fast re-downloading.
- **Full Keyboard Navigation:**
  - `Enter`: Pull Ripcord / Confirm selection / Pull another
  - `↑` / `↓`: Navigate format choices
  - `Esc`: Back / Cancel / Close modals
  - `Cmd+V` / `Ctrl+V`: One-click paste
- **Vercel-Ready:** Built with Next.js App Router and serverless routes configured for Vercel deployment with `/tmp` binary caching.

---

## 🚀 Quickstart (Local Development)

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- `npm`, `pnpm`, or `yarn`

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Ripcord will automatically detect your operating system (macOS, Windows, Linux) and resolve or fetch `yt-dlp` when needed.

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

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Select your repository and click **Deploy**.
4. The serverless functions will automatically handle execution permissions and `/tmp` storage caching.

---

## 🛠️ Project Structure

```
ripcord/
├── app/
│   ├── api/
│   │   ├── probe/route.ts      # POST: metadata extraction & format selection
│   │   ├── download/route.ts   # GET: file streaming with Content-Disposition
│   │   └── stream/route.ts     # GET: direct media stream preview
│   ├── globals.css             # Terminal design tokens, theme vars, scanlines
│   ├── layout.tsx              # Root HTML layout & fonts
│   └── page.tsx                # Ripcord terminal state machine orchestrator
├── components/
│   ├── AsciiLogo.tsx           # Matrix shimmer sweep ASCII animation
│   ├── FramedBox.tsx           # Retro terminal container
│   ├── InputPhase.tsx          # URL input, paste button, platform detection
│   ├── ProbingPhase.tsx        # Animated Braille spinner
│   ├── PickingPhase.tsx        # Video card & keyboard format selector
│   ├── ProgressPhase.tsx       # Live ASCII progress bar & metrics
│   ├── DonePhase.tsx           # Success completion & quick actions
│   ├── MediaPreviewModal.tsx   # In-browser HTML5 video/audio player
│   ├── HistoryDrawer.tsx       # Slide-out recent downloads drawer
│   ├── ShortcutsBar.tsx        # Keyboard hints footer
│   └── ThemeToggle.tsx         # Dark / Light mode toggle
├── lib/
│   ├── choices.ts              # Format scoring and resolution builder
│   ├── format.ts               # Byte, duration, speed formatters
│   ├── history.ts              # Client localStorage history management
│   ├── platforms.ts            # Platform detection regex and rules
│   └── ytdlp-server.ts         # yt-dlp binary resolver & runner
├── tests/                      # Automated unit and integration tests
└── vercel.json                 # Serverless deployment configuration
```

---

## ⚖️ Disclaimer & Credits

Ripcord is created as an open-source personal-archiving web tool. Please be respectful of creators and copyright laws when archiving media.

- Based on [Yoinks](https://github.com/pablostanley/yoinks) by **Pablo Stanley**.
- Powered by [yt-dlp](https://github.com/yt-dlp/yt-dlp).

License: [MIT](LICENSE)
