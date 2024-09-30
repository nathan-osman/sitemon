import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import App from './components/App'
import Page from './components/Page'
import Home from './routes/home'
import Login from './routes/login'
import SitesCreateEdit from './routes/sites_create_edit'
import SitesDelete from './routes/sites_delete'
import SitesView from './routes/sites_view'
import '@fontsource/poppins/400.css'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: "/",
        element: <Page />,
        children: [
          {
            path: "/",
            element: <Home />
          },
          {
            path: "/sites/create",
            element: <SitesCreateEdit />,
          },
          {
            path: "/sites/:id",
            element: <SitesView />,
          },
          {
            path: "/sites/:id/edit",
            element: <SitesCreateEdit />,
          },
          {
            path: "/sites/:id/delete",
            element: <SitesDelete />,
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
