import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApi } from '../lib/api'
import { Form } from '../lib/form'
import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import Controls from '../components/Controls'
import FormError from '../components/FormError'
import Header from '../components/Header'
import Input from '../components/Input'
import Spinner from '../components/Spinner'
import { SiteWrite, SiteWriteSchema } from '../types/site'

export default function SitesCreateEdit() {

  const api = useApi()
  const params = useParams()

  const isEdit = params.id !== undefined

  const [site, setSite] = useState<SiteWrite | undefined>()

  useEffect(() => {
    if (isEdit) {
      api.fetchWithValidation(
        SiteWriteSchema, {
        url: `/api/sites/${params.id}`,
      }).then(d => setSite(d))
    }
  }, [])

  if (isEdit && site === undefined) {
    return <Spinner />
  }

  function handleSubmit(formParams: SiteWrite) {
    return api.fetch({
      method: 'POST',
      url: isEdit ? `/api/sites/${params.id}/edit` : '/api/sites/create',
      data: formParams,
    })
  }

  return (
    <Form
      initialValues={site}
      onSubmit={handleSubmit}
    >
      <Header
        title={isEdit ? `Edit ${site?.name}` : "Create"}
      />
      <FormError />
      <Controls>
        <Input
          title="Name"
          name="name"
          type="text"
          autoFocus
        />
        <Input
          title="URL"
          name="url"
          type="url"
        />
        <Checkbox
          title="Public"
          name="public"
        />
        <Checkbox
          title="Enabled"
          name="enabled"
        />
        <Input
          title="Timeout"
          name="timeout"
          type="number"
        />
        <Checkbox
          title="Ignore HTTP Errors"
          name="ignore_http_errors"
        />
        <Input
          title="Online Interval"
          name="online_interval"
          type="number"
        />
        <Input
          title="Offline Interval"
          name="offline_interval"
          type="number"
        />
      </Controls>
      <Button>{isEdit ? "Save" : "Create"}</Button>
    </Form>
  )
}
