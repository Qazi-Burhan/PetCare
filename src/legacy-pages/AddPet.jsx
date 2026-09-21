import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import PetForm from '../components/pets/PetForm'
import { EMPTY_PET_FORM } from '../components/pets/petFormConstants'
import PageHeader from '../components/ui/PageHeader'

export default function AddPet() {
  const navigate  = useNavigate()
  const { addPet } = useApp()

  const handleSubmit = (values) => {
    const newPet = {
      id: crypto.randomUUID(),
      ...values,
      createdAt: new Date().toISOString().split('T')[0],
    }
    addPet(newPet)
    navigate(`/pets/${newPet.id}`)
  }

  return (
    <div className="page add-pet">
      <PageHeader
        title="Add New Pet"
        description="Fill in the details below to add a pet to your profile."
      />
      <PetForm
        initialValues={EMPTY_PET_FORM}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/pets')}
        submitLabel="Save Pet"
      />
    </div>
  )
}
