import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import AddPet from '../legacy-pages/AddPet'
import AssistantChat from '../legacy-pages/AssistantChat'
import CareTasks from '../legacy-pages/CareTasks'
import Dashboard from '../legacy-pages/Dashboard'
import EditPet from '../legacy-pages/EditPet'
import MyPets from '../legacy-pages/MyPets'
import PetDetails from '../legacy-pages/PetDetails'
import Settings from '../legacy-pages/Settings'

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
        <Route path="assistant" element={<AssistantChat />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

