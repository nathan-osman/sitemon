import { useForm } from '../lib/form'

export default function FormError() {

  const form = useForm()

  return (
    <>
      {
        form.error !== null &&
        <div className="text-error">
          Error: {form.error}
        </div>
      }
    </>
  )
}
