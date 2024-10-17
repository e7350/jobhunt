import { useState, useEffect } from 'react'
import { getJobs } from '../utils/db'
import JobCard from './JobCard'

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
      <h2 className="text-3xl font-bold text-secondary-900 mb-6">
        Job Applications
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.$id} job={job} />
        ))}
      </div>
    </div>
  )
}

export default JobList
