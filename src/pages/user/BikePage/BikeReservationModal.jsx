import { Modal, Space, Typography, Rate, message } from 'antd'
import { useAuthState } from '@hooks'

const BikeReservationModal = ({ selectedBike, range, clear }) => {
  const { user } = useAuthState()

  const submitReservation = () => {
    fetch('/reservation', {
      method: 'POST',
      body: JSON.stringify({ bikeId: selectedBike.id, userId: user.id, range }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then(r => r.json())
      .then(
        response =>
          response.message ? message.error(response.message) : message.success('Successfuly reserved a bike!'),
        error => message.error(error.message),
      )
    clear()
  }

  return (
    <Modal
      title='Book a Bike'
      centered
      open
      width={'600px'}
      okText={'Reserve'}
      onOk={submitReservation}
      onCancel={() => clear()}>
      <Space direction='vertical' size='middle'>
        <Space size='middle'>
          <Typography.Text>Selected Range for Reservation:</Typography.Text>
          <Typography.Text strong>
            {range[0].replace(/\./g, '/')} - {range[1].replace(/\./g, '/')}
          </Typography.Text>
        </Space>
        <Typography.Text>Bike Info:</Typography.Text>
        <Space size='middle'>
          <Typography.Text strong>Model:</Typography.Text>
          <Typography.Text>{selectedBike.model}</Typography.Text>
        </Space>
        <Space size='middle'>
          <Typography.Text strong>Color:</Typography.Text>
          <Typography.Text>{selectedBike.color}</Typography.Text>
        </Space>
        <Space size='middle'>
          <Typography.Text strong>Rating:</Typography.Text>
          <Rate disabled allowHalf value={selectedBike.rating} />
        </Space>
        <Space size='middle'>
          <Typography.Text strong>Pick up point:</Typography.Text>
          <Typography.Text italic>{selectedBike.location}</Typography.Text>
        </Space>
      </Space>
    </Modal>
  )
}

export default BikeReservationModal
