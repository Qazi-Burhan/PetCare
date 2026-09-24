import { createOpenAI } from '@ai-sdk/openai'
import { convertToModelMessages, streamText } from 'ai'
import { AI_CONFIG } from '../../../src/lib/ai-config'
import { validateChatMessages } from '../../../src/lib/chat-validation'

export async function POST(request) {
  try {
    const body = await request.json()
    const incomingMessages = Array.isArray(body?.messages) ? body.messages : []

    const validation = validateChatMessages(incomingMessages)
    if (!validation.ok) {
      return Response.json(
        { error: validation.message },
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

    let result
    try {
      result = streamText({
        model: openrouter(AI_CONFIG.model),
        system: AI_CONFIG.systemPrompt,
        temperature: AI_CONFIG.temperature,
        maxTokens: AI_CONFIG.maxTokens,
        messages: await convertToModelMessages(incomingMessages),
      })
    } catch {
      return Response.json(
        { error: 'The assistant is temporarily unavailable. Please try again.' },
        { status: 502 },
      )
    }

    return result.toUIMessageStreamResponse({
      onError: () => 'The assistant could not complete this response. Please try again.',
    })
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
