import { useEffect, useState } from 'react'
import { useApi } from '../lib/api'
import SitePanel from '../components/SitePanel'
import Spinner from '../components/Spinner'
import { SiteRead, SiteReadSchema } from '../types/site'

export default function Home() {

  const api = useApi()

  const [sites, setSites] = useState<SiteRead[] | undefined>()

  // TODO: order by status

  useEffect(() => {
    api.fetchWithValidation(
      SiteReadSchema.array(),
      { url: "/api/sites" },
    ).then(d => setSites(d))
  }, [])

  if (sites === undefined) {
    return <Spinner />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {
        sites.map(s => (
          <SitePanel key={s.id} site={s} />
        ))
      }
    </div>
  )
}
