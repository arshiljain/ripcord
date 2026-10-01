import test from 'node:test'
import assert from 'node:assert/strict'
import { detectPlatform, isProbablyUrl } from '../lib/platforms.js'

test('detectPlatform identifies major platforms', () => {
  assert.equal(detectPlatform('https://www.youtube.com/watch?v=dQw4w9WgXcQ').key, 'youtube')
  assert.equal(detectPlatform('https://youtu.be/dQw4w9WgXcQ').key, 'youtube')
  assert.equal(detectPlatform('https://x.com/user/status/123456789').key, 'x')
  assert.equal(detectPlatform('https://twitter.com/user/status/123456789').key, 'x')
  assert.equal(detectPlatform('https://www.instagram.com/reel/abc123/').key, 'instagram')
  assert.equal(detectPlatform('https://www.tiktok.com/@user/video/12345').key, 'tiktok')
  assert.equal(detectPlatform('https://www.reddit.com/r/videos/comments/123/title/').key, 'reddit')
  assert.equal(detectPlatform('https://threads.net/@user/post/abc').key, 'threads')
})

test('detectPlatform handles generic and invalid domains', () => {
  assert.equal(detectPlatform('https://example.com/video.mp4').key, 'generic')
  assert.equal(detectPlatform('not-a-url').key, 'unknown')
})

test('isProbablyUrl detects valid URLs', () => {
  assert.equal(isProbablyUrl('https://youtube.com'), true)
  assert.equal(isProbablyUrl('http://x.com/test'), true)
  assert.equal(isProbablyUrl('not a url'), false)
  assert.equal(isProbablyUrl('   '), false)
})
