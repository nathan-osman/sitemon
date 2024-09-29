import { InputHTMLAttributes } from 'react'
import { useForm } from '../lib/form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  title: string
  name: string
}

export default function Checkbox({ title, name, ...props }: Props) {

  const form = useForm()

  return (
    <div>
      <label className="flex items-center gap-x-2 cursor-pointer">
        <input
          type="checkbox"
          {...props}
          checked={form.getValue(name, false)}
          onChange={e => form.setValue(name, e.target.checked)}
        />
        <div>{title}</div>
      </label>
    </div>
  )
}
