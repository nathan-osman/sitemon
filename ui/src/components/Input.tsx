import { ChangeEvent, InputHTMLAttributes } from 'react'
import { useForm } from '../lib/form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  title: string
  name: string
}

export default function Input({ title, name, ...props }: Props) {

  const form = useForm()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (props.type === "number") {
      try {
        form.setValue(name, parseInt(e.target.value))
        return
      } catch { }
    }
    form.setValue(name, e.target.value)
  }

  return (
    <div>
      <input
        disabled={form.submitting}
        className="w-full border p-2 focus:outline-none focus:border-black"
        placeholder={title}
        {...props}
        value={form.getValue(name, '')}
        onChange={handleChange}
      />
    </div>
  )
}
