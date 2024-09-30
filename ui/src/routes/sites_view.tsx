import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApi } from '../lib/api'
import EventPanel from '../components/EventPanel'
import Header from '../components/Header'
import Spinner from '../components/Spinner'
import { Event, EventSchema } from '../types/event'
import { SiteRead, SiteReadSchema } from '../types/site'

export default function SitesView() {

  const api = useApi()
  const params = useParams()

  const [site, setSite] = useState<SiteRead | undefined>()
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    api.fetchWithValidation(
      SiteReadSchema, {
      url: `/api/sites/${params.id}`,
    }).then(d => setSite(d))
    api.fetchWithValidation(
      EventSchema.array(), {
      url: `/api/sites/${params.id}/events`,
    }).then(d => setEvents(d))
  }, [])

  if (site === undefined) {
    return <Spinner />
  }

  return (
    <>
      <Header
        title={site.name}
      />
      <div className="text-muted">{site.url}</div>
      <br />
      {
        events.map(e => (
          <EventPanel key={e.id} event={e} />
        ))
      }
    </>
  )
}
