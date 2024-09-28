import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { z } from 'zod'
import Spinner from '../components/Spinner'

type FetchParams = {
  url: string
  method?: string
  data?: any
}

type LoginParams = {
  email: string
  password: string
}

interface ApiContextType {
  isLoggedIn: boolean
  fetch: (params: FetchParams) => Promise<Response>
  fetchWithValidation: <T extends z.ZodTypeAny>(
    schema: T,
    params: FetchParams,
  ) => Promise<z.TypeOf<T>>
  login: (params: LoginParams) => Promise<void>
  logout: () => Promise<void>
}

const ApiContext = createContext<ApiContextType | null>(null)

function ApiProvider(props: PropsWithChildren) {

  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const apiContext = {
    isLoggedIn,
    fetch: async function (params: FetchParams): Promise<Response> {
      let init: RequestInit = {}
      if (params.method !== undefined) {
        init.method = params.method
      }
      if (params.data !== undefined) {
        init.headers = {
          'Content-type': 'application/json',
        }
        init.body = JSON.stringify(params.data)
      }
      const response = await fetch(params.url, init)

      // TODO: handle error from backend

      return response
    },
    fetchWithValidation: async function <T extends z.ZodTypeAny>(
      schema: T,
      params: FetchParams
    ): Promise<z.TypeOf<T>> {
      const response = await apiContext.fetch(params)
      const result = schema.safeParse(await response.json())
      if (!result.success) {
        throw new Error("validation error")
      }
      return result.data
    },
    login: async function (params: LoginParams) {
      await apiContext.fetch({
        url: "/api/login",
        method: 'POST',
        data: params,
      })
    },
    logout: async function () {
      await apiContext.fetch({
        url: "/api/logout",
        method: 'POST',
      })
    },
  }

  useEffect(() => {
    apiContext.fetch({ url: "/api/test" })
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
