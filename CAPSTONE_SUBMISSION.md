# PetCare Capstone Submission

## Project brief

PetCare helps pet owners organize pets, care tasks, appointments, vaccinations, and settings in one responsive application. The AI Pet Care Assistant extends that workflow with general educational guidance for everyday care questions while clearly directing urgent situations to a qualified veterinarian.

## Links

- Live application: https://pet-care-sqb3.vercel.app/
- Repository: https://github.com/Qazi-Burhan/PetCare

## Architecture

The app uses Next.js App Router with the existing React Context, reducer, localStorage persistence, and React Router UI. The assistant UI is [src/components/ai/ChatAssistant.jsx](./src/components/ai/ChatAssistant.jsx). The server-only streaming route is [app/api/chat/route.js](./app/api/chat/route.js). It uses the Vercel AI SDK with OpenRouter's OpenAI-compatible endpoint and the `openrouter/free` model router. Configuration and the safety prompt live in [src/lib/ai-config.js](./src/lib/ai-config.js). `OPENROUTER_API_KEY` is server-only.

## Verified checks

- `npm run lint`: passed
- `npm run build`: passed after the validation, health, and documentation additions
- `npm test`: 4 tests passed
- `npm run test:coverage`: 92.31% line coverage, 84.21% branch coverage, 100% function coverage for the tested validation module
- `/api/health`: locally returned HTTP 200 with a safe configuration boolean

## Safety and failure behavior

The assistant validates message count and size, rejects empty input, preserves partial output when stopped, and returns safe user-facing errors for missing configuration and provider failures. The UI includes a general-information and veterinarian disclaimer. Chat content is not persisted by PetCare; only the existing pet-management data is stored in localStorage.

## Deployment checklist

- [x] Production build configuration uses Next.js defaults
- [x] API key is excluded from client code and repository files
- [x] `.env.example` contains placeholders only
- [x] Server-side `/api/chat` route exists
- [x] Server-side `/api/health` route exists
- [ ] Confirm the rotated `OPENROUTER_API_KEY` is set in the hosting provider dashboard
- [ ] Verify live streaming, stopping, retry/error state, and mobile layout
- [ ] Run Lighthouse and an accessibility scanner and record actual scores

## Reflection draft — verify before submitting

The hardest part was aligning the streaming chat client and server with the current AI SDK message protocol while preserving the existing PetCare architecture. The main lesson was that a provider integration is more than a model call: validation, cancellation, safe errors, and clear medical boundaries are equally important. If I continued the project, I would add browser-level automated tests for streaming states and run a formal accessibility and performance audit earlier. One surprising lesson was how easily a small state update in an auto-scroll effect can create a render loop during token streaming.
