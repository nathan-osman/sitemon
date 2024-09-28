import { Link } from 'react-router-dom'
import { useApi } from '../lib/api'

export default function Navbar() {

  const api = useApi()

  return (
    <div className="bg-background-panel">
      <div className="container mx-auto">
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="text-2xl">sitemon</Link>
          {
            api.isLoggedIn ?
              <Link to="/logout">Logout</Link> :
              <Link to="/login">Login</Link>
          }
        </div>
      </div>
    </div>
  )
}
