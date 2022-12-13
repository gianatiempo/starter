import { useEffect, useState } from 'react'
import { Table, Space, Typography, message, Select } from 'antd'
import { ROLE } from '@utils'

const { Option } = Select

const columns = [
  { title: 'Model', dataIndex: 'model', key: 'model' },
  { title: 'Resv Start', dataIndex: 'range', key: 'start', render: v => v[0].replace(/\./g, '/') },
  { title: 'Resv End', dataIndex: 'range', key: 'end', render: v => v[1].replace(/\./g, '/') },
]

const UserTabContent = () => {
  const [data, setData] = useState([])
  const [reservations, setReservations] = useState([])
  const [userId, setUserId] = useState()

  useEffect(() => {
    fetch(`/user/`)
      .then(r => r.json())
      .then(
        response => setData(response.filter(u => u.role !== ROLE.MANAGER)),
        error => {
          message.error(error)
          setData([])
        },
      )
  }, [])

  useEffect(() => {
    const fetchBikeReservations = userId =>
      fetch(`/reservation/user/${userId}`)
        .then(r => r.json())
        .then(
          response => setReservations(response),
          error => {
            message.error(error)
            setData([])
          },
        )
    userId && fetchBikeReservations(userId)
  }, [userId])

  return (
    <Space direction='vertical' size='middle'>
      <Space size='middle'>
        <Typography.Text>Select User:</Typography.Text>
        <Select className='user-select' onSelect={value => setUserId(value)}>
          {data.map(user => (
            <Option key={user.id} value={user.id}>
              {user.name}
            </Option>
          ))}
        </Select>
      </Space>
      <Table dataSource={reservations} columns={columns} rowKey='id' sticky />
    </Space>
  )
}

export default UserTabContent
