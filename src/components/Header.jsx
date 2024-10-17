import { Link } from 'react-router-dom'
import { account } from '../utils/appwrite'

function Header({ user, setUser }) {
  const handleLogout = async () => {
    try {
      await account.deleteSession('current')
      setUser(null)
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-primary-600">
            Job Hunt Tracker
          </h1>
          <nav>
            <ul className="flex space-x-4 items-center">
              {user ? (
                <>
                  <li className="text-secondary-600">Welcome, {user.name}</li>
                  <li>
                    <Link
                      to="/"
                      className="text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/add"
                      className="text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                    >
                      Add Job
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    Login / Sign Up
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
