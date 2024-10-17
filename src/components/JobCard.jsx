import { useState, useEffect } from 'react'
import {
  getNotes,
  getTasks,
  addNote,
  addTask,
  updateTask,
  updateJob,
} from '../utils/db'

function JobCard({ job, onUpdate, user }) {
  const [notes, setNotes] = useState([])
  const [tasks, setTasks] = useState([])
  const [newNote, setNewNote] = useState('')
  const [newTask, setNewTask] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')

  useEffect(() => {
    const loadNotesAndTasks = async () => {
      const jobNotes = await getNotes(job.$id, user.$id)
      const jobTasks = await getTasks(job.$id, user.$id)
      setNotes(jobNotes)
      setTasks(jobTasks)
    }
    loadNotesAndTasks()
  }, [job.$id, user.$id])

  const handleAddNote = async (e) => {
    e.preventDefault()
    const note = await addNote({ jobId: job.$id, content: newNote }, user.$id)
    setNotes([...notes, note])
    setNewNote('')
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    const task = await addTask(
      {
        jobId: job.$id,
        description: newTask,
        dueDate: newTaskDueDate || null,
      },
      user.$id,
    )
    setTasks([...tasks, task])
    setNewTask('')
    setNewTaskDueDate('')
  }

  const handleToggleTask = async (taskId) => {
    const task = tasks.find((t) => t.$id === taskId)
    const updatedTask = await updateTask(
      taskId,
      { completed: !task.completed },
      user.$id,
    )
    setTasks(tasks.map((t) => (t.$id === taskId ? updatedTask : t)))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800'
      case 'started':
        return 'bg-yellow-100 text-yellow-800'
      case 'interviewing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    const updatedJob = await updateJob(job.$id, { status: newStatus }, user.$id)
    onUpdate(updatedJob)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          {job.title}
        </h3>
        <p className="text-secondary-600 mb-4">{job.company}</p>
        <div className="flex items-center mb-4">
          <select
            value={job.status}
            onChange={handleStatusChange}
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              job.status,
            )}`}
          >
            <option value="not-started">Not Started</option>
            <option value="started">Started</option>
            <option value="interviewing">Interviewing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Notes</h4>
          <ul className="space-y-2">
            {notes.map((note) => (
              <li key={note.$id} className="text-sm">
                {note.content}
                <span className="text-xs text-secondary-400 ml-2">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddNote} className="mt-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note"
              className="input text-sm"
              maxLength={1000}
            />
          </form>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Tasks</h4>
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.$id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.$id)}
                  className="mr-2"
                />
                <span
                  className={
                    task.completed ? 'line-through text-secondary-400' : ''
                  }
                >
                  {task.description}
                  {task.dueDate && (
                    <span className="text-xs text-secondary-400 ml-2">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddTask} className="mt-2 space-y-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a task"
              className="input text-sm"
              maxLength={200}
            />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="input text-sm"
            />
            <button type="submit" className="btn btn-secondary w-full">
              Add Task
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default JobCard
