/**
 * Returns today's date as a YYYY-MM-DD string using local time.
 * Centralised here so all pages stay in sync with the same logic.
 */
export function getTodayString() {
  const now  = new Date()
  const yyyy = now.getFullYear()
  const mm   = String(now.getMonth() + 1).padStart(2, '0')
  const dd   = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Returns a YYYY-MM-DD string for a date N days from today (local time).
 * Useful for lookahead windows, e.g. "due within 7 days".
 */
export function getDateInDays(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
