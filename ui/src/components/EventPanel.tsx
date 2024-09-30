import { clsx } from 'clsx'
import Time from './Time'
import { Event } from '../types/event'

type Props = {
  event: Event
}

export default function EventPanel(props: Props) {

  const e = props.event

  const className = clsx(
    'rounded-t-md',
    'mt-2',
    'pt-1',
    {
      'bg-status-unknown': e.new_status === 'unknown',
      'bg-status-online': e.new_status === 'online',
      'bg-status-error': e.new_status === 'error',
    },
    'shadow-lg',
  )

  function cn(v: string) {
    switch (v) {
      case 'online': return "text-status-online"
      case 'error': return "text-status-error"
      default: return "text-status-unknown"
    }
  }

  return (
    <div className={className}>
      <div className="bg-background-panel p-2">
        <div className="lg:flex lg:justify-between">
          <div>
            Status changed from
            {' '}
            <span className={cn(e.old_status)}>{e.old_status}</span>
            {' to '}
            <span className={cn(e.new_status)}>{e.new_status}</span>
          </div>
          <div className="text-muted">
            <Time date={e.time} />
          </div>
        </div>
        {
          e.details.length > 0 &&
          <div className="ml-4 font-mono">{e.details}</div>
        }
      </div>
    </div>
  )
}
