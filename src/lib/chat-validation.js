export const CHAT_LIMITS = {
  maxMessages: 20,
  maxMessageCharacters: 4000,
  maxConversationCharacters: 16000,
}

export function getMessageText(message) {
  if (typeof message?.content === 'string') {
    return message.content.trim()
  }

  return (message?.parts || [])
    .filter((part) => part?.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('')
    .trim()
}

export function validateChatMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, message: 'Please enter a message before sending.' }
  }

  if (messages.length > CHAT_LIMITS.maxMessages) {
    return { ok: false, message: 'This conversation is too long. Please start a new chat.' }
  }

  let totalCharacters = 0
  for (const message of messages) {
    const text = getMessageText(message)
    if (!text) continue

    if (text.length > CHAT_LIMITS.maxMessageCharacters) {
      return {
        ok: false,
        message: `Each message must be ${CHAT_LIMITS.maxMessageCharacters.toLocaleString()} characters or fewer.`,
      }
    }

    totalCharacters += text.length
  }

  if (totalCharacters > CHAT_LIMITS.maxConversationCharacters) {
    return { ok: false, message: 'Please shorten the conversation and try again.' }
  }

  if (!messages.some((message) => getMessageText(message))) {
    return { ok: false, message: 'Please enter a message before sending.' }
  }

  return { ok: true }
}
