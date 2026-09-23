import { createOpenAI } from '@ai-sdk/openai'
import { convertToModelMessages, streamText } from 'ai'
import { AI_CONFIG } from '../../../src/lib/ai-config'

function hasText(messages) {
  return Array.isArray(messages) && messages.some((message) => {
    if (typeof message?.content === 'string') return message.content.trim().length > 0
    return (message?.parts || []).some(
      (part) => part?.type === 'text' && typeof part.text === 'string' && part.text.trim(),
    )
  })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const incomingMessages = Array.isArray(body?.messages) ? body.messages : []

    if (!hasText(incomingMessages)) {
      return Response.json(
        { error: 'Please enter a message before sending.' },
        { status: 400 },
      )
    }

    const apiKey = globalThis.process?.env?.OPENROUTER_API_KEY

    if (!apiKey) {
      return Response.json(
        {
          error: 'The AI Pet Care Assistant is not configured yet. Add OPENROUTER_API_KEY to your environment.',
        },
        { status: 503 },
      )
    }

    const openrouter = createOpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'PetCare AI Pet Care Assistant',
      },
    })

    const result = streamText({
      model: openrouter(AI_CONFIG.model),
      system: AI_CONFIG.systemPrompt,
      temperature: AI_CONFIG.temperature,
      maxTokens: AI_CONFIG.maxTokens,
      messages: await convertToModelMessages(incomingMessages),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('AI chat request failed', error)

    return Response.json(
      {
        error: 'The assistant could not respond right now. Please try again in a moment.',
      },
      { status: 500 },
    )
  }
}
