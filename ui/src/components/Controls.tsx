import { PropsWithChildren } from 'react'

export default function Controls(props: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-y-2 p-4">
      {props.children}
    </div>
  )
}
