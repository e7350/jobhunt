import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import { useState, useEffect } from 'react'
import { account } from './utils/appwrite'
import Header from './components/Header'
import JobList from './components/JobList'
import JobForm from './components/JobForm'
import Login from './components/Login'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const session = await account.get()
        setUser(session)
      } catch (error) {
        console.error('No active session', error)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-secondary-50">
        <Header user={user} setUser={setUser} />
        <main className="flex-grow container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={user ? <JobList /> : <Navigate to="/login" />}
            />
            <Route
              path="/add"
              element={user ? <JobForm /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
