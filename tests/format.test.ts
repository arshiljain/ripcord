import test from 'node:test'
import assert from 'node:assert/strict'
import { formatBytes, formatDuration, formatSpeed } from '../lib/format.js'

test('formatBytes formats zero and bytes correctly', () => {
  assert.equal(formatBytes(0), '0 B')
  assert.equal(formatBytes(500), '500 B')
})

test('formatBytes formats KB, MB, and GB', () => {
  assert.equal(formatBytes(1024), '1 KB')
  assert.equal(formatBytes(1024 * 1024 * 15.5), '15.5 MB')
  assert.equal(formatBytes(1024 * 1024 * 1024 * 2.4), '2.4 GB')
})

test('formatDuration formats seconds into MM:SS and HH:MM:SS', () => {
  assert.equal(formatDuration(45), '0:45')
  assert.equal(formatDuration(125), '2:05')
  assert.equal(formatDuration(3665), '1:01:05')
})

test('formatSpeed formats bytes per second', () => {
  assert.equal(formatSpeed(1024 * 500), '500 KB/s')
  assert.equal(formatSpeed(1024 * 1024 * 3.5), '3.5 MB/s')
})
