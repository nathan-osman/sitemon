import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { z } from 'zod'
import Spinner from '../components/Spinner'

interface ApiContextType {
  isLoggedIn: boolean
  fetch: (
    input: string,
    init?: RequestInit,
  ) => Promise<any>
  fetchWithValidation: <T extends z.ZodTypeAny>(
    schema: T,
    input: string,
    init?: RequestInit,
  ) => Promise<z.TypeOf<T>>
}

const ApiContext = createContext<ApiContextType | null>(null)

function ApiProvider(props: PropsWithChildren) {

  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const apiContext = {
    isLoggedIn,
    fetch: async function (
      input: string,
      init?: RequestInit,
    ): Promise<any> {
      const response = await fetch(input, init)

      // TODO: handle error from backend

      return response.status !== 204 ?
        await response.json() : undefined
    },
    fetchWithValidation: async function <T extends z.ZodTypeAny>(
      schema: T,
      input: string,
      init?: RequestInit,
    ): Promise<z.TypeOf<T>> {
      const result = schema.safeParse(await apiContext.fetch(input, init))
      if (!result.success) {
        throw new Error("validation error")
      }
      return result.data
    }
  }

  useEffect(() => {
    apiContext.fetch("/api/test")
      .then(() => setIsLoggedIn(true))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <ApiContext.Provider value={apiContext}>
      {isLoading ? <Spinner /> : props.children}
    </ApiContext.Provider>
  )
}

function useApi(): ApiContextType {
  const apiContext = useContext(ApiContext)
  if (apiContext === null) {
    throw new Error("api context is null; did you forget <ApiProvider>?")
  }
  return apiContext
}

export {
  ApiProvider,
  useApi,
}
