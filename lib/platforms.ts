export type Platform = {
  key: string
  label: string
  color?: string
}

const PLATFORMS: Array<{ hosts: string[]; platform: Platform }> = [
  { hosts: ['youtube.com', 'youtu.be', 'music.youtube.com'], platform: { key: 'youtube', label: 'YouTube', color: '#ff0000' } },
  { hosts: ['x.com', 'twitter.com'], platform: { key: 'x', label: 'X / Twitter', color: '#ffffff' } },
  { hosts: ['instagram.com'], platform: { key: 'instagram', label: 'Instagram', color: '#e1306c' } },
  { hosts: ['threads.net', 'threads.com'], platform: { key: 'threads', label: 'Threads', color: '#ffffff' } },
  { hosts: ['tiktok.com'], platform: { key: 'tiktok', label: 'TikTok', color: '#00f2fe' } },
  { hosts: ['vimeo.com'], platform: { key: 'vimeo', label: 'Vimeo', color: '#1ab7ea' } },
  { hosts: ['twitch.tv'], platform: { key: 'twitch', label: 'Twitch', color: '#9146ff' } },
  { hosts: ['reddit.com'], platform: { key: 'reddit', label: 'Reddit', color: '#ff4500' } },
  { hosts: ['facebook.com', 'fb.watch'], platform: { key: 'facebook', label: 'Facebook', color: '#1877f2' } },
  { hosts: ['bsky.app'], platform: { key: 'bluesky', label: 'Bluesky', color: '#0085ff' } },
]

export function detectPlatform(url: string): Platform {
  let hostname: string
  try {
    hostname = new URL(url.trim()).hostname.toLowerCase()
  } catch {
    return { key: 'unknown', label: 'Unknown site' }
  }

  for (const { hosts, platform } of PLATFORMS) {
    if (hosts.some(h => hostname === h || hostname.endsWith(`.${h}`))) {
      return platform
    }
  }

  return { key: 'generic', label: hostname }
}

export function isProbablyUrl(input: string): boolean {
  try {
    const u = new URL(input.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
