const variants = {
  default: 'badge',
  success: 'badge badge--success',
  warning: 'badge badge--warning',
  danger: 'badge badge--danger',
  info: 'badge badge--info',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`${variants[variant]} ${className}`.trim()}>{children}</span>
  )
}
