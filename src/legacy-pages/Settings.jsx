import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'

export default function Settings() {
  const { settings, updateSettings, resetData } = useApp()

  // `overrides` holds only the fields the user has changed since the last
  // save or reset. The rendered form merges context `settings` (always
  // up-to-date after a reset) with any in-progress edits on top.
  const [overrides, setOverrides] = useState({})
  const [saved, setSaved] = useState(false)

  // The form always reflects: persisted settings + any unsaved edits.
  const form = { ...settings, ...overrides }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setOverrides((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setSaved(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    updateSettings(form)
    // Clear overrides — the saved values are now in context/settings.
    setOverrides({})
    setSaved(true)
  }

  const handleReset = () => {
    if (window.confirm('Reset all data to sample defaults? This cannot be undone.')) {
      resetData()
      // Clear any unsaved edits so the form immediately shows the
      // default settings that resetData() places into context.
      setOverrides({})
      setSaved(false)
    }
  }

  return (
    <div className="page settings">
      <PageHeader
        title="Settings"
        description="Manage your profile and application preferences."
      />

      <Card padding="lg" className="form-card">
        <form className="settings-form" onSubmit={handleSubmit}>
          <fieldset className="pet-form__section">
            <legend className="pet-form__legend">Profile</legend>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="ownerName">Your Name</label>
                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  value={form.ownerName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="pet-form__section">
            <legend className="pet-form__legend">Preferences</legend>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="reminderTime">Daily Reminder Time</label>
                <input
                  id="reminderTime"
                  name="reminderTime"
                  type="time"
                  value={form.reminderTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="theme">Theme</label>
                <select id="theme" name="theme" value={form.theme} onChange={handleChange}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            <div className="form-field form-field--checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={form.notifications}
                  onChange={handleChange}
                />
                <span>Enable care reminders and notifications</span>
              </label>
            </div>
          </fieldset>

          <div className="form-actions">
            {saved && (
              <span className="form-feedback form-feedback--success" role="status">
                Settings saved successfully
              </span>
            )}
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </Card>

      <Card padding="lg" className="settings__danger-zone">
        <h2 className="settings__danger-title">Data Management</h2>
        <p className="settings__danger-text">
          Reset the application to sample data. All your changes will be lost.
        </p>
        <Button type="button" variant="danger" onClick={handleReset}>
          Reset to Sample Data
        </Button>
      </Card>
    </div>
  )
}
