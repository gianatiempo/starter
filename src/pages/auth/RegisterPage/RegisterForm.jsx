import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import { useAuthState, useDocumentTitle } from '@hooks'

const { Link } = Typography

const RegisterForm = () => {
  useDocumentTitle('Register')
  const authState = useAuthState()

  const onFinish = values => {
    fetch('/user/register', {
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
      <Card title='Bike Rentals Register' bordered={false} className='access-card'>
        <Form name='bike-register' onFinish={onFinish}>
          <Form.Item name='username' rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input prefix={<UserOutlined />} placeholder='Username' />
          </Form.Item>

          <Form.Item name='password' rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder='Password' />
          </Form.Item>

          <Form.Item
            name='confirm'
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }

                  return Promise.reject(new Error('The two passwords that you entered do not match!'))
                },
              }),
            ]}>
            <Input.Password prefix={<LockOutlined />} placeholder='Confirm Password' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' className='access-button'>
              Register
            </Button>
            <Link onClick={() => authState.setState({ status: 'error', error: null, user: null })}>Or login now!</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default RegisterForm
