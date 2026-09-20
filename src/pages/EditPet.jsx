import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import PetForm from '../components/pets/PetForm'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'

export default function EditPet() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { getPetById, updatePet } = useApp()

  const pet = getPetById(id)

  // Guard: pet not found (invalid/deleted ID)
  if (!pet) {
    return (
      <div className="page edit-pet">
        <EmptyState
          icon={<span aria-hidden="true">🔍</span>}
          title="Pet not found"
          description="The pet you're trying to edit doesn't exist or may have been removed."
          action={
            <Button to="/pets" variant="secondary">
              Back to My Pets
            </Button>
          }
        />
      </div>
    )
  }

  const initialValues = {
    name:    pet.name,
    species: pet.species,
    breed:   pet.breed,
    age:     pet.age,
    weight:  pet.weight,
    gender:  pet.gender,
    avatar:  pet.avatar,
    avatarImage: pet.avatarImage ?? '',
    image:   pet.image ?? '',
    notes:   pet.notes ?? '',
  }

  const handleSubmit = (values) => {
    updatePet({ id: pet.id, ...values, createdAt: pet.createdAt })
    navigate(`/pets/${pet.id}`)
  }

  return (
    <div className="page edit-pet">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/pets">My Pets</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/pets/${pet.id}`}>{pet.name}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Edit</span>
      </nav>

      <PageHeader
        title={`Edit ${pet.name}`}
        description="Update your pet's details below."
      />

      <PetForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/pets/${pet.id}`)}
        submitLabel="Save Changes"
      />
    </div>
  )
}
