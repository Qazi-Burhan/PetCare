import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import AppointmentForm from '../components/appointments/AppointmentForm'
import TaskForm from '../components/tasks/TaskForm'
import VaccinationForm from '../components/vaccinations/VaccinationForm'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card, { CardHeader } from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import PetAvatar from '../components/ui/PetAvatar'
import {
  CalendarIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
} from '../components/icons/Icons'
import { getTodayString } from '../utils/dateUtils'

export default function PetDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const {
    pets,
    getPetById,
    getTasksForPet,
    getAppointmentsForPet,
    getVaccinationsForPet,
    deletePetCascade,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addVaccination,
    updateVaccination,
    deleteVaccination,
  } = useApp()

  // Modal state: null | 'add' | { appt }
  const [apptModal, setApptModal] = useState(null)
  // Vaccination modal state: null | 'add' | { vac }
  const [vacModal, setVacModal] = useState(null)
  // Task modal state: null | 'add' | { task }
  const [taskModal, setTaskModal] = useState(null)

  const pet = getPetById(id)

  if (!pet) {
    return (
      <div className="page pet-details">
        <EmptyState
          icon={<span aria-hidden="true">🔍</span>}
          title="Pet not found"
          description="The pet you're looking for doesn't exist or may have been removed."
          action={
            <Button to="/pets" variant="secondary">
              Back to My Pets
            </Button>
          }
        />
      </div>
    )
  }

  const today        = getTodayString()
  const tasks        = getTasksForPet(pet.id)
  const appointments = getAppointmentsForPet(pet.id)
  const vaccinations = getVaccinationsForPet(pet.id)

  // Sort appointments: upcoming first, then past (descending)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const aUpcoming = a.date >= today
    const bUpcoming = b.date >= today
    if (aUpcoming && !bUpcoming) return -1
    if (!aUpcoming && bUpcoming) return 1
    // Both upcoming: earliest first; both past: most recent first
    return aUpcoming
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date)
  })

  // ── Pet delete ──────────────────────────────────────────
  const handleDeletePet = () => {
    if (
      window.confirm(
        `Delete ${pet.name}? This will also remove all their care tasks, appointments, and vaccination records. This cannot be undone.`,
      )
    ) {
      deletePetCascade(pet.id)
      navigate('/pets')
    }
  }

  // ── Task handlers (shortcut from pet details) ──────────
  const handleAddTask = (values) => {
    addTask({ id: crypto.randomUUID(), completed: false, ...values })
    setTaskModal(null)
  }

  const handleEditTask = (values) => {
    updateTask({ id: taskModal.task.id, completed: taskModal.task.completed, ...values })
    setTaskModal(null)
  }

  const handleDeleteTask = (task) => {
    if (window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) {
      deleteTask(task.id)
    }
  }

  // ── Appointment handlers ────────────────────────────────
  const handleAddAppointment = (values) => {
    addAppointment({ id: crypto.randomUUID(), petId: pet.id, ...values })
    setApptModal(null)
  }

  const handleEditAppointment = (values) => {
    updateAppointment({ id: apptModal.appt.id, petId: pet.id, ...values })
    setApptModal(null)
  }

  const handleDeleteAppointment = (appt) => {
    if (window.confirm(`Delete appointment "${appt.title}"? This cannot be undone.`)) {
      deleteAppointment(appt.id)
    }
  }

  // ── Vaccination handlers ────────────────────────────────
  const handleAddVaccination = (values) => {
    addVaccination({ id: crypto.randomUUID(), petId: pet.id, ...values })
    setVacModal(null)
  }

  const handleEditVaccination = (values) => {
    updateVaccination({ id: vacModal.vac.id, petId: pet.id, ...values })
    setVacModal(null)
  }

  const handleDeleteVaccination = (vac) => {
    if (window.confirm(`Delete vaccination record "${vac.name}"? This cannot be undone.`)) {
      deleteVaccination(vac.id)
    }
  }

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="page pet-details">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/pets">My Pets</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{pet.name}</span>
      </nav>

      {/* ── Pet profile header ── */}
      <header className="pet-profile">
        <PetAvatar
          emoji={pet.avatar}
          image={pet.image || pet.avatarImage}
          name={pet.name}
          size="xl"
        />
        <div className="pet-profile__info">
          <div className="pet-profile__heading">
            <h1 className="pet-profile__name">{pet.name}</h1>
            <Badge variant="info">{pet.species}</Badge>
          </div>
          <p className="pet-profile__meta">
            {pet.breed} · {pet.gender} · {pet.age} yr{pet.age !== 1 ? 's' : ''} old ·{' '}
            {pet.weight} kg
          </p>
          {pet.notes && <p className="pet-profile__notes">{pet.notes}</p>}
        </div>

        <div className="pet-profile__actions">
          <Button
            to={`/pets/${pet.id}/edit`}
            variant="secondary"
            size="sm"
            icon={<EditIcon size={15} />}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<TrashIcon size={15} />}
            onClick={handleDeletePet}
          >
            Delete
          </Button>
        </div>
      </header>

      {/* ── Detail grid ── */}
      <div className="pet-details__grid">

        {/* Care Tasks — with Add shortcut */}
        <Card padding="md">
          <CardHeader
            title="Care Tasks"
            subtitle={`${tasks.length} total task${tasks.length !== 1 ? 's' : ''}`}
            action={
              <Button
                variant="ghost"
                size="sm"
                icon={<PlusIcon size={14} />}
                onClick={() => setTaskModal('add')}
              >
                Add
              </Button>
            }
          />
          {tasks.length === 0 ? (
            <EmptyState
              icon={<span aria-hidden="true">📋</span>}
              title="No care tasks yet"
              description="Add a task to track daily care for this pet."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<PlusIcon size={14} />}
                  onClick={() => setTaskModal('add')}
                >
                  Add Task
                </Button>
              }
            />
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className="task-list__item">
                  <label className="care-task-list__label" style={{ flex: 1, minWidth: 0 }}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'done'}`}
                    />
                    <span className="care-task-list__check" aria-hidden="true" />
                    <span className="care-task-list__content">
                      <span className="task-list__title">{task.title}</span>
                      <span className="task-list__meta">{task.category} · Due {task.dueDate}</span>
                    </span>
                  </label>
                  <Badge variant={task.completed ? 'success' : 'warning'}>
                    {task.completed ? 'Done' : 'Pending'}
                  </Badge>
                  <div className="care-task-list__actions">
                    <button
                      type="button"
                      className="care-task-list__action-btn"
                      onClick={() => setTaskModal({ task })}
                      aria-label={`Edit task "${task.title}"`}
                    >
                      <EditIcon size={15} />
                    </button>
                    <button
                      type="button"
                      className="care-task-list__action-btn care-task-list__action-btn--danger"
                      onClick={() => handleDeleteTask(task)}
                      aria-label={`Delete task "${task.title}"`}
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Vaccinations — full CRUD */}
        <Card padding="md">
          <CardHeader
            title="Vaccinations"
            subtitle={`${vaccinations.length} record${vaccinations.length !== 1 ? 's' : ''}`}
            action={
              <Button
                variant="ghost"
                size="sm"
                icon={<PlusIcon size={14} />}
                onClick={() => setVacModal('add')}
              >
                Add
              </Button>
            }
          />

          {vaccinations.length === 0 ? (
            <EmptyState
              icon={<span aria-hidden="true">💉</span>}
              title="No vaccination records"
              description="Keep track of immunizations for this pet."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<PlusIcon size={14} />}
                  onClick={() => setVacModal('add')}
                >
                  Add Record
                </Button>
              }
            />
          ) : (
            <ul className="vaccination-list">
              {vaccinations.map((vac) => {
                const isOverdue = vac.nextDue && vac.nextDue < today
                const isUpcoming = vac.nextDue && vac.nextDue >= today
                return (
                  <li
                    key={vac.id}
                    className={`vaccination-list__item${isOverdue ? ' vaccination-list__item--overdue' : ''}`}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="vaccination-list__name">{vac.name}</p>
                      <p className="vaccination-list__meta">
                        Given: {vac.date}
                        {vac.notes && ` · ${vac.notes}`}
                      </p>
                    </div>
                    {vac.nextDue ? (
                      <Badge variant={isOverdue ? 'danger' : isUpcoming ? 'info' : 'default'}>
                        {isOverdue ? `Overdue: ${vac.nextDue}` : `Due: ${vac.nextDue}`}
                      </Badge>
                    ) : (
                      <Badge variant="default">No due date</Badge>
                    )}
                    <div className="vaccination-list__actions">
                      <button
                        type="button"
                        className="vaccination-list__action-btn"
                        onClick={() => setVacModal({ vac })}
                        aria-label={`Edit vaccination "${vac.name}"`}
                      >
                        <EditIcon size={15} />
                      </button>
                      <button
                        type="button"
                        className="vaccination-list__action-btn vaccination-list__action-btn--danger"
                        onClick={() => handleDeleteVaccination(vac)}
                        aria-label={`Delete vaccination "${vac.name}"`}
                      >
                        <TrashIcon size={15} />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        {/* Appointments — full CRUD */}
        <Card padding="md" className="pet-details__full-width">
          <CardHeader
            title="Appointments"
            subtitle={`${appointments.length} appointment${appointments.length !== 1 ? 's' : ''}`}
            action={
              <Button
                variant="ghost"
                size="sm"
                icon={<PlusIcon size={14} />}
                onClick={() => setApptModal('add')}
              >
                Add
              </Button>
            }
          />

          {sortedAppointments.length === 0 ? (
            <EmptyState
              icon={<span aria-hidden="true">📅</span>}
              title="No appointments yet"
              description="Schedule a vet visit or checkup for this pet."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<PlusIcon size={14} />}
                  onClick={() => setApptModal('add')}
                >
                  Add Appointment
                </Button>
              }
            />
          ) : (
            <ul className="appointment-list">
              {sortedAppointments.map((appt) => {
                const isPast = appt.date < today
                return (
                  <li
                    key={appt.id}
                    className={`appointment-list__item${isPast ? ' appointment-list__item--past' : ''}`}
                  >
                    <div className="appointment-list__date">
                      <CalendarIcon size={16} />
                      <time dateTime={appt.date}>{appt.date}</time>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="appointment-list__title">{appt.title}</p>
                      <p className="appointment-list__meta">
                        {appt.time} · {appt.location}
                        {appt.notes && ` · ${appt.notes}`}
                      </p>
                    </div>
                    <Badge variant={isPast ? 'default' : 'info'}>
                      {isPast ? 'Past' : 'Upcoming'}
                    </Badge>
                    <div className="appointment-list__actions">
                      <button
                        type="button"
                        className="appointment-list__action-btn"
                        onClick={() => setApptModal({ appt })}
                        aria-label={`Edit appointment "${appt.title}"`}
                      >
                        <EditIcon size={15} />
                      </button>
                      <button
                        type="button"
                        className="appointment-list__action-btn appointment-list__action-btn--danger"
                        onClick={() => handleDeleteAppointment(appt)}
                        aria-label={`Delete appointment "${appt.title}"`}
                      >
                        <TrashIcon size={15} />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* ── Task modals ── */}
      {taskModal === 'add' && (
        <TaskForm
          initialValues={{ petId: pet.id, dueDate: getTodayString(), category: 'Feeding', priority: 'medium', title: '' }}
          pets={pets}
          onSubmit={handleAddTask}
          onClose={() => setTaskModal(null)}
          title={`Add Task — ${pet.name}`}
        />
      )}
      {taskModal !== null && taskModal !== 'add' && (
        <TaskForm
          initialValues={taskModal.task}
          pets={pets}
          onSubmit={handleEditTask}
          onClose={() => setTaskModal(null)}
          title="Edit Task"
        />
      )}

      {/* ── Appointment modals ── */}
      {apptModal === 'add' && (
        <AppointmentForm
          petId={pet.id}
          pets={pets}
          onSubmit={handleAddAppointment}
          onClose={() => setApptModal(null)}
          title={`Add Appointment — ${pet.name}`}
        />
      )}
      {apptModal !== null && apptModal !== 'add' && (
        <AppointmentForm
          initialValues={apptModal.appt}
          petId={pet.id}
          pets={pets}
          onSubmit={handleEditAppointment}
          onClose={() => setApptModal(null)}
          title="Edit Appointment"
        />
      )}

      {/* ── Vaccination modals ── */}
      {vacModal === 'add' && (
        <VaccinationForm
          onSubmit={handleAddVaccination}
          onClose={() => setVacModal(null)}
          title={`Add Vaccination — ${pet.name}`}
        />
      )}
      {vacModal !== null && vacModal !== 'add' && (
        <VaccinationForm
          initialValues={vacModal.vac}
          onSubmit={handleEditVaccination}
          onClose={() => setVacModal(null)}
          title="Edit Vaccination Record"
        />
      )}
    </div>
  )
}
