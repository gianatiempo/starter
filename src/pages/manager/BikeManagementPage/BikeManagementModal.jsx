import { Button, Form, Input, Modal, message, Checkbox } from 'antd'

const BikeManagementModal = ({ selectedBike, clear }) => {
  const onFinish = values => {
    fetch(selectedBike.id ? `/bike/${selectedBike.id}` : '/bike', {
      method: selectedBike.id ? 'PATCH' : 'POST',
      body: JSON.stringify({ ...selectedBike, ...values }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then(r => r.json())
      .then(
        response =>
          response.message
            ? message.error(response.message)
            : message.success(`Successfuly ${selectedBike.id ? 'edited' : 'created'} a bike!`),
        error => message.error(error.message),
      )
    clear()
  }

  return (
    <Modal
      title={`${selectedBike.id ? 'Edit' : 'Create'} a Bike`}
      centered
      open
      width={'600px'}
      footer={null}
      onCancel={() => clear()}>
      <Form name='bike-management-form' onFinish={onFinish} initialValues={selectedBike}>
        <Form.Item name='model' rules={[{ required: true, message: 'Please input the Bike Model!' }]}>
          <Input placeholder='Model' />
        </Form.Item>
        <Form.Item name='color' rules={[{ required: true, message: 'Please input the Bike Color!' }]}>
          <Input placeholder='Color' />
        </Form.Item>
        <Form.Item name='location' rules={[{ required: true, message: 'Please input the Bike Location!' }]}>
          <Input placeholder='Location' />
        </Form.Item>
        <Form.Item name='available' valuePropName='checked'>
          <Checkbox>Available</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            {selectedBike.id ? 'Edit' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BikeManagementModal
