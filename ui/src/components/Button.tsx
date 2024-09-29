import { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { useForm } from '../lib/form'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string
}

export default function Button(
  { to, children, ...props }: PropsWithChildren<Props>,
) {

  const navigate = useNavigate()

  let submitting: boolean = false
  let adjProps = { ...props }

  try {
    submitting = useForm().submitting
  } catch {
    adjProps.type = "button"
  }

  if (to !== undefined) {
    adjProps.onClick = () => navigate(to)
  }

  const className = clsx(
    'bg-background-panel-button',
    'focus:outline-none',
    'focus:border-black',
    'border',
    'px-4',
    'py-2',
    'hover:bg-white',
  )

  return (
    <button
      disabled={submitting}
      className={className}
      {...adjProps}
    >{children}
    </button>
  )
}
