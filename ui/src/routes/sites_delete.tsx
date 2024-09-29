import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../lib/api'
import Header from '../components/Header'
import Spinner from '../components/Spinner'
import { SiteRead, SiteReadSchema } from '../types/site'
import Button from '../components/Button'

export default function SitesDelete() {

  const api = useApi()
  const navigate = useNavigate()
  const params = useParams()

  const [site, setSite] = useState<SiteRead | null>(null)

  useEffect(() => {
    api.fetchWithValidation(
      SiteReadSchema, {
      url: `/api/sites/${params.id}`,
    }).then(d => setSite(d))
  }, [])

  if (site === null) {
    return <Spinner />
  }

  function handleClick() {
    api.fetch({
      url: `/api/sites/${params.id}/delete`,
    }).then(() => navigate("/"))
  }

  return (
    <>
      <Header
        title={`Delete ${site.name}?`}
      />
      <div className="text-error">
        <strong>Warning:</strong>
        {' '}
        this operation cannot be undone.
      </div>
      <div className="mt-4">
        <Button
          onClick={handleClick}
        >Delete</Button>
      </div>
    </>
  )
}
