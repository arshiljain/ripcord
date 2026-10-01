import { spawn } from 'node:child_process'
import { createWriteStream } from 'node:fs'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { buildChoices, type DownloadChoice, type VideoInfo } from './choices'
import { detectPlatform, type Platform } from './platforms'

// In serverless (Vercel), only /tmp is writable
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
const RIPCORD_DIR = IS_SERVERLESS
  ? path.join('/tmp', 'ripcord-bin')
  : path.join(os.homedir(), '.ripcord', 'bin')

const RELEASE_BASE = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download'

function ytDlpAssetName(): string {
  if (process.platform === 'win32') return 'yt-dlp.exe'
  if (process.platform === 'darwin') return 'yt-dlp_macos'
  return process.arch === 'arm64' ? 'yt-dlp_linux_aarch64' : 'yt-dlp_linux'
}

function commandWorks(cmd: string, args: string[]): Promise<boolean> {
  return new Promise(resolve => {
    let child
    try {
      child = spawn(cmd, args, { stdio: 'ignore', timeout: 10_000 })
    } catch {
      resolve(false)
      return
    }
    child.on('error', () => resolve(false))
    child.on('close', code => resolve(code === 0))
  })
}

let cachedYtDlpPath: string | null = null

export async function ensureServerYtDlp(signal?: AbortSignal): Promise<string> {
  if (cachedYtDlpPath && (await commandWorks(cachedYtDlpPath, ['--version']))) {
    return cachedYtDlpPath
  }

  // 1. Check system PATH
  if (await commandWorks('yt-dlp', ['--version'])) {
    cachedYtDlpPath = 'yt-dlp'
    return 'yt-dlp'
  }

  // 2. Check local binary
  const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
  const local = path.join(RIPCORD_DIR, binaryName)

  try {
    const stat = await fs.stat(local)
    if (stat.isFile()) {
      if (process.platform !== 'win32') {
        await fs.chmod(local, 0o755)
      }
      if (await commandWorks(local, ['--version'])) {
        cachedYtDlpPath = local
        return local
      }
    }
  } catch {
    // Not found locally, will download
  }

  // 3. Download standalone release binary
  await fs.mkdir(RIPCORD_DIR, { recursive: true })
  const assetUrl = `${RELEASE_BASE}/${ytDlpAssetName()}`
  
  const response = await fetch(assetUrl, { signal })
  if (!response.ok || !response.body) {
    throw new Error(`Could not fetch yt-dlp binary from ${assetUrl} (${response.status})`)
  }

  const tmpFile = `${local}.tmp-${Date.now()}`
  await pipeline(Readable.fromWeb(response.body as never), createWriteStream(tmpFile), { signal })
  if (process.platform !== 'win32') {
    await fs.chmod(tmpFile, 0o755)
  }
  await fs.rename(tmpFile, local)

  cachedYtDlpPath = local
  return local
}

export async function findFfmpeg(): Promise<string | undefined> {
  if (await commandWorks('ffmpeg', ['-version'])) return undefined
  try {
    const mod = await import('ffmpeg-static')
    const ffmpegPath = (mod.default ?? mod) as unknown as string | null
    if (ffmpegPath && (await commandWorks(ffmpegPath, ['-version']))) {
      return ffmpegPath
    }
  } catch {
    // ffmpeg-static not available
  }
  return undefined
}

export type ProbeResult = {
  id: string
  title: string
  uploader: string
  duration: number
  thumbnail?: string
  webpage_url: string
  platform: Platform
  choices: DownloadChoice[]
  rawInfo: VideoInfo
}

export function cleanYtDlpError(raw: string): string {
  const line = raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('ERROR:') || l.startsWith('WARNING:'))
    .pop()
  if (!line) return raw.trim()
  return line.replace(/^ERROR:\s*/, '').replace(/^\[[^\]]+\]\s*/, '')
}

export async function probeUrl(url: string, signal?: AbortSignal): Promise<ProbeResult> {
  const ytdlp = await ensureServerYtDlp(signal)

  const stdout = await new Promise<string>((resolve, reject) => {
    const child = spawn(ytdlp, ['-J', '--no-playlist', '--no-warnings', url], { signal })
    let out = ''
    let stderr = ''
    child.stdout.on('data', chunk => (out += chunk))
    child.stderr.on('data', chunk => (stderr += chunk))
    child.on('error', reject)
    child.on('close', code => {
      if (code !== 0) {
        const errorMsg = cleanYtDlpError(stderr) || `yt-dlp exited with code ${code}`
        reject(new Error(errorMsg))
      } else {
        resolve(out)
      }
    })
  })

  let rawInfo: VideoInfo
  try {
    rawInfo = JSON.parse(stdout) as VideoInfo
  } catch {
    throw new Error('Failed to parse video information from extractor.')
  }

  const platform = detectPlatform(url)
  const choices = buildChoices(rawInfo)

  return {
    id: rawInfo.id || Buffer.from(url).toString('base64url').slice(0, 16),
    title: rawInfo.title || 'Untitled Stream',
    uploader: rawInfo.uploader || platform.label,
    duration: rawInfo.duration || 0,
    thumbnail: rawInfo.thumbnail,
    webpage_url: rawInfo.webpage_url || url,
    platform,
    choices,
    rawInfo
  }
}
