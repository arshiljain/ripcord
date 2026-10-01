import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'node:child_process'
import { ensureServerYtDlp, cleanYtDlpError } from '@/lib/ytdlp-server'
import { isProbablyUrl } from '@/lib/platforms'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url || !isProbablyUrl(url)) {
      return NextResponse.json({ success: false, error: 'Invalid or missing URL.' }, { status: 400 })
    }

    const ytdlp = await ensureServerYtDlp()

    // Fetch direct streamable URL with -g
    const streamUrl = await new Promise<string>((resolve, reject) => {
      const child = spawn(ytdlp, ['-g', '-f', 'best[ext=mp4]/best', '--no-playlist', url])
      let out = ''
      let stderr = ''
      child.stdout.on('data', chunk => (out += chunk))
      child.stderr.on('data', chunk => (stderr += chunk))
      child.on('error', reject)
      child.on('close', code => {
        if (code === 0 && out.trim()) {
          // -g might output separate video and audio URLs on two lines, pick the first
          const firstLine = out.trim().split('\n')[0].trim()
          resolve(firstLine)
        } else {
          reject(new Error(cleanYtDlpError(stderr) || `yt-dlp exited with code ${code}`))
        }
      })
    })

    return NextResponse.json({
      success: true,
      streamUrl
    })
  } catch (err: any) {
    console.error('Error in /api/stream:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Could not resolve stream URL for preview.' },
      { status: 500 }
    )
  }
}
