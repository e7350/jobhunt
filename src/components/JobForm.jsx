import { useState } from 'react'
import { addJob, addNote, addTask } from '../utils/db'
import { useNavigate } from 'react-router-dom'

function JobForm() {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState('started')
  const [initialNote, setInitialNote] = useState('')
  const [initialTask, setInitialTask] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const job = await addJob({ title, company, status })
    if (initialNote) {
      await addNote({ jobId: job.$id, content: initialNote })
    }
    if (initialTask) {
      await addTask({ jobId: job.$id, description: initialTask })
    }
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-secondary-900 mb-6">
        Add New Job Application
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-secondary-700 mb-1"
          >
            Job Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            required
          />
        </div>
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-secondary-700 mb-1"
          >
            Company
          </label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="input"
            required
          />
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-secondary-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input"
          >
            <option value="started">Started</option>
            <option value="interviewing">Interviewing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="initialNote"
            className="block text-sm font-medium text-secondary-700 mb-1"
          >
            Initial Note (optional)
          </label>
          <textarea
            id="initialNote"
            value={initialNote}
            onChange={(e) => setInitialNote(e.target.value)}
            className="input"
            rows="3"
          />
        </div>
        <div>
          <label
            htmlFor="initialTask"
            className="block text-sm font-medium text-secondary-700 mb-1"
          >
            Initial Task (optional)
          </label>
          <input
            type="text"
            id="initialTask"
            value={initialTask}
            onChange={(e) => setInitialTask(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Add Job
        </button>
      </form>
    </div>
  )
}

export default JobForm
