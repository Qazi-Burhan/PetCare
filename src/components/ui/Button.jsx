import Link from 'next/link'

const variants = {
  primary: 'btn btn--primary',
  secondary: 'btn btn--secondary',
  ghost: 'btn btn--ghost',
  danger: 'btn btn--danger',
}

const sizes = {
  sm: 'btn--sm',
  md: '',
  lg: 'btn--lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  type = 'button',
  className = '',
  icon,
  ...props
}) {
  const classes = `${variants[variant]} ${sizes[size]} ${className}`.trim()

  const content = (
    <>
      {icon && <span className="btn__icon">{icon}</span>}
      {children}
    </>
  )

  if (to) {
    return (
      <Link href={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {content}
    </button>
  )
}
