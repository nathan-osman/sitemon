import { formatDistance, parseISO } from 'date-fns'

type Props = {
  date: string
}

export default function Time(props: Props) {
  return (
    <span title={props.date}>
      {formatDistance(parseISO(props.date), new Date())} ago
    </span>
  )
}
