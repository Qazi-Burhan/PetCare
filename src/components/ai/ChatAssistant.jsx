'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowDownIcon, BotIcon, SendIcon, SparklesIcon, StopIcon } from '../icons/Icons'

function ChatMessage({ role, content }) {
  const isUser = role === 'user'

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
      <div className="chat-message__avatar" aria-hidden="true">
        {isUser ? 'You' : 'AI'}
      </div>
      <div className="chat-message__bubble">
        <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

function getMessageText(message) {
  if (typeof message.content === 'string') {
    return message.content
  }

  return (message.parts || [])
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
}

export default function ChatAssistant() {
  const scrollAreaRef = useRef(null)
  const [showJumpToLatest, setShowJumpToLatest] = useState(false)
  const [input, setInput] = useState('')

  const { messages, sendMessage, regenerate, status, stop, error } = useChat({
    api: '/api/chat',
  })
  const isLoading = status === 'submitted' || status === 'streaming'

  const scrollToBottom = (behavior = 'auto') => {
    const container = scrollAreaRef.current
    if (!container) return

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    })
  }

  useEffect(() => {
    const container = scrollAreaRef.current
    if (!container) return

    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight)
    const isAtBottom = distanceFromBottom <= 64

    const shouldShowJumpButton = !isAtBottom && messages.length > 0
    setShowJumpToLatest((current) =>
      current === shouldShowJumpButton ? current : shouldShowJumpButton,
    )

    if (isAtBottom) {
      scrollToBottom('smooth')
    }
  }, [messages, isLoading])

  const handleScroll = () => {
    const container = scrollAreaRef.current
    if (!container) return

    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight)
    setShowJumpToLatest(distanceFromBottom > 64 && messages.length > 0)
  }

  const latestMessage = messages[messages.length - 1]
  const showThinking =
    isLoading &&
    (!latestMessage || latestMessage.role !== 'assistant' || !getMessageText(latestMessage))

  const submitDisabled = isLoading || !input.trim()
  const errorMessage = (() => {
    if (!error?.message) return 'The assistant could not respond right now. Please try again.'

    try {
      const parsed = JSON.parse(error.message)
      return parsed.error || error.message
    } catch {
      return error.message
    }
  })()

  return (
    <section className="chat-assistant" aria-label="AI Pet Care Assistant chat">
      <header className="chat-assistant__header">
        <div className="chat-assistant__title-wrap">
          <span className="chat-assistant__icon" aria-hidden="true">
            <BotIcon size={22} />
          </span>
          <div>
            <h2 className="chat-assistant__title">AI Pet Care Assistant</h2>
            <p className="chat-assistant__subtitle">Helpful pet-care guidance, tailored for your routine.</p>
          </div>
        </div>
      </header>

      <div className="chat-assistant__container">
        <p className="chat-assistant__disclaimer" role="note">
          General educational information only — not a veterinary diagnosis or emergency treatment.
          Contact a qualified veterinarian for urgent concerns.
        </p>
        <div className="chat-assistant__messages" ref={scrollAreaRef} onScroll={handleScroll}>
          {messages.length === 0 ? (
            <div className="chat-assistant__empty-state">
              <span className="chat-assistant__sparkle" aria-hidden="true">
                <SparklesIcon size={18} />
              </span>
              <p>Ask about diet, symptoms, routines, or general pet care questions.</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} role={message.role} content={getMessageText(message)} />
            ))
          )}

          {showThinking && (
            <div className="chat-message chat-message--assistant">
              <div className="chat-message__avatar" aria-hidden="true">
                AI
              </div>
              <div className="chat-message__bubble chat-message__bubble--thinking" aria-live="polite">
                <span className="thinking-indicator" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {showJumpToLatest && (
          <button
            type="button"
            className="chat-assistant__jump"
            onClick={() => scrollToBottom('smooth')}
            aria-label="Jump to latest message"
          >
            <ArrowDownIcon size={16} />
            Jump to latest
          </button>
        )}

        <form
          className="chat-assistant__composer"
          onSubmit={(event) => {
            event.preventDefault()
            if (!input.trim() || isLoading) return
            const message = input.trim()
            setInput('')
            sendMessage({ text: message })
          }}
        >
          <label htmlFor="ai-petcare-input" className="sr-only">
            Message the AI Pet Care Assistant
          </label>
          <textarea
            id="ai-petcare-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                if (!submitDisabled) {
                  const message = input.trim()
                  setInput('')
                  sendMessage({ text: message })
                }
              }
            }}
            rows={1}
            className="chat-assistant__input"
            placeholder="Ask about symptoms, routines, nutrition, or daily care..."
            aria-label="Message the AI Pet Care Assistant"
            disabled={isLoading}
          />

          {isLoading ? (
            <button
              type="button"
              className="chat-assistant__stop"
              onClick={stop}
              aria-label="Stop generation"
            >
              <StopIcon size={16} />
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="chat-assistant__send"
              disabled={submitDisabled}
              aria-label="Send message"
            >
              <SendIcon size={16} />
              Send
            </button>
          )}
        </form>

        {error && (
          <div className="chat-assistant__error" role="alert">
            <span>{errorMessage}</span>
            <button
              type="button"
              className="chat-assistant__retry"
              onClick={() => regenerate()}
              disabled={isLoading}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
