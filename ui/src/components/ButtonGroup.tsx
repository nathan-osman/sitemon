import { PropsWithChildren } from 'react'

export default function ButtonGroup(props: PropsWithChildren) {
  return (
    <div className="flex bg-background gap-x-1 px-4 py-2 justify-end">
      {props.children}
    </div>
  )
}
