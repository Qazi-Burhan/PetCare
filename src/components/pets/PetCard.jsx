import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import PetAvatar from '../ui/PetAvatar'
import { ChevronRightIcon } from '../icons/Icons'

export default function PetCard({ pet }) {
  return (
    <Card hover padding="md" className="pet-card">
      <Link to={`/pets/${pet.id}`} className="pet-card__link">
        <PetAvatar
          emoji={pet.avatar}
          image={pet.image || pet.avatarImage}
          name={pet.name}
          size="lg"
        />
        <div className="pet-card__info">
          <h3 className="pet-card__name">{pet.name}</h3>
          <p className="pet-card__meta">
            {pet.breed} · {pet.age} yr{pet.age !== 1 ? 's' : ''}
          </p>
          <Badge variant="info">{pet.species}</Badge>
        </div>
        <ChevronRightIcon className="pet-card__chevron" />
      </Link>
    </Card>
  )
}
