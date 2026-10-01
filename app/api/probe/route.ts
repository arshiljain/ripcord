import { NextResponse } from 'next/server'
import { isProbablyUrl } from '@/lib/platforms'
import { probeUrl } from '@/lib/ytdlp-server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Malformed JSON payload.' },
        { status: 400 }
      )
    }

    const { url } = body || {}
    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        { success: false, error: 'URL is required.' },
        { status: 400 }
      )
    }

    if (!isProbablyUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL. Please enter a valid http or https web address.' },
        { status: 400 }
      )
    }

    const info = await probeUrl(url.trim())
    return NextResponse.json({
      success: true,
      info
    })
  } catch (err: any) {
    console.error('Error in /api/probe:', err)
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to extract video details from URL.'
      },
      { status: 500 }
    )
  }
}
