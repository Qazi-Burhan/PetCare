import { useEffect, useMemo, useReducer } from 'react'
import { AppContext } from './context'
import {
  defaultSettings,
  mockAppointments,
  mockCareTasks,
  mockPets,
  mockVaccinations,
} from '../data/mockData'
import { loadFromStorage, saveToStorage } from '../utils/localStorage'

/**
 * Returns a fresh deep copy of the default state so that RESET_DATA
 * never shares array/object references with the imported mock data.
 */
function getDefaultState() {
  return {
    pets: mockPets.map((p) => ({ ...p })),
    careTasks: mockCareTasks.map((t) => ({ ...t })),
    appointments: mockAppointments.map((a) => ({ ...a })),
    vaccinations: mockVaccinations.map((v) => ({ ...v })),
    settings: { ...defaultSettings },
  }
}

const initialState = {
  ...getDefaultState(),
  isHydrated: false,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, isHydrated: true }
    case 'SET_PETS':
      return { ...state, pets: action.payload }
    case 'ADD_PET':
      return { ...state, pets: [...state.pets, action.payload] }
    case 'UPDATE_PET':
      return {
        ...state,
        pets: state.pets.map((pet) =>
          pet.id === action.payload.id ? { ...pet, ...action.payload } : pet,
        ),
      }
    case 'DELETE_PET':
      return {
        ...state,
        pets: state.pets.filter((pet) => pet.id !== action.payload),
      }
    // Removes the pet AND all associated tasks, appointments, vaccinations.
    case 'DELETE_PET_CASCADE': {
      const id = action.payload
      return {
        ...state,
        pets: state.pets.filter((pet) => pet.id !== id),
        careTasks: state.careTasks.filter((t) => t.petId !== id),
        appointments: state.appointments.filter((a) => a.petId !== id),
        vaccinations: state.vaccinations.filter((v) => v.petId !== id),
      }
    }
    case 'SET_CARE_TASKS':
      return { ...state, careTasks: action.payload }
    case 'ADD_TASK':
      return { ...state, careTasks: [...state.careTasks, action.payload] }
    case 'UPDATE_TASK':
      return {
        ...state,
        careTasks: state.careTasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task,
        ),
      }
    case 'DELETE_TASK':
      return {
        ...state,
        careTasks: state.careTasks.filter((task) => task.id !== action.payload),
      }
    case 'TOGGLE_TASK':
      return {
        ...state,
        careTasks: state.careTasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task,
        ),
      }
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] }
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map((appt) =>
          appt.id === action.payload.id ? { ...appt, ...action.payload } : appt,
        ),
      }
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter((appt) => appt.id !== action.payload),
      }
    case 'ADD_VACCINATION':
      return { ...state, vaccinations: [...state.vaccinations, action.payload] }
    case 'UPDATE_VACCINATION':
      return {
        ...state,
        vaccinations: state.vaccinations.map((vac) =>
          vac.id === action.payload.id ? { ...vac, ...action.payload } : vac,
        ),
      }
    case 'DELETE_VACCINATION':
      return {
        ...state,
        vaccinations: state.vaccinations.filter((vac) => vac.id !== action.payload),
      }
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      }
    case 'RESET_DATA':
      // Use fresh copies so the reset state is independent of module-level references.
      return { ...getDefaultState(), isHydrated: true }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    const stored = loadFromStorage()
    if (stored) {
      dispatch({ type: 'HYDRATE', payload: stored })
    } else {
      dispatch({ type: 'HYDRATE', payload: {} })
    }
  }, [])

  // Persist to localStorage whenever state changes (after hydration).
  useEffect(() => {
    if (!state.isHydrated) return

    const persistable = { ...state }
    delete persistable.isHydrated
    saveToStorage(persistable)
  }, [state])

  // Apply theme to <html> data-theme attribute whenever the setting changes.
  useEffect(() => {
    if (!state.isHydrated) return
    document.documentElement.setAttribute('data-theme', state.settings.theme ?? 'light')
  }, [state.settings.theme, state.isHydrated])

  const actions = useMemo(
    () => ({
      addPet: (pet) => dispatch({ type: 'ADD_PET', payload: pet }),
      updatePet: (pet) => dispatch({ type: 'UPDATE_PET', payload: pet }),
      deletePet: (id) => dispatch({ type: 'DELETE_PET', payload: id }),
      deletePetCascade: (id) => dispatch({ type: 'DELETE_PET_CASCADE', payload: id }),
      toggleTask: (id) => dispatch({ type: 'TOGGLE_TASK', payload: id }),
      addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
      updateTask: (task) => dispatch({ type: 'UPDATE_TASK', payload: task }),
      deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
      addAppointment: (appt) => dispatch({ type: 'ADD_APPOINTMENT', payload: appt }),
      updateAppointment: (appt) => dispatch({ type: 'UPDATE_APPOINTMENT', payload: appt }),
      deleteAppointment: (id) => dispatch({ type: 'DELETE_APPOINTMENT', payload: id }),
      addVaccination: (vac) => dispatch({ type: 'ADD_VACCINATION', payload: vac }),
      updateVaccination: (vac) => dispatch({ type: 'UPDATE_VACCINATION', payload: vac }),
      deleteVaccination: (id) => dispatch({ type: 'DELETE_VACCINATION', payload: id }),
      updateSettings: (settings) =>
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
      resetData: () => dispatch({ type: 'RESET_DATA' }),
    }),
    [],
  )

  const value = useMemo(
    () => ({
      ...state,
      ...actions,
      getPetById: (id) => state.pets.find((pet) => pet.id === id),
      getTasksForPet: (petId) =>
        state.careTasks.filter((task) => task.petId === petId),
      getAppointmentsForPet: (petId) =>
        state.appointments.filter((appt) => appt.petId === petId),
      getVaccinationsForPet: (petId) =>
        state.vaccinations.filter((vac) => vac.petId === petId),
    }),
    [state, actions],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
