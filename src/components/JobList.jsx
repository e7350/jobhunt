import { useState, useEffect } from 'react'
import { getJobs } from '../utils/db'
import JobCard from './JobCard'

function JobList({ user }) {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const loadJobs = async () => {
      const jobList = await getJobs(user.$id)
      setJobs(jobList)
    }
    loadJobs()
  }, [user.$id])

  const handleJobUpdate = (updatedJob) => {
    setJobs(jobs.map((job) => (job.$id === updatedJob.$id ? updatedJob : job)))
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-secondary-900 mb-6">
        Job Applications
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard
            key={job.$id}
            job={job}
            onUpdate={handleJobUpdate}
            user={user}
          />
        ))}
      </div>
    </div>
  )
}

export default JobList
