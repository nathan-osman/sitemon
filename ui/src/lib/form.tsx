import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'

type FormContextType = {
  submitting: boolean
  error: string | null
  getValue: <K>(key: string, defaultVal: K) => K
  setValue: (key: string, value: any) => void
}

const FormContext = createContext<FormContextType | null>(null)

type Props<T> = {
  initialValues?: T
  onSubmit: (values: T) => Promise<any>
}

function Form<T extends { [key: string]: string | number | boolean }>(
  props: PropsWithChildren<Props<T>>,
) {

  const [values, setValues] = useState<T>(props.initialValues || {} as T)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const formContext = {
    submitting,
    error,
    getValue: function <K>(key: string, defaultValue: K): K {
      return key in values ? (values[key] as K) : defaultValue
    },
    setValue: function (key: string, value: any): void {
      setValues(values => ({
        ...values,
        [key]: value,
      }))
    },
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    props.onSubmit(values)
      .catch((e: Error) => setError(e.message))
      .finally(() => setSubmitting(false))
  }

  return (
    <FormContext.Provider value={formContext}>
      <form
        onSubmit={handleSubmit}
      >
        {props.children}
      </form>
    </FormContext.Provider>
  )
}

function useForm(): FormContextType {
  const formContext = useContext(FormContext)
  if (formContext === null) {
    throw new Error("form context is null; did you forget <Form>?")
  }
  return formContext
}

export {
  Form,
  useForm,
}
