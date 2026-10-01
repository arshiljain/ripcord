import test from 'node:test'
import assert from 'node:assert/strict'
import {
  addToHistoryList,
  removeFromHistoryList,
  type HistoryItem
} from '../lib/history.js'

test('addToHistoryList inserts at beginning and deduplicates by URL', () => {
  const item1: HistoryItem = {
    id: '1',
    url: 'https://youtube.com/watch?v=1',
    title: 'Video 1',
    timestamp: Date.now()
  }
  const item2: HistoryItem = {
    id: '2',
    url: 'https://youtube.com/watch?v=2',
    title: 'Video 2',
    timestamp: Date.now() + 10
  }

  let list = addToHistoryList([], item1)
  assert.equal(list.length, 1)
  assert.equal(list[0].id, '1')

  list = addToHistoryList(list, item2)
  assert.equal(list.length, 2)
  assert.equal(list[0].id, '2')

  // Re-adding item1 moves it to the top
  const item1Updated: HistoryItem = { ...item1, timestamp: Date.now() + 20 }
  list = addToHistoryList(list, item1Updated)
  assert.equal(list.length, 2)
  assert.equal(list[0].id, '1')
})

test('addToHistoryList caps list size at 20 items', () => {
  let list: HistoryItem[] = []
  for (let i = 0; i < 25; i++) {
    list = addToHistoryList(list, {
      id: `id-${i}`,
      url: `https://youtube.com/watch?v=${i}`,
      title: `Video ${i}`,
      timestamp: Date.now() + i
    })
  }
  assert.equal(list.length, 20)
  assert.equal(list[0].id, 'id-24')
})

test('removeFromHistoryList removes specified item by ID', () => {
  const initial: HistoryItem[] = [
    { id: 'a', url: 'https://a.com', title: 'A', timestamp: 1 },
    { id: 'b', url: 'https://b.com', title: 'B', timestamp: 2 }
  ]
  const updated = removeFromHistoryList(initial, 'a')
  assert.equal(updated.length, 1)
  assert.equal(updated[0].id, 'b')
})
