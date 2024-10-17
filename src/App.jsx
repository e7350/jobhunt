import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import JobList from './components/JobList'
import JobForm from './components/JobForm'
import Login from './components/Login'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto mt-8 px-4">
          <Routes>
            <Route path="/" element={<JobList />} />
            <Route path="/add" element={<JobForm />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
