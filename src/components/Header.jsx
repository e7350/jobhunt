import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Hunt Tracker</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/add" className="hover:underline">
                Add Job
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
