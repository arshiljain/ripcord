import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { ensureServerYtDlp, findFfmpeg, cleanYtDlpError } from '@/lib/ytdlp-server'
import { isProbablyUrl } from '@/lib/platforms'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    const choiceId = searchParams.get('choiceId') || 'video-best'
    const title = searchParams.get('title') || 'ripcord-stream'

    if (!url || !isProbablyUrl(url)) {
      return new NextResponse('Invalid or missing URL parameter', { status: 400 })
    }

    const ytdlp = await ensureServerYtDlp()
    const ffmpeg = await findFfmpeg()

    const isAudio = choiceId.includes('audio')
    const ext = isAudio ? 'mp3' : 'mp4'
    const safeTitle = title.replace(/[/\\?%*:|"<>]/g, '_').trim().slice(0, 80)
    const filename = `${safeTitle || 'ripcord'}.${ext}`

    const tmpDir = os.tmpdir()
    const uniqueId = `ripcord-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    const outputTemplate = path.join(tmpDir, `${uniqueId}.%(ext)s`)

    // Determine format flags
    const args: string[] = [url, '--no-playlist', '--no-warnings', '--no-simulate']

    if (isAudio) {
      args.push('-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '0')
    } else {
      const heightMatch = choiceId.match(/video-(\d+)/)
      if (heightMatch) {
        const height = heightMatch[1]
        args.push(
          '-f',
          `bv*[height=${height}]+ba/b[height=${height}]/bv*[height<=${height}]+ba/b`,
          '--merge-output-format',
          'mp4'
        )
      } else {
        args.push('-f', 'bv*+ba/b', '--merge-output-format', 'mp4')
      }
    }

    if (ffmpeg) {
      args.push('--ffmpeg-location', ffmpeg)
    }

    args.push('-o', outputTemplate)

    // Execute download
    await new Promise<void>((resolve, reject) => {
      const child = spawn(ytdlp, args)
      let stderr = ''
      child.stderr.on('data', chunk => (stderr += chunk))
      child.on('error', reject)
      child.on('close', code => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(cleanYtDlpError(stderr) || `yt-dlp exited with code ${code}`))
        }
      })
    })

    // Find the produced file
    const files = await fsPromises.readdir(tmpDir)
    const matchingFile = files.find(f => f.startsWith(uniqueId))

    if (!matchingFile) {
      throw new Error('Downloaded file not found on disk.')
    }

    const filePath = path.join(tmpDir, matchingFile)
    const stat = await fsPromises.stat(filePath)
    const fileStream = fs.createReadStream(filePath)

    // Cleanup file when stream closes
    fileStream.on('close', async () => {
      try {
        await fsPromises.unlink(filePath)
      } catch {
        // ignore cleanup error
      }
    })

    const webStream = new ReadableStream({
      start(controller) {
        fileStream.on('data', chunk => controller.enqueue(chunk))
        fileStream.on('end', () => controller.close())
        fileStream.on('error', err => controller.error(err))
      },
      cancel() {
        fileStream.destroy()
      }
    })

    const contentType = isAudio ? 'audio/mpeg' : 'video/mp4'

    return new NextResponse(webStream as any, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (err: any) {
    console.error('Error in /api/download:', err)
    return new NextResponse(`Download error: ${err.message || 'Unknown error'}`, { status: 500 })
  }
}
