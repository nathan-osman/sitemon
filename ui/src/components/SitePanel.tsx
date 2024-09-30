import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { useApi } from '../lib/api'
import ButtonGroup from './ButtonGroup'
import { SiteRead } from '../types/site'
import Button from './Button'
import Time from './Time'

type Params = {
  site: SiteRead
}

export default function SitePanel(params: Params) {

  const api = useApi()

  const s = params.site

  const className = clsx(
    'rounded-t-md',
    'pt-1',
    {
      'bg-status-unknown': s.status === 'unknown',
      'bg-status-online': s.status === 'online',
      'bg-status-error': s.status === 'error',
    },
    'shadow-lg',
  )

  return (
    <div className={className}>
      <Link
        to={`/sites/${s.id}`}
        className="block bg-background-panel rounded-t-md px-4 py-2"
      >
        <div className="flex justify-between">
          <div className="text-lg">{s.name}</div>
          {
            s.last_check !== null &&
            <div className="text-muted">
              <Time date={s.last_check} />
            </div>
          }
        </div>
        {
          s.status === 'error' ?
            <div className="text-muted truncate" title={s.details}>
              {s.details}
            </div> :
            <div className="text-muted">
              {s.status === 'online' ? "Online" : "Unknown"}
            </div>
        }
      </Link>
      {
        api.isLoggedIn &&
        <ButtonGroup>
          <Button to={`/sites/${s.id}/edit`}>Edit</Button>
          <Button to={`/sites/${s.id}/delete`}>Delete</Button>
        </ButtonGroup>
      }
    </div>
  )
}
