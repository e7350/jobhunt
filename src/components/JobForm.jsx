import { useState } from 'react'
import { addJob, addNote, addTask } from '../utils/db'
import { useNavigate } from 'react-router-dom'

function JobForm({ user }) {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState('not-started')
  const [initialNote, setInitialNote] = useState('')
  const [initialTask, setInitialTask] = useState('')
  const [initialTaskDueDate, setInitialTaskDueDate] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [salary, setSalary] = useState('')
  const [location, setLocation] = useState('')
  const [preparationTasks, setPreparationTasks] = useState([])
  const [aiGeneratedTasks, setAiGeneratedTasks] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const job = await addJob(
      {
        title,
        company,
        status,
        salary,
        location,
        url: jobUrl,
      },
      user.$id,
    )
    if (initialNote) {
      await addNote({ jobId: job.$id, content: initialNote }, user.$id)
    }
    if (initialTask) {
      await addTask(
        {
          jobId: job.$id,
          description: initialTask,
          dueDate: initialTaskDueDate || null,
        },
        user.$id,
      )
    }
    // Add AI-generated tasks
    for (const taskDescription of aiGeneratedTasks) {
      await addTask(
        {
          jobId: job.$id,
          description: taskDescription,
          dueDate: null,
        },
        user.$id,
      )
    }
    navigate('/')
  }

  const handleFetchJobDetails = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/job-scraper`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: jobUrl }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch job details')
      }

      const scrapedData = await response.json()
      const jobDetails = scrapedData
      console.log(jobDetails)

      if (jobDetails) {
        setTitle(jobDetails.title || '')
        setCompany(jobDetails.company || '')
        setSalary(jobDetails.salary || '')
        setLocation(jobDetails.location || '')
        setAiGeneratedTasks(jobDetails.preparationTasks || [])
        setInitialNote(`${jobDetails.description || 'N/A'}
Requirements: ${
          jobDetails.requirements ? jobDetails.requirements.join(', ') : 'N/A'
        }`)
      } else {
        setError(
          "Couldn't extract job details. Please fill in the form manually.",
        )
      }
    } catch (error) {
      setError(`Failed to fetch job details: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-secondary-900 mb-6">
        Add New Job Application
      </h2>
      <div className="mb-6">
        <label
          htmlFor="jobUrl"
          className="block text-sm font-medium text-secondary-700 mb-1"
        >
          Job Posting URL
        </label>
        <div className="flex">
          <input
            type="url"
            id="jobUrl"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            className="input flex-grow"
            placeholder="https://example.com/job-posting"
          />
          <button
            type="button"
            onClick={handleFetchJobDetails}
            className="btn btn-secondary ml-2"
            disabled={isLoading}
          >
            {isLoading ? 'Fetching...' : 'Fetch Details'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
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
            maxLength={100}
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
            maxLength={100}
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
            <option value="not-started">Not Started</option>
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
            Note (optional)
          </label>
          <textarea
            id="initialNote"
            value={initialNote}
            onChange={(e) => setInitialNote(e.target.value)}
            className="input"
            rows="3"
            maxLength={1000}
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
            maxLength={200}
          />
        </div>
        <div>
          <label
            htmlFor="initialTaskDueDate"
            className="block text-sm font-medium text-secondary-700 mb-1"
          >
            Initial Task Due Date (optional)
          </label>
          <input
            type="date"
            id="initialTaskDueDate"
            value={initialTaskDueDate}
            onChange={(e) => setInitialTaskDueDate(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-secondary-700 mb-1"
          >
            Salary (optional)
          </label>
          <input
            type="text"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="input"
            maxLength={100}
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-secondary-700 mb-1"
          >
            Location (optional)
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input"
            maxLength={100}
          />
        </div>
        {aiGeneratedTasks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              Our Recommended Preparation Tasks
            </h3>
            <ul className="list-disc pl-5">
              {aiGeneratedTasks.map((task, index) => (
                <li key={index} className="mb-1">
                  {task}
                </li>
              ))}
            </ul>
            <p className="text-sm text-secondary-600 mt-2">
              These tasks will be added to your job application when you submit
              the form.
            </p>
          </div>
        )}
        <button type="submit" className="btn btn-primary w-full mt-6">
          Add Job
        </button>
      </form>
    </div>
  )
}

export default JobForm
