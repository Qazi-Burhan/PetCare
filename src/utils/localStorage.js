const STORAGE_KEY = 'petcare_app_data'

function isStoredAppData(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      Array.isArray(value.pets) &&
      Array.isArray(value.careTasks) &&
      Array.isArray(value.appointments) &&
      Array.isArray(value.vaccinations) &&
      value.settings &&
      typeof value.settings === 'object',
  )
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return isStoredAppData(parsed) ? parsed : null
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
