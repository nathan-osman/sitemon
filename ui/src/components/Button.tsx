import { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { clsx } from 'clsx'
import { useForm } from '../lib/form'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { }

export default function Button(props: PropsWithChildren<Props>) {

  const form = useForm()

  const className = clsx(
    'bg-background-panel-button',
    'focus:outline-none',
    'focus:border-black',
    'border',
    'px-4',
    'py-2',
  )

  return (
    <button
      disabled={form.submitting}
      className={className}
      {...props}
    >{props.children}
    </button>
  )
}
