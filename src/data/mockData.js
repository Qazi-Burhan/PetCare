// Starter data is only used when no local PetCare data exists yet.
// Images are stable Unsplash CDN assets with an emoji fallback in PetAvatar.
const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`

export const mockPets = [
  { id: '1', name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', age: 3, weight: 32, gender: 'Male', avatar: '🐕', image: image('photo-1552053831-71594a27632d'), notes: 'Friendly and energetic. Loves morning walks.', createdAt: '2025-06-15' },
  { id: '2', name: 'Luna', species: 'Cat', breed: 'Siamese Cat', age: 2, weight: 4.5, gender: 'Female', avatar: '🐈', image: image('photo-1518791841217-8f162f1e1131'), notes: 'Indoor cat. Prefers wet food in the evening.', createdAt: '2025-08-20' },
  { id: '3', name: 'Coco', species: 'Bird', breed: 'Cockatiel', age: 1, weight: 0.09, gender: 'Female', avatar: '🦜', image: image('photo-1444464666168-49d633b86797'), notes: 'Likes fresh seeds and daily cage cleaning.', createdAt: '2025-11-02' },
  { id: '4', name: 'Maple', species: 'Dog', breed: 'Labrador Retriever', age: 5, weight: 28, gender: 'Female', avatar: '🐕', image: image('photo-1558788353-f76d92427f16'), notes: 'Loves swimming and playing fetch.', createdAt: '2025-12-12' },
  { id: '5', name: 'Atlas', species: 'Dog', breed: 'German Shepherd', age: 4, weight: 34, gender: 'Male', avatar: '🐕', image: image('photo-1568572933382-74d440642117'), notes: 'Calm, loyal, and always ready for a trail walk.', createdAt: '2026-01-04' },
  { id: '6', name: 'Koda', species: 'Dog', breed: 'Siberian Husky', age: 6, weight: 24, gender: 'Male', avatar: '🐕', image: image('photo-1605568427561-40dd23c2acea'), notes: 'Needs plenty of exercise and a cool sleeping spot.', createdAt: '2026-01-20' },
  { id: '7', name: 'Penny', species: 'Dog', breed: 'Beagle', age: 2, weight: 11, gender: 'Female', avatar: '🐕', image: image('photo-1505628346881-b72b27e84530'), notes: 'Curious scent hound with a big personality.', createdAt: '2026-02-14' },
  { id: '8', name: 'Mochi', species: 'Dog', breed: 'Shiba Inu', age: 3, weight: 9, gender: 'Female', avatar: '🐕', image: image('photo-1543466835-00a7907e9de1'), notes: 'Independent but loves a quiet cuddle.', createdAt: '2026-02-28' },
  { id: '9', name: 'Biscuit', species: 'Dog', breed: 'Pomeranian', age: 1, weight: 2.8, gender: 'Male', avatar: '🐕', image: image('photo-1589941013453-ec89f33b5e95'), notes: 'Small, bright, and happiest with gentle grooming.', createdAt: '2026-03-05' },
  { id: '10', name: 'Olive', species: 'Cat', breed: 'Persian Cat', age: 7, weight: 4.2, gender: 'Female', avatar: '🐈', image: image('photo-1573865526739-10659fec78a5'), notes: 'Enjoys a sunny window and daily coat brushing.', createdAt: '2026-03-11' },
  { id: '11', name: 'Theo', species: 'Cat', breed: 'British Shorthair', age: 4, weight: 5.8, gender: 'Male', avatar: '🐈', image: image('photo-1543852786-1cf6624b9987'), notes: 'Easygoing and fond of interactive toys.', createdAt: '2026-03-18' },
  { id: '12', name: 'Nala', species: 'Cat', breed: 'Maine Coon', age: 5, weight: 6.1, gender: 'Female', avatar: '🐈', image: image('photo-1514888286974-6c03e2ca1dba'), notes: 'Gentle giant who loves climbing shelves.', createdAt: '2026-03-25' },
  { id: '13', name: 'Miso', species: 'Cat', breed: 'Ragdoll', age: 3, weight: 4.8, gender: 'Male', avatar: '🐈', image: image('photo-1495360010541-f48722b34f7d'), notes: 'Affectionate and happiest near people.', createdAt: '2026-04-02' },
  { id: '14', name: 'Hazel', species: 'Rabbit', breed: 'Mini Lop', age: 2, weight: 1.7, gender: 'Female', avatar: '🐰', image: image('photo-1585110396000-c9ffd4e4b308'), notes: 'Enjoys fresh greens and supervised garden time.', createdAt: '2026-04-10' },
  { id: '15', name: 'Peanut', species: 'Hamster', breed: 'Syrian Hamster', age: 1, weight: 0.12, gender: 'Male', avatar: '🐹', image: image('photo-1425082661705-1834bfd09dca'), notes: 'Most active after sunset; loves cardboard tunnels.', createdAt: '2026-04-16' },
  { id: '16', name: 'Pip', species: 'Guinea Pig', breed: 'American Guinea Pig', age: 2, weight: 0.9, gender: 'Female', avatar: '🐹', image: image('photo-1540331547168-8b63109225b7'), notes: 'Talkative at mealtimes and loves bell pepper treats.', createdAt: '2026-04-21' },
  { id: '17', name: 'Shelly', species: 'Turtle', breed: 'Red-Eared Slider', age: 8, weight: 1.1, gender: 'Female', avatar: '🐢', image: image('photo-1500534623283-312aade485b7'), notes: 'Needs a warm basking platform and clean water.', createdAt: '2026-04-30' },
  { id: '18', name: 'Bubbles', species: 'Fish', breed: 'Betta Fish', age: 1, weight: 0.03, gender: 'Male', avatar: '🐠', image: image('photo-1522069169874-c58ec4b76be5'), notes: 'Thrives in a planted, gently filtered aquarium.', createdAt: '2026-05-05' },
  { id: '19', name: 'Willow', species: 'Bird', breed: 'Green-Cheek Conure', age: 3, weight: 0.07, gender: 'Female', avatar: '🦜', image: image('photo-1552728089-57bdde30beb3'), notes: 'Social and playful with supervised out-of-cage time.', createdAt: '2026-05-12' },
  { id: '20', name: 'Daisy', species: 'Rabbit', breed: 'Holland Lop', age: 4, weight: 1.5, gender: 'Female', avatar: '🐰', image: image('photo-1535241749838-299277b6305f'), notes: 'Gentle companion who enjoys enrichment toys.', createdAt: '2026-05-19' },
]

export const mockCareTasks = [
  { id: 't1', petId: '1', title: 'Morning walk', category: 'Exercise', dueDate: '2026-09-12', completed: false, priority: 'high' },
  { id: 't2', petId: '1', title: 'Feed breakfast', category: 'Feeding', dueDate: '2026-09-12', completed: true, priority: 'medium' },
  { id: 't3', petId: '2', title: 'Litter box cleaning', category: 'Grooming', dueDate: '2026-09-12', completed: false, priority: 'medium' },
  { id: 't4', petId: '2', title: 'Evening feeding', category: 'Feeding', dueDate: '2026-09-12', completed: false, priority: 'high' },
  { id: 't5', petId: '3', title: 'Cage cleaning', category: 'Grooming', dueDate: '2026-09-13', completed: false, priority: 'low' },
]

export const mockAppointments = [
  { id: 'a1', petId: '1', title: 'Annual checkup', date: '2026-09-18', time: '10:00', location: 'Happy Paws Clinic' },
  { id: 'a2', petId: '2', title: 'Vaccination booster', date: '2026-09-25', time: '14:30', location: 'City Vet Center' },
]

export const mockVaccinations = [
  { id: 'v1', petId: '1', name: 'Rabies', date: '2025-09-10', nextDue: '2026-09-10' },
  { id: 'v2', petId: '1', name: 'DHPP', date: '2025-06-01', nextDue: '2026-06-01' },
  { id: 'v3', petId: '2', name: 'FVRCP', date: '2025-08-15', nextDue: '2026-08-15' },
]

export const defaultSettings = {
  ownerName: 'Pet Parent',
  email: 'owner@example.com',
  notifications: true,
  theme: 'light',
  reminderTime: '08:00',
}
