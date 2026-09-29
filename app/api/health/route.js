export function GET() {
  return Response.json({
    status: 'ok',
    service: 'petcare',
    aiConfigured: Boolean(globalThis.process?.env?.OPENROUTER_API_KEY),
    timestamp: new Date().toISOString(),
  })
}
