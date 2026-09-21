import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import TaskForm from '../components/tasks/TaskForm'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card, { CardHeader } from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { EditIcon, PlusIcon, TrashIcon } from '../components/icons/Icons'
import { getTodayString } from '../utils/dateUtils'

export default function CareTasks() {
  const { careTasks, pets, toggleTask, addTask, updateTask, deleteTask } = useApp()

  const [filterPetId, setFilterPetId] = useState('all')
  const [modal, setModal]             = useState(null) // null | 'add' | { task }

  const today = getTodayString()

  // Apply pet filter first
  const filtered = filterPetId === 'all'
    ? careTasks
    : careTasks.filter((t) => t.petId === filterPetId)

  const pendingTasks   = filtered.filter((t) => !t.completed)
  const completedTasks = filtered.filter((t) =>  t.completed)

  const getPetName = (petId) =>
    pets.find((p) => p.id === petId)?.name ?? 'Unknown'

  // ── Handlers ──────────────────────────────────────────────
  const handleAdd = (values) => {
    addTask({
      id:        crypto.randomUUID(),
      completed: false,
      ...values,
    })
    setModal(null)
  }

  const handleEdit = (values) => {
    updateTask({ id: modal.task.id, completed: modal.task.completed, ...values })
    setModal(null)
  }

  const handleDelete = (task) => {
    if (window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) {
      deleteTask(task.id)
    }
  }

  const priorityVariant = (p) =>
    p === 'high' ? 'danger' : p === 'medium' ? 'warning' : 'default'

  // ── Task row (shared between pending/completed) ───────────
  const renderTaskItem = (task, isCompleted) => {
    const isOverdue = !isCompleted && task.dueDate < today
    return (
      <li
        key={task.id}
        className={`care-task-list__item${isOverdue ? ' care-task-list__item--overdue' : ''}`}
      >
        {/* Checkbox + text */}
        <label className="care-task-list__label">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
            aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'done'}`}
          />
          <span className="care-task-list__check" aria-hidden="true" />
          <span className="care-task-list__content">
            <span className="care-task-list__title">{task.title}</span>
            <span className="care-task-list__meta">
              {getPetName(task.petId)} · {task.category}
              {!isCompleted && ` · Due ${task.dueDate}`}
              {isOverdue && ' · Overdue'}
            </span>
          </span>
        </label>

        {/* Badges + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {isCompleted ? (
            <Badge variant="success">Done</Badge>
          ) : (
            <>
              {isOverdue && <Badge variant="danger">Overdue</Badge>}
              <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
            </>
          )}

          <div className="care-task-list__actions">
            <button
              type="button"
              className="care-task-list__action-btn"
              onClick={() => setModal({ task })}
              aria-label={`Edit task "${task.title}"`}
            >
              <EditIcon size={15} />
            </button>
            <button
              type="button"
              className="care-task-list__action-btn care-task-list__action-btn--danger"
              onClick={() => handleDelete(task)}
              aria-label={`Delete task "${task.title}"`}
            >
              <TrashIcon size={15} />
            </button>
          </div>
        </div>
      </li>
    )
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="page care-tasks">
      <PageHeader
        title="Care Tasks"
        description="Track daily care activities for all your pets."
        action={
          <Button
            icon={<PlusIcon size={16} />}
            onClick={() => setModal('add')}
            disabled={pets.length === 0}
            title={pets.length === 0 ? 'Add a pet first before creating tasks.' : undefined}
          >
            Add Task
          </Button>
        }
      />

      {/* ── Toolbar: filter + task count ── */}
      <div className="care-tasks__toolbar">
        <div className="care-tasks__filter">
          <span className="care-tasks__filter-label" id="pet-filter-label">
            Filter by Pet:
          </span>
          <select
            value={filterPetId}
            onChange={(e) => setFilterPetId(e.target.value)}
            aria-labelledby="pet-filter-label"
          >
            <option value="all">All Pets</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.avatar} {pet.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Task columns ── */}
      <div className="care-tasks__grid">
        {/* Pending */}
        <section aria-labelledby="pending-heading">
          <Card padding="md">
            <CardHeader
              id="pending-heading"
              title="Pending"
              subtitle={`${pendingTasks.length} task${pendingTasks.length !== 1 ? 's' : ''} to complete`}
            />
            {pendingTasks.length === 0 ? (
              <EmptyState
                icon={<span aria-hidden="true">✅</span>}
                title="All done!"
                description={
                  filterPetId === 'all'
                    ? 'No pending tasks.'
                    : `No pending tasks for ${getPetName(filterPetId)}.`
                }
              />
            ) : (
              <ul className="care-task-list">
                {pendingTasks.map((task) => renderTaskItem(task, false))}
              </ul>
            )}
          </Card>
        </section>

        {/* Completed */}
        <section aria-labelledby="completed-heading">
          <Card padding="md">
            <CardHeader
              id="completed-heading"
              title="Completed"
              subtitle={`${completedTasks.length} task${completedTasks.length !== 1 ? 's' : ''} done`}
            />
            {completedTasks.length === 0 ? (
              <EmptyState
                icon={<span aria-hidden="true">📋</span>}
                title="Nothing completed yet"
                description={
                  filterPetId === 'all'
                    ? 'Completed tasks will appear here.'
                    : `No completed tasks for ${getPetName(filterPetId)}.`
                }
              />
            ) : (
              <ul className="care-task-list care-task-list--completed">
                {completedTasks.map((task) => renderTaskItem(task, true))}
              </ul>
            )}
          </Card>
        </section>
      </div>

      {/* ── Modals ── */}
      {modal === 'add' && (
        <TaskForm
          pets={pets}
          onSubmit={handleAdd}
          onClose={() => setModal(null)}
          title="Add Care Task"
        />
      )}
      {modal !== null && modal !== 'add' && (
        <TaskForm
          initialValues={modal.task}
          pets={pets}
          onSubmit={handleEdit}
          onClose={() => setModal(null)}
          title="Edit Care Task"
        />
      )}
    </div>
  )
}
