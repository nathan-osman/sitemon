import { PropsWithChildren } from 'react'

export default function ButtonGroup(props: PropsWithChildren) {
  return (
    <div className="flex bg-background p-4 justify-end">
      {props.children}
    </div>
  )
}
