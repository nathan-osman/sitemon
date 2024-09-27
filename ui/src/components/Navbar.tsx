import { Link } from 'react-router-dom'
import { useApi } from '../lib/api'

export default function Navbar() {

  const api = useApi()

  return (
    <div className="bg-background-panel">
      <div className="container mx-auto py-4 flex justify-between">
        <Link to="/" className="text-2xl">sitemon</Link>
        {
          api.isLoggedIn ?
            <Link to="/logout">Logout</Link> :
            <Link to="/login">Login</Link>
        }
      </div>
    </div>
  )
}
