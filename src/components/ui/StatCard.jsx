import Card from './Card'

export default function StatCard({ label, value, icon, trend, variant = 'default' }) {
  return (
    <Card as="div" className={`stat-card stat-card--${variant}`} padding="md">
      <div className="stat-card__inner">
        <div className="stat-card__content">
          <p className="stat-card__label">{label}</p>
          <p className="stat-card__value">{value}</p>
          {trend && <p className="stat-card__trend">{trend}</p>}
        </div>
        {icon && <div className="stat-card__icon">{icon}</div>}
      </div>
    </Card>
  )
}
