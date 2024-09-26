import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className="bg-background-panel">
      <div className="container mx-auto py-4 flex justify-between">
        <Link to="/" className="text-2xl">sitemon</Link>
        {
          false ?
            <Link to="/logout">Logout</Link> :
            <Link to="/login">Login</Link>
        }
      </div>
    </div>
  )
}
