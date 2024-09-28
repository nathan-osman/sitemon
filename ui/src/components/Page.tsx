import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="m-4">
          <Outlet />
        </div>
      </div>
    </>
  )
}
