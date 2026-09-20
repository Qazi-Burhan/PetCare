const STORAGE_KEY = 'petcare_app_data'

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage may be unavailable in private browsing or when quota is exceeded.
  }
}

export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY)
}
