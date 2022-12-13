import { useEffect, useState } from 'react'
import { Table, Space, Typography, message, Select } from 'antd'

const { Option } = Select

const columns = [
  { title: 'User', dataIndex: 'user', key: 'user' },
  { title: 'Resv Start', dataIndex: 'range', key: 'start', render: v => v[0].replace(/\./g, '/') },
  { title: 'Resv End', dataIndex: 'range', key: 'end', render: v => v[1].replace(/\./g, '/') },
]

const BikeTabContent = () => {
  const [data, setData] = useState([])
  const [reservations, setReservations] = useState([])
  const [bikeId, setBikeId] = useState()

  useEffect(() => {
    fetch(`/bike/`)
      .then(r => r.json())
      .then(
        response => setData(response),
        error => {
          message.error(error)
          setData([])
        },
      )
  }, [])

  useEffect(() => {
    const fetchBikeReservations = bikeId =>
      fetch(`/reservation/bike/${bikeId}`)
        .then(r => r.json())
        .then(
          response => setReservations(response),
          error => {
            message.error(error)
            setData([])
          },
        )
    bikeId && fetchBikeReservations(bikeId)
  }, [bikeId])

  return (
    <Space direction='vertical' size='middle'>
      <Space size='middle'>
        <Typography.Text>Select Bike:</Typography.Text>
        <Select className='select-size' onSelect={value => setBikeId(value)}>
          {data.map(bike => (
            <Option key={bike.id} value={bike.id}>
              {bike.model}
            </Option>
          ))}
        </Select>
      </Space>
      <Table dataSource={reservations} columns={columns} rowKey='id' sticky />
    </Space>
  )
}

export default BikeTabContent
