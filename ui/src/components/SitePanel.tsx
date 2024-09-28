import { clsx } from 'clsx'
import { formatDistance, parseISO } from 'date-fns'
import { SiteRead } from '../types/site'

type Params = {
  site: SiteRead
}

export default function SitePanel(params: Params) {

  const s = params.site

  const className = clsx(
    'rounded-t-md',
    'pt-1',
    {
      'bg-status-unknown': s.status == 'unknown',
      'bg-status-green': s.status == 'online',
      'bg-status-red': s.status == 'error',
    },
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
    </div>
  )
}
