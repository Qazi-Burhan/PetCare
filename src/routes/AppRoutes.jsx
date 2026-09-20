import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import AddPet from '../pages/AddPet'
import CareTasks from '../pages/CareTasks'
import Dashboard from '../pages/Dashboard'
import EditPet from '../pages/EditPet'
import MyPets from '../pages/MyPets'
import PetDetails from '../pages/PetDetails'
import Settings from '../pages/Settings'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pets" element={<MyPets />} />
        <Route path="pets/add" element={<AddPet />} />
        <Route path="pets/:id" element={<PetDetails />} />
        <Route path="pets/:id/edit" element={<EditPet />} />
        <Route path="tasks" element={<CareTasks />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
