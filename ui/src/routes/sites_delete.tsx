import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../lib/api'
import { Form } from '../lib/form'
import Button from '../components/Button'
import FormError from '../components/FormError'
import Header from '../components/Header'
import Spinner from '../components/Spinner'
import { SiteRead, SiteReadSchema } from '../types/site'

type DeleteParams = {}

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

  async function handleSubmit(_: DeleteParams) {
    return api.fetch({
      method: 'POST',
      url: `/api/sites/${params.id}/delete`,
    }).then(() => navigate("/"))
  }

  return (
    <Form
      onSubmit={handleSubmit}
    >
      <Header
        title={`Delete ${site.name}?`}
      />
      <div className="text-error">
        <strong>Warning:</strong>
        {' '}
        this operation cannot be undone.
      </div>
      <div className="mt-4">
        <FormError />
      </div>
      <Button>Delete</Button>
    </Form>
  )
}
