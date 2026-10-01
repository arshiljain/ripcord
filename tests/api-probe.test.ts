import test from 'node:test'
import assert from 'node:assert/strict'
import { POST } from '../app/api/probe/route.js'

test('POST /api/probe rejects missing or empty URL with 400', async () => {
  const req = new Request('http://localhost:3000/api/probe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })

  const res = await POST(req as any)
  assert.equal(res.status, 400)
  const data = await res.json()
  assert.equal(data.success, false)
  assert.match(data.error, /URL is required/i)
})

test('POST /api/probe rejects invalid URL formats with 400', async () => {
  const req = new Request('http://localhost:3000/api/probe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'not-a-valid-url' })
  })

  const res = await POST(req as any)
  assert.equal(res.status, 400)
  const data = await res.json()
  assert.equal(data.success, false)
  assert.match(data.error, /Invalid URL/i)
})
