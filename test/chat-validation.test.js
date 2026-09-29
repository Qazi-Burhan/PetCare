import test from 'node:test'
import assert from 'node:assert/strict'
import { validateChatMessages } from '../src/lib/chat-validation.js'

test('accepts a normal UI message', () => {
  assert.deepEqual(
    validateChatMessages([{ role: 'user', parts: [{ type: 'text', text: 'How often should I feed my cat?' }] }]),
    { ok: true },
  )
})

test('rejects empty messages', () => {
  assert.equal(validateChatMessages([{ role: 'user', parts: [{ type: 'text', text: '   ' }] }]).ok, false)
})

test('rejects oversized messages', () => {
  assert.equal(
    validateChatMessages([{ role: 'user', content: 'x'.repeat(4001) }]).ok,
    false,
  )
})

test('rejects overly long conversations', () => {
  assert.equal(
    validateChatMessages(Array.from({ length: 21 }, () => ({ role: 'user', content: 'question' }))).ok,
    false,
  )
})
