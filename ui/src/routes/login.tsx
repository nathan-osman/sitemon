import { useNavigate } from 'react-router-dom'
import { LoginParams, useApi } from '../lib/api'
import { Form } from '../lib/form'
import Button from '../components/Button'
import ButtonGroup from '../components/ButtonGroup'
import Controls from '../components/Controls'
import FormError from '../components/FormError'
import Input from '../components/Input'

export default function Login() {

  const api = useApi()
  const navigate = useNavigate()

  function handleSubmit(params: LoginParams) {
    return api.login(params)
      .then(() => navigate("/"))
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="shadow-lg">
        <Form onSubmit={handleSubmit}>
          <div className="bg-white">
            <Controls>
              <div className="text-2xl mb-4">Login</div>
              <FormError />
              <Input
                title="Email"
                name="email"
                type="email"
                autoFocus
              />
              <Input
                title="Password"
                name="password"
                type="password"
              />
            </Controls>
          </div>
          <ButtonGroup>
            <Button>Login</Button>
          </ButtonGroup>
        </Form>
      </div>
    </div>
  )
}
