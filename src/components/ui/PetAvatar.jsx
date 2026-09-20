import { useState } from 'react'

export default function PetAvatar({ emoji, image, name, size = 'md' }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?'
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div
      className={`pet-avatar pet-avatar--${size}`}
      aria-hidden={!image || imageFailed}
      title={name}
    >
      {image && !imageFailed ? (
        <img
          src={image}
          alt={`${name} the pet`}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{emoji || initial}</span>
      )}
    </div>
  )
}
