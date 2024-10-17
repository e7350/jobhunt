import { useState } from 'react'
import { addJob } from '../utils/db'

function JobForm() {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState('started')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addJob({ title, company, status })
    setTitle('')
    setCompany('')
    setStatus('started')
    alert('Job added successfully!')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Job Application</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="company" className="block mb-1">
            Company
          </label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="started">Started</option>
            <option value="interviewing">Interviewing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Job
        </button>
      </form>
    </div>
  )
}

export default JobForm
