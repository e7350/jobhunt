import Dexie from 'dexie'

const db = new Dexie('JobHuntDB')
db.version(1).stores({
  jobs: '++id, title, company, status',
})

export const getJobs = async () => {
  return await db.jobs.toArray()
}

export const addJob = async (job) => {
  return await db.jobs.add(job)
}

export const updateJob = async (id, updates) => {
  return await db.jobs.update(id, updates)
}

export const deleteJob = async (id) => {
  return await db.jobs.delete(id)
}
