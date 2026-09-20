export const SPECIES_OPTIONS = [
  'Dog',
  'Cat',
  'Bird',
  'Rabbit',
  'Hamster',
  'Guinea Pig',
  'Turtle',
  'Fish',
  'Ferret',
  'Chinchilla',
  'Reptile',
  'Amphibian',
  'Other',
]

const avatarImage = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=240&q=82`

export const AVATAR_OPTIONS = [
  { value: '🐕', label: 'Dog', image: avatarImage('photo-1552053831-71594a27632d') },
  { value: '🐈', label: 'Cat', image: avatarImage('photo-1518791841217-8f162f1e1131') },
  { value: '🦜', label: 'Parrot', image: avatarImage('photo-1444464666168-49d633b86797') },
  { value: '🐇', label: 'Rabbit', image: avatarImage('photo-1585110396000-c9ffd4e4b308') },
  { value: '🐹', label: 'Hamster', image: avatarImage('photo-1425082661705-1834bfd09dca') },
  { value: '🐢', label: 'Turtle', image: avatarImage('photo-1500534623283-312aade485b7') },
  { value: '🐠', label: 'Fish', image: avatarImage('photo-1522069169874-c58ec4b76be5') },
  { value: '🦦', label: 'Ferret', image: avatarImage('photo-1543852786-1cf6624b9987') },
  { value: '🐿️', label: 'Chinchilla', image: avatarImage('photo-1535241749838-299277b6305f') },
  { value: '🦎', label: 'Reptile', image: avatarImage('photo-1500534623283-312aade485b7') },
  { value: '🐸', label: 'Amphibian', image: avatarImage('photo-1552728089-57bdde30beb3') },
]

export const DEFAULT_AVATAR_BY_SPECIES = Object.fromEntries(
  AVATAR_OPTIONS.map((option) => [option.label, option]),
)

export const EMPTY_PET_FORM = {
  name: '',
  species: 'Dog',
  breed: '',
  age: '',
  weight: '',
  gender: 'Male',
  avatar: '🐕',
  avatarImage: DEFAULT_AVATAR_BY_SPECIES.Dog.image,
  image: '',
  notes: '',
}
