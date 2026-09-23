import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import PetCard from '../components/pets/PetCard'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card, { CardHeader } from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import { CalendarIcon, PlusIcon, SparklesIcon, TasksIcon } from '../components/icons/Icons'
import { getDateInDays, getTodayString } from '../utils/dateUtils'

export default function Dashboard() {
  const { pets, careTasks, appointments, vaccinations, settings } = useApp()

  const today      = getTodayString()
  const in7Days    = getDateInDays(7)

  // ── Task stats ──────────────────────────────────────────
  const todaysPendingTasks = careTasks.filter(
    (task) => !task.completed && task.dueDate === today,
  )
  const allPendingTasks = careTasks.filter((task) => !task.completed)
  const completedToday  = careTasks.filter((task) => task.completed).length

  // ── Upcoming appointments: on/after today, sorted, capped at 3 ──
  const upcomingAppointments = appointments
    .filter((a) => a.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 3)

  // ── Notifications alert logic ───────────────────────────
  // Only evaluate when notifications are enabled.
  const showNotifications = settings.notifications

  const overdueTaskCount = showNotifications
    ? careTasks.filter((t) => !t.completed && t.dueDate < today).length
    : 0

  const overdueVacCount = showNotifications
    ? vaccinations.filter((v) => v.nextDue && v.nextDue < today).length
    : 0

  const dueSoonVacCount = showNotifications
    ? vaccinations.filter(
        (v) => v.nextDue && v.nextDue >= today && v.nextDue <= in7Days,
      ).length
    : 0

  // Build alert messages — one entry per distinct condition
  const alerts = []
  if (overdueTaskCount > 0) {
    alerts.push(
      `${overdueTaskCount} overdue care task${overdueTaskCount !== 1 ? 's' : ''} need attention.`,
    )
  }
  if (overdueVacCount > 0) {
    alerts.push(
      `${overdueVacCount} vaccination${overdueVacCount !== 1 ? 's are' : ' is'} overdue.`,
    )
  }
  if (dueSoonVacCount > 0) {
    alerts.push(
      `${dueSoonVacCount} vaccination${dueSoonVacCount !== 1 ? 's are' : ' is'} due within the next 7 days.`,
    )
  }

  return (
    <div className="page dashboard">
      <PageHeader
        title={`Good day, ${settings.ownerName.split(' ')[0]}!`}
        description="Here's an overview of your pets and today's care schedule."
        action={
          <Button to="/pets/add" icon={<PlusIcon size={16} />}>
            Add Pet
          </Button>
        }
      />

      {/* ── Notifications alert banner ── */}
      {showNotifications && alerts.length > 0 && (
        <div
          className="notifications-alert"
          role="status"
          aria-live="polite"
          aria-label="Care reminders"
        >
          <span className="notifications-alert__icon" aria-hidden="true">🔔</span>
          <div className="notifications-alert__messages">
            {alerts.map((msg) => (
              <span key={msg} className="notifications-alert__item">{msg}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Stat cards ── */}
      <section className="dashboard__stats" aria-label="Quick statistics">
        <StatCard
          label="Total Pets"
          value={pets.length}
          variant="teal"
          icon={<span aria-hidden="true">🐾</span>}
        />
        <StatCard
          label="Pending Tasks"
          value={allPendingTasks.length}
          variant="coral"
          icon={<TasksIcon size={22} />}
        />
        <StatCard
          label="Completed Today"
          value={completedToday}
          variant="green"
          icon={<span aria-hidden="true">✓</span>}
        />
        <StatCard
          label="Upcoming Visits"
          value={upcomingAppointments.length}
          variant="purple"
          icon={<CalendarIcon size={22} />}
        />
      </section>

      {/* ── Today's tasks + upcoming appointments ── */}
      <div className="dashboard__grid">
        <section className="dashboard__section" aria-labelledby="today-tasks-heading">
          <Card padding="md">
            <CardHeader
              id="today-tasks-heading"
              title="Today's Care Tasks"
              subtitle={
                todaysPendingTasks.length === 0
                  ? 'All caught up for today'
                  : `${todaysPendingTasks.length} task${todaysPendingTasks.length !== 1 ? 's' : ''} remaining`
              }
              action={
                <Button to="/tasks" variant="ghost" size="sm">
                  View all
                </Button>
              }
            />
            {todaysPendingTasks.length === 0 ? (
              <EmptyState
                icon={<span aria-hidden="true">✅</span>}
                title="No tasks for today"
                description="You have no pending care tasks scheduled for today."
              />
            ) : (
              <ul className="task-list">
                {todaysPendingTasks.slice(0, 4).map((task) => {
                  const pet = pets.find((p) => p.id === task.petId)
                  return (
                    <li key={task.id} className="task-list__item">
                      <div className="task-list__info">
                        <span className="task-list__title">{task.title}</span>
                        <span className="task-list__meta">
                          {pet?.name} · {task.category}
                        </span>
                      </div>
                      <Badge
                        variant={
                          task.priority === 'high'
                            ? 'danger'
                            : task.priority === 'medium'
                              ? 'warning'
                              : 'default'
                        }
                      >
                        {task.priority}
                      </Badge>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>
        </section>

        <section className="dashboard__section" aria-labelledby="appointments-heading">
          <Card padding="md">
            <CardHeader
              id="appointments-heading"
              title="Upcoming Appointments"
              subtitle="Scheduled vet visits"
            />
            {upcomingAppointments.length === 0 ? (
              <EmptyState
                icon={<span aria-hidden="true">📅</span>}
                title="No upcoming appointments"
                description="No vet visits are scheduled yet."
              />
            ) : (
              <ul className="appointment-list">
                {upcomingAppointments.map((appt) => {
                  const pet = pets.find((p) => p.id === appt.petId)
                  return (
                    <li key={appt.id} className="appointment-list__item">
                      <div className="appointment-list__date">
                        <CalendarIcon size={16} />
                        <time dateTime={appt.date}>{appt.date}</time>
                      </div>
                      <div>
                        <p className="appointment-list__title">{appt.title}</p>
                        <p className="appointment-list__meta">
                          {pet?.name} · {appt.time} · {appt.location}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>
        </section>
      </div>

      <section className="assistant-spotlight" aria-labelledby="assistant-spotlight-heading">
        <div className="assistant-spotlight__icon" aria-hidden="true">
          <SparklesIcon size={22} />
        </div>
        <div className="assistant-spotlight__content">
          <h2 id="assistant-spotlight-heading" className="assistant-spotlight__title">
            AI Pet Care Assistant
          </h2>
          <p className="assistant-spotlight__description">
            Ask quick questions about pet care, symptoms, routines, and general wellness guidance.
          </p>
        </div>
        <Button to="/assistant" variant="secondary" size="sm" className="assistant-spotlight__cta">
          Open assistant
        </Button>
      </section>

      {/* ── Your Pets overview ── */}
      <section className="dashboard__section" aria-labelledby="pets-overview-heading">
        <div className="section-heading">
          <h2 id="pets-overview-heading" className="section-heading__title">
            Your Pets
          </h2>
          <Link to="/pets" className="section-heading__link">
            View all pets
          </Link>
        </div>

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
          <div className="pet-grid">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
