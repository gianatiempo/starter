import { useEffect, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { PageHeader } from '@ant-design/pro-layout'
import { Table, Space, Rate, message, Tooltip, Popconfirm } from 'antd'
import dayjs from 'dayjs'
import PageContentWrapper from '@components/PageContentWrapper'
import { useDocumentTitle, useAuthState } from '@hooks'

const columns = [
  { title: 'Model', dataIndex: 'model', key: 'model' },
  { title: 'Resv Start', dataIndex: 'range', key: 'start', render: v => v[0].replace(/\./g, '/') },
  { title: 'Resv End', dataIndex: 'range', key: 'end', render: v => v[1].replace(/\./g, '/') },
]

const UserReservationPage = () => {
  useDocumentTitle('Reservation')
  const { user } = useAuthState()
  const [data, setData] = useState([])
  const [rated, setRated] = useState([])

  const removeReservation = reservationId => {
    fetch(`/reservation/${reservationId}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(
        response => (response.message ? message.error(response.message) : setData(response)),
        error => message.error(error.message),
      )
  }

  const updateRating = reservation => {
    setRated([...rated, reservation.id])
    //TODO: remove all .then()
    fetch(`/bike/${reservation.bikeId}`, {
      method: 'PATCH',
      body: JSON.stringify({ rating: reservation.rating }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }).then(() =>
      fetch(`/reservation/user/${user.id}`)
        .then(r => r.json())
        .then(
          response => setData(response),
          error => {
            message.error(error)
            setData([])
          },
        ),
    )
  }

  const extraColumns = [
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (v, record) => (
        <Rate
          disabled={rated.includes(record.id)}
          allowHalf
          value={v}
          onChange={r => updateRating({ ...record, rating: (record.rating + r) / 2 })}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      width: '6%',
      render: (_, record) =>
        dayjs(record.range[0]).isAfter(dayjs()) ? (
          <Space size='middle'>
            <Tooltip title='Cancel Reservation'>
              <Popconfirm
                title='Are you sure？'
                okText='Yes, Delete!'
                cancelText='No'
                onConfirm={() => removeReservation(record.id)}>
                <DeleteOutlined className='icon-size' />
              </Popconfirm>
            </Tooltip>
          </Space>
        ) : null,
    },
  ]

  useEffect(() => {
    fetch(`/reservation/user/${user.id}`)
      .then(r => r.json())
      .then(
        response => setData(response),
        error => {
          message.error(error)
          setData([])
        },
      )
  }, [user])

  return (
    <>
      <PageHeader title='Reservations' subTitle='All your bike reservation history!' />
      <PageContentWrapper>
        <Table dataSource={data} columns={[...columns, ...extraColumns]} rowKey='id' sticky />
      </PageContentWrapper>
    </>
  )
}

export default UserReservationPage
