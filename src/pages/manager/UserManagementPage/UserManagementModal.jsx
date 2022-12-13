import { Button, Form, Input, Modal, message, Select } from 'antd'
import { ROLE } from '@utils'

const { Option } = Select

const UserManagementModal = ({ selectedUser, clear }) => {
  const onFinish = values => {
    fetch(selectedUser.id ? `/user/${selectedUser.id}` : '/user', {
      method: selectedUser.id ? 'PATCH' : 'POST',
      body: JSON.stringify({ ...selectedUser, ...values }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then(r => r.json())
      .then(
        response =>
          response.message
            ? message.error(response.message)
            : message.success(`Successfuly ${selectedUser.id ? 'edited' : 'created'} a user!`),
        error => message.error(error.message),
      )
    clear()
  }

  return (
    <Modal
      title={`${selectedUser.id ? 'Edit' : 'Create'} a User`}
      centered
      open
      width={'600px'}
      footer={null}
      onCancel={() => clear()}>
      <Form name='user-management-form' onFinish={onFinish} initialValues={selectedUser}>
        <Form.Item name='username' rules={[{ required: true, message: 'Please input the Username!' }]}>
          <Input placeholder='Username' />
        </Form.Item>
        <Form.Item name='password' rules={[{ required: true, message: 'Please input the user Password!' }]}>
          <Input placeholder='Password' />
        </Form.Item>
        <Form.Item name='role' rules={[{ required: true, message: 'Please select the User Role!' }]}>
          <Select placeholder='Role'>
            {Object.keys(ROLE).map(role => (
              <Option key={role} value={role}>
                {ROLE[role]}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='name' rules={[{ required: true, message: 'Please input the User Name!' }]}>
          <Input placeholder='User Name' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            {selectedUser.id ? 'Edit' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserManagementModal
