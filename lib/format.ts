export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const idx = Math.min(i, units.length - 1)
  const val = bytes / Math.pow(1024, idx)
  return `${idx === 0 ? val.toFixed(0) : val.toFixed(1).replace(/\.0$/, '')} ${units[idx]}`
}

export function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '0:00'
  const s = Math.floor(seconds)
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const secs = s % 60

  const paddedSecs = secs.toString().padStart(2, '0')
  if (hours > 0) {
    const paddedMins = minutes.toString().padStart(2, '0')
    return `${hours}:${paddedMins}:${paddedSecs}`
  }
  return `${minutes}:${paddedSecs}`
}

export function formatSpeed(bytesPerSec?: number): string {
  if (!bytesPerSec || bytesPerSec <= 0) return '0 B/s'
  return `${formatBytes(bytesPerSec)}/s`
}

export function formatEta(seconds?: number): string {
  if (seconds === undefined || seconds === null || seconds < 0) return '--:--'
  return formatDuration(seconds)
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 1)}…`
}
