import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import LoginForm from '@pages/auth/LoginPage'
import RegisterForm from '@pages/auth/RegisterPage'

const AuthContext = React.createContext()

function AuthProvider({ children }) {
  const [state, setState] = React.useState({ status: 'pending', error: null, user: null })

  React.useEffect(() => {
    fetch('/user/me')
      .then(r => r.json())
      .then(
        response => {
          response.message
            ? setState({ status: 'error', error: response.message, user: null })
            : setState({ status: 'success', error: null, user: response })
        },
        error => setState({ status: 'error', error, user: null }),
      )
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, setState }}>
      {state.status === 'pending' ? (
        <Spin className='spinner-icon' indicator={<LoadingOutlined className='loading-indicator-icon' spin />} />
      ) : state.status === 'error' ? (
        <LoginForm />
      ) : state.status === 'register' ? (
        <RegisterForm />
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export default AuthProvider
export { AuthContext }
