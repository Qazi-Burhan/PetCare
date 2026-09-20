import { useLocation } from 'react-router-dom'
import { useApp } from '../../hooks/useApp'
import Button from '../ui/Button'
import { MenuIcon, PlusIcon } from '../icons/Icons'

const pageTitles = {
  '/': 'Dashboard',
  '/pets': 'My Pets',
  '/pets/add': 'Add Pet',
  '/tasks': 'Care Tasks',
  '/settings': 'Settings',
}

function getPageTitle(pathname) {
  // Must check /edit before the general /pets/:id pattern
  if (/^\/pets\/[^/]+\/edit$/.test(pathname)) return 'Edit Pet'
  if (pathname.startsWith('/pets/') && pathname !== '/pets/add') return 'Pet Details'
  return pageTitles[pathname] || 'PetCare'
}

export default function Header({ onMenuToggle }) {
  const location = useLocation()
  const { settings } = useApp()
  const title = getPageTitle(location.pathname)

  return (
    <header className="header">
      <div className="header__left">
        <button
          type="button"
          className="header__menu-btn"
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </button>
        <div>
          <p className="header__greeting">Welcome back, {settings.ownerName}</p>
          <h2 className="header__title">{title}</h2>
        </div>
      </div>

      <div className="header__actions">
        <Button to="/pets/add" variant="primary" size="sm" icon={<PlusIcon size={16} />}>
          Add Pet
        </Button>
      </div>
    </header>
  )
}
