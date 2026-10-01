import test from 'node:test'
import assert from 'node:assert/strict'
import { buildChoices, scoreVideo, type VideoInfo, type RawFormat } from '../lib/choices'

test('scoreVideo prioritizes mp4 and avc', () => {
  const mp4Avc: RawFormat = { format_id: '1', ext: 'mp4', vcodec: 'avc1.640028', tbr: 2000 }
  const webm: RawFormat = { format_id: '2', ext: 'webm', vcodec: 'vp9', tbr: 2000 }
  assert.ok(scoreVideo(mp4Avc) > scoreVideo(webm))
})

test('buildChoices generates sorted video resolutions and audio choices', () => {
  const mockInfo: VideoInfo = {
    title: 'Test Ripcord Stream',
    duration: 120,
    formats: [
      { format_id: '137', ext: 'mp4', vcodec: 'avc1', height: 1080, filesize: 20_000_000 },
      { format_id: '136', ext: 'mp4', vcodec: 'avc1', height: 720, filesize: 10_000_000 },
      { format_id: '140', ext: 'm4a', acodec: 'mp4a.40.2', abr: 128, filesize: 2_000_000 }
    ]
  }

  const choices = buildChoices(mockInfo)
  assert.ok(choices.length >= 4)

  // Should have 1080p video
  const choice1080 = choices.find(c => c.label.includes('1080p'))
  assert.ok(choice1080)
  assert.equal(choice1080.kind, 'video')

  // Should have 720p video
  const choice720 = choices.find(c => c.label.includes('720p'))
  assert.ok(choice720)
  assert.equal(choice720.kind, 'video')

  // Should have MP3 and M4A audio choices
  const choiceMp3 = choices.find(c => c.id === 'audio-mp3')
  assert.ok(choiceMp3)
  assert.equal(choiceMp3.kind, 'audio')

  const choiceM4a = choices.find(c => c.id === 'audio-m4a')
  assert.ok(choiceM4a)
  assert.equal(choiceM4a.kind, 'audio')
})

test('buildChoices provides best available fallback when no heights are present', () => {
  const mockInfo: VideoInfo = {
    title: 'Generic Video',
    formats: []
  }

  const choices = buildChoices(mockInfo)
  assert.equal(choices.length, 3)
  assert.equal(choices[0].kind, 'video')
  assert.equal(choices[0].label, 'best available · mp4')
  assert.equal(choices[1].kind, 'audio')
  assert.equal(choices[2].kind, 'audio')
})
