import { NavLink } from 'react-router-dom'
import {
  DashboardIcon,
  PawIcon,
  PetsIcon,
  PlusIcon,
  SettingsIcon,
  TasksIcon,
  CloseIcon,
} from '../icons/Icons'

const navItems = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/pets', label: 'My Pets', icon: PetsIcon },
  { to: '/pets/add', label: 'Add Pet', icon: PlusIcon },
  { to: '/tasks', label: 'Care Tasks', icon: TasksIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Sidebar({ onNavigate, isMobile = false, onClose, isOpen = false }) {
  const classes = [
    'sidebar',
    isMobile ? 'sidebar--mobile' : 'sidebar--desktop',
    isMobile && isOpen ? 'sidebar--mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside
      className={classes}
      aria-label={isMobile ? 'Mobile navigation' : 'Main navigation'}
      aria-hidden={isMobile ? !isOpen : undefined}
    >
      {isMobile && (
        <button
          type="button"
          className="sidebar__close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <CloseIcon />
        </button>
      )}

      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <PawIcon size={22} />
        </div>
        <div>
          <span className="sidebar__brand-name">PetCare</span>
          <span className="sidebar__brand-tag">Pet Management</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__nav-list">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
                onClick={onNavigate}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <p className="sidebar__footer-text">Keep your pets happy & healthy</p>
      </div>
    </aside>
  )
}
