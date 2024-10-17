import { useState, useEffect } from 'react'
import { getNotes, getTasks, addNote, addTask, updateTask } from '../utils/db'

function JobCard({ job }) {
  const [notes, setNotes] = useState([])
  const [tasks, setTasks] = useState([])
  const [newNote, setNewNote] = useState('')
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    const loadNotesAndTasks = async () => {
      const jobNotes = await getNotes(job.$id)
      const jobTasks = await getTasks(job.$id)
      setNotes(jobNotes)
      setTasks(jobTasks)
    }
    loadNotesAndTasks()
  }, [job.$id])

  const handleAddNote = async (e) => {
    e.preventDefault()
    const note = await addNote({ jobId: job.$id, content: newNote })
    setNotes([...notes, note])
    setNewNote('')
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    const task = await addTask({ jobId: job.$id, description: newTask })
    setTasks([...tasks, task])
    setNewTask('')
  }

  const handleToggleTask = async (taskId) => {
    const task = tasks.find((t) => t.$id === taskId)
    const updatedTask = await updateTask(taskId, { completed: !task.completed })
    setTasks(tasks.map((t) => (t.$id === taskId ? updatedTask : t)))
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          {job.title}
        </h3>
        <p className="text-secondary-600 mb-4">{job.company}</p>
        <div className="flex items-center mb-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              job.status === 'started'
                ? 'bg-yellow-100 text-yellow-800'
                : job.status === 'interviewing'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {job.status}
          </span>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Notes</h4>
          <ul className="space-y-2">
            {notes.map((note) => (
              <li key={note.$id} className="text-sm">
                {note.content}
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
                </span>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddTask} className="mt-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a task"
              className="input text-sm"
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default JobCard
