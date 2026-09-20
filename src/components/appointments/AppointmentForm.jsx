/**
 * AppointmentForm — modal dialog for creating and editing appointments.
 *
 * Props:
 *   initialValues  – appointment shape to pre-fill (undefined → empty form)
 *   petId          – pre-select a specific pet (used when opened from PetDetails)
 *   pets           – array of pet objects for the pet selector
 *   onSubmit       – (appointmentValues) => void
 *   onClose        – () => void
 *   title          – modal heading string
 */
import { useEffect, useRef, useState } from 'react'
import Button from '../ui/Button'
import { CloseIcon } from '../icons/Icons'
import { APPOINTMENT_TYPE_OPTIONS } from './appointmentFormConstants'

function buildEmpty(pets, lockedPetId) {
  return {
    title:    '',
    petId:    lockedPetId || (pets.length > 0 ? pets[0].id : ''),
    date:     new Date().toISOString().split('T')[0],
    time:     '09:00',
    location: '',
    notes:    '',
  }
}

export default function AppointmentForm({
  initialValues,
  petId: lockedPetId,
  pets,
  onSubmit,
  onClose,
  title,
}) {
  const [form, setForm] = useState(
    initialValues ? { ...initialValues } : buildEmpty(pets, lockedPetId),
  )
  const [errors, setErrors] = useState({})
  const firstFieldRef = useRef(null)

  // Focus first field on open
  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

  // Escape closes the modal
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim())    next.title    = 'Title is required.'
    if (!form.petId)           next.petId    = 'Please select a pet.'
    if (!form.date)            next.date     = 'Date is required.'
    if (!form.time)            next.time     = 'Time is required.'
    if (!form.location.trim()) next.location = 'Location is required.'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    onSubmit({
      title:    form.title.trim(),
      petId:    form.petId,
      date:     form.date,
      time:     form.time,
      location: form.location.trim(),
      notes:    form.notes.trim(),
    })
  }

  // When opened from PetDetails the pet is fixed — hide the selector
  const petIsLocked = Boolean(lockedPetId && !initialValues)

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="appt-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 id="appt-modal-title" className="modal__title">{title}</h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <form className="modal__body" onSubmit={handleSubmit} noValidate>
          {/* Title / Reason */}
          <div className="form-field">
            <label htmlFor="appt-title">Appointment Title *</label>
            <input
              ref={firstFieldRef}
              id="appt-title"
              name="title"
              type="text"
              list="appt-type-suggestions"
              placeholder="e.g. Annual Checkup"
              value={form.title}
              onChange={handleChange}
              aria-describedby={errors.title ? 'appt-title-err' : undefined}
              aria-invalid={!!errors.title}
            />
            {/* Datalist provides type suggestions without locking the user in */}
            <datalist id="appt-type-suggestions">
              {APPOINTMENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
            {errors.title && (
              <span id="appt-title-err" className="form-field__error" role="alert">
                {errors.title}
              </span>
            )}
          </div>

          {/* Pet — hidden when locked to a specific pet */}
          {!petIsLocked && (
            <div className="form-field">
              <label htmlFor="appt-pet">Pet *</label>
              <select
                id="appt-pet"
                name="petId"
                value={form.petId}
                onChange={handleChange}
                aria-describedby={errors.petId ? 'appt-pet-err' : undefined}
                aria-invalid={!!errors.petId}
              >
                <option value="">— Select a pet —</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.avatar} {pet.name}
                  </option>
                ))}
              </select>
              {errors.petId && (
                <span id="appt-pet-err" className="form-field__error" role="alert">
                  {errors.petId}
                </span>
              )}
            </div>
          )}

          {/* Date + Time */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="appt-date">Date *</label>
              <input
                id="appt-date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                aria-describedby={errors.date ? 'appt-date-err' : undefined}
                aria-invalid={!!errors.date}
              />
              {errors.date && (
                <span id="appt-date-err" className="form-field__error" role="alert">
                  {errors.date}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="appt-time">Time *</label>
              <input
                id="appt-time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                aria-describedby={errors.time ? 'appt-time-err' : undefined}
                aria-invalid={!!errors.time}
              />
              {errors.time && (
                <span id="appt-time-err" className="form-field__error" role="alert">
                  {errors.time}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="form-field">
            <label htmlFor="appt-location">Location *</label>
            <input
              id="appt-location"
              name="location"
              type="text"
              placeholder="e.g. Happy Paws Clinic"
              value={form.location}
              onChange={handleChange}
              aria-describedby={errors.location ? 'appt-loc-err' : undefined}
              aria-invalid={!!errors.location}
            />
            {errors.location && (
              <span id="appt-loc-err" className="form-field__error" role="alert">
                {errors.location}
              </span>
            )}
          </div>

          {/* Notes (optional) */}
          <div className="form-field">
            <label htmlFor="appt-notes">Notes <span className="text-muted">(optional)</span></label>
            <textarea
              id="appt-notes"
              name="notes"
              rows="2"
              placeholder="Any additional details..."
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialValues ? 'Save Changes' : 'Add Appointment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
