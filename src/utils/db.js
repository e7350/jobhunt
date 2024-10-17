import {
  databases,
  DATABASE_ID,
  JOBS_COLLECTION_ID,
  NOTES_COLLECTION_ID,
  TASKS_COLLECTION_ID,
} from './appwrite'
import { ID, Query } from 'appwrite'

export const getJobs = async () => {
  const response = await databases.listDocuments(
    DATABASE_ID,
    JOBS_COLLECTION_ID,
  )
  return response.documents
}

export const addJob = async (job) => {
  return await databases.createDocument(
    DATABASE_ID,
    JOBS_COLLECTION_ID,
    ID.unique(),
    job,
  )
}

export const getNotes = async (jobId) => {
  const response = await databases.listDocuments(
    DATABASE_ID,
    NOTES_COLLECTION_ID,
    [Query.equal('jobId', jobId)],
  )
  return response.documents
}

export const addNote = async (note) => {
  return await databases.createDocument(
    DATABASE_ID,
    NOTES_COLLECTION_ID,
    ID.unique(),
    note,
  )
}

export const getTasks = async (jobId) => {
  const response = await databases.listDocuments(
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    [Query.equal('jobId', jobId)],
  )
  return response.documents
}

export const addTask = async (task) => {
  return await databases.createDocument(
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    ID.unique(),
    task,
  )
}

export const updateTask = async (taskId, updates) => {
  return await databases.updateDocument(
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    taskId,
    updates,
  )
}
