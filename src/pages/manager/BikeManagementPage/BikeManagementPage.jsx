import { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { PageHeader } from '@ant-design/pro-layout'
import { Table, Rate, message, Button, Space, Tooltip, Popconfirm } from 'antd'
import PageContentWrapper from '@components/PageContentWrapper'
import { useDocumentTitle } from '@hooks'
import BikeManagementModal from './BikeManagementModal'

const columns = [
  { title: 'Model', dataIndex: 'model', key: 'model' },
  { title: 'Color', dataIndex: 'color', key: 'color' },
  { title: 'Location', dataIndex: 'location', key: 'location' },
  { title: 'Rating', dataIndex: 'rating', key: 'rating', render: v => <Rate disabled allowHalf value={v} /> },
  { title: 'Available', dataIndex: 'available', key: 'available', render: av => (av ? 'Yes' : 'No') },
]

const BikeManagementPage = () => {
  useDocumentTitle('Bike Management')
  const [data, setData] = useState([])
  const [bike, setBike] = useState()

  useEffect(() => {
    fetch(`/bike`)
      .then(r => r.json())
      .then(
        response => setData(response),
        error => {
          message.error(error)
          setData([])
        },
      )
  }, [bike])

  const removeBike = bikeId => {
    fetch(`/bike/${bikeId}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(
        response => setData(response),
        error => {
          message.error(error)
          setData([])
        },
      )
  }

  const actionColumn = {
    width: '6%',
    title: '',
    key: 'action',
    render: (_, record) => (
      <Space size='middle'>
        <Tooltip title='Delete Bike'>
          <Popconfirm
            title='Are you sure？'
            okText='Yes, Delete!'
            cancelText='No'
            onConfirm={() => removeBike(record.id)}>
            <DeleteOutlined className='icon-size' />
          </Popconfirm>
        </Tooltip>
        <Tooltip title='Edit Bike'>
          <EditOutlined className='icon-size' onClick={() => setBike(record)} />
        </Tooltip>
      </Space>
    ),
  }

  return (
    <>
      <PageHeader title='Bike Management' subTitle='Made easy for you!' />
      <PageContentWrapper>
        <Space direction='vertical' size='middle'>
          <Button type='primary' onClick={() => setBike({})}>
            Add a bike
          </Button>
          <Table dataSource={data} columns={[...columns, actionColumn]} rowKey='id' sticky />
          {bike ? <BikeManagementModal selectedBike={bike} clear={setBike} /> : null}
        </Space>
      </PageContentWrapper>
    </>
  )
}

export default BikeManagementPage
