import { useState, useEffect } from 'react'
import { getJobs } from '../utils/db'

function JobList() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const loadJobs = async () => {
      const jobList = await getJobs()
      setJobs(jobList)
    }
    loadJobs()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Job Applications</h2>
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500">Status: {job.status}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default JobList
