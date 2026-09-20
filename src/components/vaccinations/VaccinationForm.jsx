/**
 * VaccinationForm — modal dialog for adding and editing vaccination records.
 *
 * Props:
 *   initialValues  – vaccination shape to pre-fill (undefined → empty form)
 *   petName        – displayed in the modal title for context
 *   onSubmit       – (vaccinationValues) => void
 *   onClose        – () => void
 *   title          – modal heading string
 */
import { useEffect, useRef, useState } from 'react'
import Button from '../ui/Button'
import { CloseIcon } from '../icons/Icons'

function buildEmpty() {
  return {
    name:    '',
    date:    new Date().toISOString().split('T')[0],
    nextDue: '',
    notes:   '',
  }
}

export default function VaccinationForm({ initialValues, onSubmit, onClose, title }) {
  const [form, setForm]     = useState(initialValues ? { ...initialValues } : buildEmpty())
  const [errors, setErrors] = useState({})
  const firstFieldRef       = useRef(null)

  // Focus first field on open
  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

  // Escape key closes modal
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
    if (!form.name.trim()) next.name = 'Vaccine name is required.'
    if (!form.date)        next.date = 'Date administered is required.'
    // nextDue must be after date if provided
    if (form.nextDue && form.date && form.nextDue <= form.date) {
      next.nextDue = 'Next due date must be after the administered date.'
    }
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    onSubmit({
      name:    form.name.trim(),
      date:    form.date,
      nextDue: form.nextDue || null,
      notes:   form.notes.trim(),
    })
  }

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
        aria-labelledby="vac-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 id="vac-modal-title" className="modal__title">{title}</h2>
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
          {/* Vaccine name */}
          <div className="form-field">
            <label htmlFor="vac-name">Vaccine Name *</label>
            <input
              ref={firstFieldRef}
              id="vac-name"
              name="name"
              type="text"
              placeholder="e.g. Rabies, DHPP, FVRCP"
              value={form.name}
              onChange={handleChange}
              aria-describedby={errors.name ? 'vac-name-err' : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <span id="vac-name-err" className="form-field__error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          {/* Date administered + Next due date */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="vac-date">Date Administered *</label>
              <input
                id="vac-date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                aria-describedby={errors.date ? 'vac-date-err' : undefined}
                aria-invalid={!!errors.date}
              />
              {errors.date && (
                <span id="vac-date-err" className="form-field__error" role="alert">
                  {errors.date}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="vac-nextdue">
                Next Due Date{' '}
                <span className="text-muted">(optional)</span>
              </label>
              <input
                id="vac-nextdue"
                name="nextDue"
                type="date"
                value={form.nextDue || ''}
                onChange={handleChange}
                aria-describedby={errors.nextDue ? 'vac-next-err' : undefined}
                aria-invalid={!!errors.nextDue}
              />
              {errors.nextDue && (
                <span id="vac-next-err" className="form-field__error" role="alert">
                  {errors.nextDue}
                </span>
              )}
            </div>
          </div>

          {/* Notes (optional) */}
          <div className="form-field">
            <label htmlFor="vac-notes">
              Notes <span className="text-muted">(optional)</span>
            </label>
            <textarea
              id="vac-notes"
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
              {initialValues ? 'Save Changes' : 'Add Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
