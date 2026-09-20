import { useMemo, useState } from 'react'
import { useApp } from '../hooks/useApp'
import PetCard from '../components/pets/PetCard'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { PlusIcon } from '../components/icons/Icons'

export default function MyPets() {
  const { pets } = useApp()
  const [query, setQuery] = useState('')
  const [species, setSpecies] = useState('all')

  const speciesOptions = useMemo(
    () => [...new Set(pets.map((pet) => pet.species))].sort(),
    [pets],
  )
  const filteredPets = pets.filter((pet) => {
    const search = query.trim().toLowerCase()
    const matchesSearch =
      !search ||
      pet.name.toLowerCase().includes(search) ||
      pet.breed.toLowerCase().includes(search)
    return matchesSearch && (species === 'all' || pet.species === species)
  })

  return (
    <div className="page my-pets">
      <PageHeader
        title="My Pets"
        description="Manage all your pets in one place."
        action={
          <Button to="/pets/add" icon={<PlusIcon size={16} />}>
            Add Pet
          </Button>
        }
      />

      {pets.length === 0 ? (
        <EmptyState
          icon={<span aria-hidden="true">🐾</span>}
          title="No pets yet"
          description="Add your first pet to start tracking their care schedule."
          action={
            <Button to="/pets/add" icon={<PlusIcon size={16} />}>
              Add Your First Pet
            </Button>
          }
        />
      ) : (
        <>
          <div className="pets-toolbar" role="search">
            <label className="sr-only" htmlFor="pet-search">Search pets</label>
            <input
              id="pet-search"
              type="search"
              placeholder="Search by name or breed"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <label className="sr-only" htmlFor="pet-species-filter">Filter by species</label>
            <select
              id="pet-species-filter"
              value={species}
              onChange={(event) => setSpecies(event.target.value)}
            >
              <option value="all">All species</option>
              {speciesOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          {filteredPets.length === 0 ? (
            <EmptyState
              icon={<span aria-hidden="true">⌕</span>}
              title="No pets match that search"
              description="Try a different name, breed, or species."
            />
          ) : (
            <div className="pet-grid">
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
