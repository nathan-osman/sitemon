import { clsx } from 'clsx'
import { formatDistance, parseISO } from 'date-fns'
import { useApi } from '../lib/api'
import ButtonGroup from './ButtonGroup'
import { SiteRead } from '../types/site'
import Button from './Button'

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
      'bg-status-unknown': s.status == 'unknown',
      'bg-status-green': s.status == 'online',
      'bg-status-red': s.status == 'error',
    },
    'shadow-lg',
  )

  return (
    <div className={className}>
      <div className="bg-background-panel rounded-t-md px-4 py-2">
        <div className="flex justify-between">
          <div className="text-lg">{s.name}</div>
          <div className="text-muted">
            {formatDistance(parseISO(s.last_check), new Date())} ago
          </div>
        </div>
        {
          s.status === 'error' ?
            <div className="text-muted truncate" title={s.details}>
              {s.details}
            </div> :
            <div className="text-muted">Online</div>
        }
      </div>
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
