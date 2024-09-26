import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto my-4">
        <Outlet />
      </div>
    </>
  )
}
