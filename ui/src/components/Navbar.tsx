import { MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApi } from '../lib/api'

export default function Navbar() {

  const api = useApi()
  const navigate = useNavigate()

  function logout(e: MouseEvent) {
    e.preventDefault()
    api.logout()
      .then(() => navigate("/"))
  }

  return (
    <div className="bg-background-panel">
      <div className="container mx-auto">
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="text-2xl">sitemon</Link>
          {
            api.isLoggedIn ?
              <a href="#" onClick={logout}>Logout</a> :
              <Link to="/login">Login</Link>
          }
        </div>
      </div>
    </div>
  )
}
