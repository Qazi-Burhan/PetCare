/**
 * TaskForm — modal dialog for creating and editing care tasks.
 *
 * Props:
 *   initialValues  – task shape to pre-fill (null/undefined → empty form)
 *   pets           – array of pet objects for the pet selector
 *   onSubmit       – (taskValues) => void
 *   onClose        – () => void  called on Cancel or backdrop click
 *   title          – modal heading string
 */
import { useEffect, useRef, useState } from 'react'
import Button from '../ui/Button'
import { CloseIcon } from '../icons/Icons'
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from './taskFormConstants'

function buildEmpty(pets) {
  return {
    title:    '',
    petId:    pets.length > 0 ? pets[0].id : '',
    category: 'Feeding',
    dueDate:  new Date().toISOString().split('T')[0],
    priority: 'medium',
  }
}

export default function TaskForm({ initialValues, pets, onSubmit, onClose, title }) {
  const [form, setForm] = useState(
    initialValues
      ? { ...initialValues }
      : buildEmpty(pets),
  )
  const [errors, setErrors] = useState({})
  const firstFieldRef = useRef(null)

  // Focus the first field when the modal opens
  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

  // Close on Escape key
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
    if (!form.title.trim())  next.title  = 'Task title is required.'
    if (!form.petId)         next.petId  = 'Please select a pet.'
    if (!form.dueDate)       next.dueDate = 'Due date is required.'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    onSubmit({
      title:    form.title.trim(),
      petId:    form.petId,
      category: form.category,
      dueDate:  form.dueDate,
      priority: form.priority,
    })
  }

  return (
    /* Backdrop */
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      {/* Dialog — stop propagation so clicks inside don't close */}
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 id="task-modal-title" className="modal__title">{title}</h2>
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
          {/* Title */}
          <div className="form-field">
            <label htmlFor="task-title">Task Title *</label>
            <input
              ref={firstFieldRef}
              id="task-title"
              name="title"
              type="text"
              placeholder="e.g. Morning walk"
              value={form.title}
              onChange={handleChange}
              aria-describedby={errors.title ? 'task-title-err' : undefined}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <span id="task-title-err" className="form-field__error" role="alert">
                {errors.title}
              </span>
            )}
          </div>

          {/* Pet */}
          <div className="form-field">
            <label htmlFor="task-pet">Pet *</label>
            <select
              id="task-pet"
              name="petId"
              value={form.petId}
              onChange={handleChange}
              aria-describedby={errors.petId ? 'task-pet-err' : undefined}
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
              <span id="task-pet-err" className="form-field__error" role="alert">
                {errors.petId}
              </span>
            )}
          </div>

          {/* Category + Priority row */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="task-category">Category</label>
              <select
                id="task-category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="form-field">
            <label htmlFor="task-duedate">Due Date *</label>
            <input
              id="task-duedate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              aria-describedby={errors.dueDate ? 'task-due-err' : undefined}
              aria-invalid={!!errors.dueDate}
            />
            {errors.dueDate && (
              <span id="task-due-err" className="form-field__error" role="alert">
                {errors.dueDate}
              </span>
            )}
          </div>

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialValues ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
