import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const closeMobileNav = () => setMobileNavOpen(false)

  return (
    <div className="app-layout">
      <Sidebar />

      <div
        className={`sidebar-overlay ${mobileNavOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={closeMobileNav}
        aria-hidden="true"
      />

      <Sidebar
        isMobile
        isOpen={mobileNavOpen}
        onClose={closeMobileNav}
        onNavigate={closeMobileNav}
      />

      <div className="app-layout__main">
        <Header onMenuToggle={() => setMobileNavOpen(true)} />
        <main className="app-layout__content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
