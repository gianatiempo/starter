import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message, Typography } from 'antd'
import { useAuthState, useDocumentTitle } from '@hooks'

const { Link } = Typography

const LoginForm = () => {
  useDocumentTitle('Login')
  const authState = useAuthState()

  const onFinish = values => {
    fetch('/user/login', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then(r => r.json())
      .then(
        response => {
          response.message
            ? message.error(response.message)
            : authState.setState({ status: 'success', error: null, user: response })
        },
        error => authState.setState({ status: 'error', error, user: null }),
      )
  }

  return (
    <div className='access-wrapper'>
      <Card title='Bike Rentals Login' bordered={false} className='access-card'>
        <Form name='bike-login' onFinish={onFinish}>
          <Form.Item name='username' rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input prefix={<UserOutlined />} placeholder='Username' />
          </Form.Item>

          <Form.Item name='password' rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input prefix={<LockOutlined />} type='password' placeholder='Password' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' className='access-button'>
              Log in
            </Button>
            <Link onClick={() => authState.setState({ status: 'register', error: null, user: null })}>
              Or register now!
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginForm
