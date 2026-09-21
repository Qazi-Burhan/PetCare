async function getHealthData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return { ok: false, message: `Health endpoint returned ${response.status}.` }
    }

    const data = await response.json()
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'The health endpoint could not be reached.' }
  }
}

export default async function HealthPage() {
  const result = await getHealthData()

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.25rem' }}>
      <p style={{ color: 'var(--color-primary)', fontWeight: 700 }}>PetCare / Operations</p>
      <h1 style={{ margin: '0.5rem 0 0.75rem' }}>Health check</h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Server-rendered data check with a five-minute revalidation window.
      </p>
      <section
        aria-live="polite"
        style={{
          marginTop: '2rem',
          padding: '1.25rem',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-surface)',
        }}
      >
        <strong>{result.ok ? 'Healthy' : 'Unavailable'}</strong>
        <pre style={{ overflowX: 'auto', marginTop: '1rem' }}>
          {JSON.stringify(result.ok ? result.data : { error: result.message }, null, 2)}
        </pre>
      </section>
    </main>
  )
}
