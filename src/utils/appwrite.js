import { Client, Account, Databases } from 'appwrite'

const client = new Client()

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'job-hunter')

export const account = new Account(client)
export const databases = new Databases(client)

export const DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID || 'job-hunt-db'
export const JOBS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_JOBS_COLLECTION_ID || 'jobs'
export const NOTES_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_NOTES_COLLECTION_ID || 'job-notes'
export const TASKS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_TASKS_COLLECTION_ID || 'job-tasks'
