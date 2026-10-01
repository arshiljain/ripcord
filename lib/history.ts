export type HistoryItem = {
  id: string
  url: string
  title: string
  thumbnail?: string
  uploader?: string
  duration?: number
  formatLabel?: string
  timestamp: number
}

const STORAGE_KEY = 'ripcord_history_v1'
const MAX_HISTORY = 20

export function addToHistoryList(list: HistoryItem[], item: HistoryItem): HistoryItem[] {
  // Filter out existing item with same URL if present
  const filtered = list.filter(i => i.url !== item.url)
  return [item, ...filtered].slice(0, MAX_HISTORY)
}

export function removeFromHistoryList(list: HistoryItem[], id: string): HistoryItem[] {
  return list.filter(i => i.id !== id)
}

export function loadHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHistory(items: HistoryItem[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)))
  } catch (err) {
    console.error('Failed to save Ripcord history to localStorage', err)
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
