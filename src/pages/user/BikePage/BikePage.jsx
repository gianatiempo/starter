import { useEffect, useState } from 'react'
import { CalendarOutlined } from '@ant-design/icons'
import { PageHeader } from '@ant-design/pro-layout'
import { Table, Space, Rate, DatePicker, Typography, message, Tooltip } from 'antd'
import dayjs from 'dayjs'
import PageContentWrapper from '@components/PageContentWrapper'
import { useDocumentTitle } from '@hooks'
import { dateFormat } from '@utils'
import BikeReservationModal from './BikeReservationModal'

const { RangePicker } = DatePicker

const columns = [
  { title: 'Model', dataIndex: 'model', key: 'model' },
  { title: 'Color', dataIndex: 'color', key: 'color' },
  { title: 'Location', dataIndex: 'location', key: 'location' },
  {
    title: 'Rating',
    dataIndex: 'rating',
    key: 'rating',
    render: value => <Rate disabled allowHalf value={value} />,
  },
  {
    width: '6%',
    title: '',
    key: 'action',
  },
]
const todayRange = [dayjs().format(dateFormat.replace(/\//g, '.')), dayjs().format(dateFormat.replace(/\//g, '.'))]

const BikePage = () => {
  useDocumentTitle('Bikes')
  const [data, setData] = useState([])
  const [selectedBike, setSelectedBike] = useState()
  const [range, setRange] = useState(todayRange)

  useEffect(() => {
    fetch(`/bike/availability/${range[0]}/${range[1]}`)
      .then(r => r.json())
      .then(
        response => setData(response),
        error => {
          message.error(error)
          setData([])
        },
      )
  }, [range, selectedBike])

  const models = new Set()
  const colors = new Set()
  const locations = new Set()
  const ratings = new Set()
  data.forEach(item => {
    models.add(item.model)
    colors.add(item.color)
    locations.add(item.location)
    ratings.add(item.rating)
  })

  const extendedColumns = columns.map(col => {
    let resp
    switch (col.key) {
      case 'model':
        resp = {
          ...col,
          filters: [...models].map(m => ({ text: m, value: m })),
          onFilter: (value, record) => record.model.indexOf(value) === 0,
        }
        break
      case 'color':
        resp = {
          ...col,
          filters: [...colors].map(m => ({ text: m, value: m })),
          onFilter: (value, record) => record.color.indexOf(value) === 0,
        }
        break
      case 'location':
        resp = {
          ...col,
          filters: [...locations].map(m => ({ text: m, value: m })),
          onFilter: (value, record) => record.location.indexOf(value) === 0,
        }
        break
      case 'rating':
        resp = {
          ...col,
          filters: [...ratings].map(m => ({ text: m, value: m })),
          onFilter: (value, record) => record.rating.indexOf(value) === 0,
        }
        break
      default:
        resp = {
          ...col,
          render: (_, record) => (
            <Space size='middle'>
              <Tooltip title='Book a Reservation'>
                <CalendarOutlined className='icon-size' onClick={() => setSelectedBike(record)} />
              </Tooltip>
            </Space>
          ),
        }
    }
    return resp
  })

  const clearReservation = () => {
    setSelectedBike()
    setRange(todayRange)
  }

  return (
    <>
      <PageHeader title='Bikes' subTitle='All our available bikes for you to choose!' />
      <PageContentWrapper>
        <Space direction='vertical' size='middle'>
          <Space size='middle'>
            <Typography.Text>Select Range for Reservation:</Typography.Text>
            <RangePicker
              defaultValue={[dayjs(range[0], dateFormat), dayjs(range[1], dateFormat)]}
              format={dateFormat}
              onChange={(_, dateString) => setRange(dateString.map(d => d.replace(/\//g, '.')))}
            />
          </Space>
          <Table dataSource={data} columns={extendedColumns} rowKey='id' sticky />
          {selectedBike !== undefined ? (
            <BikeReservationModal selectedBike={selectedBike} range={range} clear={clearReservation} />
          ) : null}
        </Space>
      </PageContentWrapper>
    </>
  )
}

export default BikePage
