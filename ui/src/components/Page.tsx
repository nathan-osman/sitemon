import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto grow flex flex-col">
        <div className="m-4 grow">
          <Outlet />
        </div>
      </div>
    </>
  )
}
