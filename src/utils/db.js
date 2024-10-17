import {
  databases,
  DATABASE_ID,
  JOBS_COLLECTION_ID,
  NOTES_COLLECTION_ID,
  TASKS_COLLECTION_ID,
} from './appwrite'
import { ID, Query } from 'appwrite'

export const getJobs = async (userId) => {
  const response = await databases.listDocuments(
    DATABASE_ID,
    JOBS_COLLECTION_ID,
    [Query.equal('userId', userId)],
  )
  return response.documents
}

export const addJob = async (job, userId) => {
  const currentTime = new Date().toISOString()
  return await databases.createDocument(
    DATABASE_ID,
    JOBS_COLLECTION_ID,
    ID.unique(),
    {
      ...job,
      userId,
      status: job.status || 'not-started',
      createdAt: currentTime,
      updatedAt: currentTime,
      salary: job.salary || null,
      location: job.location || null,
      url: job.url || null,
    },
  )
}

export const updateJob = async (jobId, updates, userId) => {
  const currentTime = new Date().toISOString()
  return await databases.updateDocument(
    DATABASE_ID,
    JOBS_COLLECTION_ID,
    jobId,
    {
      ...updates,
      userId,
      updatedAt: currentTime,
    },
  )
}

export const getNotes = async (jobId, userId) => {
  const response = await databases.listDocuments(
    DATABASE_ID,
    NOTES_COLLECTION_ID,
    [Query.equal('jobId', jobId), Query.equal('userId', userId)],
  )
  return response.documents
}

export const addNote = async (note, userId) => {
  return await databases.createDocument(
    DATABASE_ID,
    NOTES_COLLECTION_ID,
    ID.unique(),
    {
      ...note,
      userId,
      createdAt: new Date().toISOString(),
    },
  )
}

export const getTasks = async (jobId, userId) => {
  const response = await databases.listDocuments(
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    [Query.equal('jobId', jobId), Query.equal('userId', userId)],
  )
  return response.documents
}

export const addTask = async (task, userId) => {
  const currentTime = new Date().toISOString()
  return await databases.createDocument(
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    ID.unique(),
    {
      ...task,
      userId,
      completed: false,
      createdAt: currentTime,
      updatedAt: currentTime,
    },
  )
}

export const updateTask = async (taskId, updates, userId) => {
  return await databases.updateDocument(
    DATABASE_ID,
    TASKS_COLLECTION_ID,
    taskId,
    {
      ...updates,
      userId,
      updatedAt: new Date().toISOString(),
    },
  )
}
