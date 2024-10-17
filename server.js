import express from 'express'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import cors from 'cors'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

// Open the database
const dbPromise = open({
  filename: './database.sqlite',
  driver: sqlite3.Database,
})

// Initialize the database
async function initializeDatabase() {
  const db = await dbPromise
  await db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      company TEXT,
      status TEXT
    );
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jobId INTEGER,
      content TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (jobId) REFERENCES jobs (id)
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jobId INTEGER,
      description TEXT,
      completed BOOLEAN DEFAULT 0,
      dueDate DATETIME,
      FOREIGN KEY (jobId) REFERENCES jobs (id)
    );
  `)
}

initializeDatabase()

// API Routes
app.get('/api/jobs', async (req, res) => {
  const db = await dbPromise
  const jobs = await db.all('SELECT * FROM jobs')
  res.json(jobs)
})

app.post('/api/jobs', async (req, res) => {
  const { title, company, status } = req.body
  const db = await dbPromise
  const result = await db.run(
    'INSERT INTO jobs (title, company, status) VALUES (?, ?, ?)',
    [title, company, status],
  )
  res.json({ id: result.lastID, title, company, status })
})

app.get('/api/jobs/:id/notes', async (req, res) => {
  const db = await dbPromise
  const notes = await db.all('SELECT * FROM notes WHERE jobId = ?', [
    req.params.id,
  ])
  res.json(notes)
})

app.post('/api/jobs/:id/notes', async (req, res) => {
  const { content } = req.body
  const db = await dbPromise
  const result = await db.run(
    'INSERT INTO notes (jobId, content) VALUES (?, ?)',
    [req.params.id, content],
  )
  res.json({ id: result.lastID, jobId: req.params.id, content })
})

app.get('/api/jobs/:id/tasks', async (req, res) => {
  const db = await dbPromise
  const tasks = await db.all('SELECT * FROM tasks WHERE jobId = ?', [
    req.params.id,
  ])
  res.json(tasks)
})

app.post('/api/jobs/:id/tasks', async (req, res) => {
  const { description } = req.body
  const db = await dbPromise
  const result = await db.run(
    'INSERT INTO tasks (jobId, description) VALUES (?, ?)',
    [req.params.id, description],
  )
  res.json({
    id: result.lastID,
    jobId: req.params.id,
    description,
    completed: false,
  })
})

app.put('/api/tasks/:id', async (req, res) => {
  const { completed } = req.body
  const db = await dbPromise
  await db.run('UPDATE tasks SET completed = ? WHERE id = ?', [
    completed,
    req.params.id,
  ])
  res.json({ id: req.params.id, completed })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
