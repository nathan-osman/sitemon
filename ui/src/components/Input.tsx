import { InputHTMLAttributes } from 'react'
import { useForm } from '../lib/form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  title: string
  name: string
}

export default function Input({ title, name, ...props }: Props) {

  const form = useForm()

  return (
    <div>
      <input
        disabled={form.submitting}
        className="w-full border p-2 focus:outline-none focus:border-black"
        placeholder={title}
        {...props}
        value={form.getValue(name, '')}
        onChange={e => form.setValue(name, e.target.value)}
      />
    </div>
  )
}
