import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '5rem 1.25rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-primary)', fontWeight: 700 }}>404</p>
      <h1>Page not found</h1>
      <p style={{ margin: '1rem 0 2rem', color: 'var(--color-text-secondary)' }}>
        This PetCare page does not exist.
      </p>
      <Link href="/" className="btn btn--primary">Back to dashboard</Link>
    </main>
  )
}
