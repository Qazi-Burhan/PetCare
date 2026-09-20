/**
 * PetForm — shared controlled form used by both AddPet and EditPet pages.
 *
 * Props:
 *   initialValues  – object matching the form shape (required)
 *   onSubmit       – (formValues) => void  called with validated data
 *   onCancel       – () => void
 *   submitLabel    – string shown on the submit button (default "Save Pet")
 */
import { useState } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import PetAvatar from '../ui/PetAvatar'
import {
  AVATAR_OPTIONS,
  DEFAULT_AVATAR_BY_SPECIES,
  SPECIES_OPTIONS,
} from './petFormConstants'

export default function PetForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save Pet',
}) {
  const [form, setForm] = useState({ ...initialValues })
  const [imageError, setImageError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'species') {
      const defaultAvatar = DEFAULT_AVATAR_BY_SPECIES[value] ?? AVATAR_OPTIONS[0]
      setForm((prev) => ({
        ...prev,
        species: value,
        avatar: defaultAvatar.value,
        avatarImage: defaultAvatar.image,
      }))
      return
    }

    if (name === 'avatar') {
      const selectedAvatar = AVATAR_OPTIONS.find((option) => option.value === value)
      setForm((prev) => ({
        ...prev,
        avatar: value,
        avatarImage: selectedAvatar?.image ?? prev.avatarImage,
      }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Please choose an image smaller than 5 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result }))
      setImageError('')
    }
    reader.onerror = () => setImageError('The image could not be loaded. Please try again.')
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: '' }))
    setImageError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const age    = Number(form.age)    || 0
    const weight = Number(form.weight) || 0

    if (!form.name.trim()) return
    if (age    < 0) return
    if (weight < 0) return

    onSubmit({
      name:    form.name.trim(),
      species: form.species,
      breed:   form.breed.trim(),
      age,
      weight,
      gender:  form.gender,
      avatar:  form.avatar,
      avatarImage: form.avatarImage || '',
      image:   form.image || '',
      notes:   form.notes.trim(),
    })
  }

  const isSubmitDisabled =
    !form.name.trim() ||
    Number(form.age)    < 0 ||
    Number(form.weight) < 0

  return (
    <Card padding="lg" className="form-card">
      <form className="pet-form" onSubmit={handleSubmit} noValidate>
        {/* ── Basic Information ── */}
        <fieldset className="pet-form__section">
          <legend className="pet-form__legend">Basic Information</legend>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="pet-name">Pet Name *</label>
              <input
                id="pet-name"
                name="name"
                type="text"
                required
                placeholder="e.g. Buddy"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="pet-species">Species</label>
              <select
                id="pet-species"
                name="species"
                value={form.species}
                onChange={handleChange}
              >
                {SPECIES_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="pet-breed">Breed</label>
              <input
                id="pet-breed"
                name="breed"
                type="text"
                placeholder="e.g. Golden Retriever"
                value={form.breed}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="pet-gender">Gender</label>
              <select
                id="pet-gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* ── Details ── */}
        <fieldset className="pet-form__section">
          <legend className="pet-form__legend">Details</legend>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="pet-age">Age (years)</label>
              <input
                id="pet-age"
                name="age"
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={form.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="pet-weight">Weight (kg)</label>
              <input
                id="pet-weight"
                name="weight"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={form.weight}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="pet-picture">Pet Picture</label>
            <div className="pet-picture-picker">
              <PetAvatar
                emoji={form.avatar}
                image={form.image || form.avatarImage}
                name={form.name || 'Pet'}
                size="lg"
              />
              <div className="pet-picture-picker__controls">
                <input
                  id="pet-picture"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                />
                <p className="form-helper">JPG, PNG, WebP or GIF up to 5 MB.</p>
                {form.image && (
                  <Button type="button" variant="ghost" size="sm" onClick={removeImage}>
                    Remove picture
                  </Button>
                )}
                {imageError && <p className="form-error" role="alert">{imageError}</p>}
              </div>
            </div>
          </div>

          <div className="form-field">
            <label>Avatar</label>
            <div
              className="avatar-picker"
              role="radiogroup"
              aria-label="Choose pet avatar"
            >
              {AVATAR_OPTIONS.map((option) => (
                <label key={option.value} className="avatar-picker__option">
                  <input
                    type="radio"
                    name="avatar"
                    value={option.value}
                    checked={form.avatar === option.value}
                    onChange={handleChange}
                  />
                  <span className="avatar-picker__emoji">
                    <img src={option.image} alt="" loading="lazy" />
                    <span aria-hidden="true">{option.value}</span>
                    <small>{option.label}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="pet-notes">Notes</label>
            <textarea
              id="pet-notes"
              name="notes"
              rows="3"
              placeholder="Any special care instructions..."
              value={form.notes}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        <div className="form-actions">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitDisabled}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  )
}
