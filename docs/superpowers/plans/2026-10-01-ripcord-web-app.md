# Ripcord Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deliver Ripcord, a full-stack Next.js web application adapted from Pablo Stanley's Yoinks video downloader, featuring an authentic retro-terminal UI, animated ASCII shimmer logo, in-browser media previewer, local download history, and Vercel-ready serverless API routes.

**Architecture:** Next.js 14+ App Router with TypeScript and Tailwind CSS for the frontend terminal UI and serverless API routes (`/api/probe`, `/api/download`, `/api/stream`). Server routes leverage `yt-dlp` (with automatic platform binary resolution and `/tmp` execution permissions for Vercel/serverless).

**Tech Stack:** Next.js 14+, React 18/19, TypeScript, Tailwind CSS, `yt-dlp`, Node.js child_process/streams, Vitest/Node test runner.

**Spec:** [docs/superpowers/specs/2026-10-01-ripcord-web-design.md](file:///c:/Users/kanha/Documents/antigravity/agitated-salk/docs/superpowers/specs/2026-10-01-ripcord-web-design.md)

## Global Constraints
- Framework: Next.js App Router with TypeScript.
- Design: Monospaced retro terminal aesthetic matching Yoinks (`#18181b` dark default, `#ffffff` light, zinc accents), ASCII shimmer sweep logo, and box-drawing borders.
- Platforms supported: YouTube, X/Twitter, Instagram, TikTok, Threads, Reddit, Vimeo, Twitch, Facebook, and generic URLs.
- Serverless compatibility: Binary paths resolved to `/tmp` in serverless/Vercel with execution permissions; timeouts configured in `vercel.json`.

## Review Focus
- Invalid or unparseable URLs returning graceful error states in UI without crash.
- Datacenter/serverless rate limits or bot blocks handled cleanly with clear user feedback.
- Format selector gracefully handling audio-only, video-only, or muxed formats without missing audio.
- Keyboard navigation (`Enter`, `Esc`, `↑`/`↓`) working seamlessly alongside mouse clicks.
- Media Preview modal properly unloading video/audio stream on close to prevent background playback.

---

### Task 1: Project Scaffolding & Core Utility Library

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `next.config.js`, `vercel.json`
- Create: `lib/format.ts`, `lib/platforms.ts`
- Create: `tests/format.test.ts`, `tests/platforms.test.ts`

**Interfaces:**
- Consumes: Node standard libraries, URL API.
- Produces:
  - `detectPlatform(url: string): { key: string; label: string }`
  - `isProbablyUrl(input: string): boolean`
  - `formatBytes(bytes: number): string`
  - `formatDuration(seconds: number): string`
  - `formatSpeed(bytesPerSecond: number): string`

- [ ] **Step 1: Write tests for format utilities and platform detection**
  Create `tests/format.test.ts` and `tests/platforms.test.ts` validating byte conversions (KB, MB, GB), duration formatting (`MM:SS`), speed formatting, and platform matching for YouTube, Instagram, TikTok, Twitter/X, Reddit, etc.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx --test tests/format.test.ts tests/platforms.test.ts`
  Expected: FAIL (modules not found)

- [ ] **Step 3: Implement `package.json`, `next.config.js`, `tailwind.config.js`, and port `lib/format.ts` and `lib/platforms.ts`**
  Set up Next.js project dependencies and implement pure utilities.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx tsx --test tests/format.test.ts tests/platforms.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add package.json tsconfig.json tailwind.config.js postcss.config.js next.config.js vercel.json lib/ tests/
  git commit -m "feat: scaffold Next.js project and port core utility libraries"
  ```

---

### Task 2: Server-Side `yt-dlp` Resolver & Format Builder Engine

**Files:**
- Create: `lib/ytdlp-server.ts`, `lib/choices.ts`
- Create: `tests/choices.test.ts`

**Interfaces:**
- Consumes: `lib/format.ts`, `child_process`, `fs/promises`, `os`, `path`.
- Produces:
  - `ensureServerYtDlp(): Promise<string>`
  - `probeUrl(url: string): Promise<ProbeResult>`
  - `buildChoices(info: VideoInfo): DownloadChoice[]`
  - `scoreVideo(format: RawFormat): number`

- [ ] **Step 1: Write tests for choice builder and format filtering**
  Create `tests/choices.test.ts` testing extraction of video qualities (1080p, 720p, etc.) and MP3 audio fallback with size calculation.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx --test tests/choices.test.ts`
  Expected: FAIL (`lib/choices.ts` not found)

- [ ] **Step 3: Implement `lib/choices.ts` and `lib/ytdlp-server.ts`**
  Implement format scoring, size estimation, and binary resolution logic handling local system binaries, downloaded `.ripcord/bin` binaries, and Vercel `/tmp/ripcord-bin` standalone executable with execute permissions (`chmod 0o755`).

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx tsx --test tests/choices.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add lib/ytdlp-server.ts lib/choices.ts tests/choices.test.ts
  git commit -m "feat: implement yt-dlp binary resolver and format choice builder"
  ```

---

### Task 3: Serverless API Routes (`/api/probe`, `/api/download`, `/api/stream`)

**Files:**
- Create: `app/api/probe/route.ts`
- Create: `app/api/download/route.ts`
- Create: `app/api/stream/route.ts`
- Create: `tests/api-probe.test.ts`

**Interfaces:**
- Consumes: `lib/ytdlp-server.ts`, `lib/choices.ts`, `NextResponse`, `NextRequest`.
- Produces:
  - `POST /api/probe`: JSON `{ success: boolean, info?: ProbeData, error?: string }`
  - `GET /api/download`: Stream with `Content-Disposition: attachment; filename="..."`
  - `GET /api/stream`: Stream/redirect for in-browser media preview playback

- [ ] **Step 1: Write integration tests for API route logic**
  Create `tests/api-probe.test.ts` testing request validation, 400 bad request on empty URL, error trapping for malformed input.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx --test tests/api-probe.test.ts`
  Expected: FAIL

- [ ] **Step 3: Implement `app/api/probe/route.ts`, `app/api/download/route.ts`, and `app/api/stream/route.ts`**
  Handle JSON parsing, input sanitization, error messages, and streaming response pipes.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx tsx --test tests/api-probe.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add app/api/ tests/api-probe.test.ts
  git commit -m "feat: implement API routes for probe, download, and stream"
  ```

---

### Task 4: Terminal Design System & Shimmer ASCII Logo Component

**Files:**
- Create: `app/globals.css`
- Create: `components/AsciiLogo.tsx`
- Create: `components/ThemeToggle.tsx`
- Create: `components/FramedBox.tsx`

**Interfaces:**
- Consumes: React hooks (`useEffect`, `useState`, `useRef`).
- Produces:
  - `<AsciiLogo theme={theme} />`: Full animated matrix sweep shimmer over the RIPCORD ASCII block letters.
  - `<ThemeToggle current={theme} onChange={setTheme} />`: Dark / Light / Auto toggle.
  - `<FramedBox title={...} subtitle={...}>{children}</FramedBox>`: Terminal border box.

- [ ] **Step 1: Build `app/globals.css` with retro terminal styling**
  Configure font-mono rules, CRT scanline overlay (optional toggle), custom terminal scrollbars, selection colors, and dark/light color palette.

- [ ] **Step 2: Implement `components/AsciiLogo.tsx`**
  Implement the exact cell sweep and intro shimmer algorithm from Yoinks adapted for `RIPCORD`, rendering into monospaced text lines with group-merged spans for high 60fps performance.

- [ ] **Step 3: Implement `components/ThemeToggle.tsx` and `components/FramedBox.tsx`**
  Provide crisp retro framed styling and quick theme toggle.

- [ ] **Step 4: Verify rendering and animation**
  Run typecheck: `npx tsc --noEmit`
  Expected: PASS with no errors.

- [ ] **Step 5: Commit**
  ```bash
  git add app/globals.css components/AsciiLogo.tsx components/ThemeToggle.tsx components/FramedBox.tsx
  git commit -m "feat: implement terminal design system, AsciiLogo animation, and framed box"
  ```

---

### Task 5: Ripcord Interactive Flow Phases (Input, Probing, Picking, Progress, Done)

**Files:**
- Create: `components/InputPhase.tsx`
- Create: `components/ProbingPhase.tsx`
- Create: `components/PickingPhase.tsx`
- Create: `components/ProgressPhase.tsx`
- Create: `components/DonePhase.tsx`
- Create: `components/ShortcutsBar.tsx`

**Interfaces:**
- Consumes: `lib/platforms.ts`, `lib/format.ts`, `lib/choices.ts`.
- Produces:
  - Phase components emitting state events (`onYoink(url)`, `onSelectChoice(choice)`, `onCancel()`, `onReset()`).

- [ ] **Step 1: Implement `components/InputPhase.tsx`**
  URL text input with clipboard paste button, live platform badge indicator, and "Pull Ripcord" submit button.

- [ ] **Step 2: Implement `components/ProbingPhase.tsx`**
  Braille/ASCII rotating spinner with status updates and cancel button.

- [ ] **Step 3: Implement `components/PickingPhase.tsx`**
  Video metadata summary card (thumbnail, channel, duration), keyboard-navigable list of resolution choices with arrow key support, preview button, and download button.

- [ ] **Step 4: Implement `components/ProgressPhase.tsx` & `components/DonePhase.tsx`**
  Live ASCII progress bar with speed/ETA counters, followed by completion summary with instant browser download trigger.

- [ ] **Step 5: Verify components build cleanly**
  Run: `npx tsc --noEmit`
  Expected: PASS

- [ ] **Step 6: Commit**
  ```bash
  git add components/
  git commit -m "feat: implement interactive phase components for Ripcord"
  ```

---

### Task 6: In-Browser Media Previewer, History Drawer & Full State Orchestration

**Files:**
- Create: `lib/history.ts`
- Create: `components/MediaPreviewModal.tsx`
- Create: `components/HistoryDrawer.tsx`
- Modify: `app/page.tsx`, `app/layout.tsx`
- Create: `tests/history.test.ts`

**Interfaces:**
- Consumes: All phase components, `lib/history.ts`.
- Produces: Complete working Ripcord Web Application in `app/page.tsx`.

- [ ] **Step 1: Write tests for history store operations**
  Create `tests/history.test.ts` validating adding history item, limiting to 20 items, deduplication by URL, and clearing history.

- [ ] **Step 2: Implement `lib/history.ts`**
  Safe browser `localStorage` manager with fallback for SSR.

- [ ] **Step 3: Implement `components/MediaPreviewModal.tsx` & `components/HistoryDrawer.tsx`**
  Modal with HTML5 video/audio player and slide-out history panel.

- [ ] **Step 4: Assemble `app/page.tsx` and `app/layout.tsx`**
  Wire state machine, global keyboard shortcuts (`Enter`, `Esc`, `ArrowUp`, `ArrowDown`), history tracking, and direct browser download triggering.

- [ ] **Step 5: Run tests to verify all pass**
  Run: `npx tsx --test tests/history.test.ts`
  Expected: PASS

- [ ] **Step 6: Commit**
  ```bash
  git add lib/history.ts components/MediaPreviewModal.tsx components/HistoryDrawer.tsx app/page.tsx app/layout.tsx tests/history.test.ts
  git commit -m "feat: complete Ripcord web app orchestration, preview player, and history drawer"
  ```

---

### Task 7: End-to-End Verification & Production Readiness

**Files:**
- Create: `README.md` (updated for Ripcord web app & Vercel deployment)
- Test: Full build, typecheck, and local runtime verification

- [ ] **Step 1: Run comprehensive typecheck and test suite**
  Run: `npm run typecheck && npm test`
  Expected: All tests pass, 0 type errors.

- [ ] **Step 2: Test production Next.js build**
  Run: `npm run build`
  Expected: Successful production build with static and serverless API routes generated.

- [ ] **Step 3: Update `README.md` with features, setup guide, and Vercel one-click instructions**
  Document project background, architecture, local dev (`npm run dev`), and deployment.

- [ ] **Step 4: Clean up upstream temporary files & final git commit**
  ```bash
  git add README.md
  git commit -m "docs: finalize README for Ripcord web app"
  ```
