'use client'

import { StrictMode, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../src/context/AppContext'
import App from '../src/App'

export default function ClientApp() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), []) // eslint-disable-line react-hooks/set-state-in-effect

  if (!mounted) return null

  return (
    <StrictMode>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </StrictMode>
  )
}
