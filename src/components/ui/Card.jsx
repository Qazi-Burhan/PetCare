export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  as: Tag = 'article',
}) {
  const paddingClass = padding === 'none' ? '' : `card--padding-${padding}`

  return (
    <Tag
      className={`card ${paddingClass} ${hover ? 'card--hover' : ''} ${className}`.trim()}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ id, title, subtitle, action }) {
  return (
    <header className="card__header">
      <div>
        {title && <h3 id={id} className="card__title">{title}</h3>}
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="card__action">{action}</div>}
    </header>
  )
}
