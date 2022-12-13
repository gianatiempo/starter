import { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { PageHeader } from '@ant-design/pro-layout'
import { Table, message, Button, Space, Tooltip, Popconfirm } from 'antd'
import PageContentWrapper from '@components/PageContentWrapper'
import { useAuthState, useDocumentTitle } from '@hooks'
import UserManagementModal from './UserManagementModal'

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Username', dataIndex: 'username', key: 'username' },
]

const UserManagementPage = () => {
  useDocumentTitle('User Management')
  const { user } = useAuthState()
  const [data, setData] = useState([])
  const [selectedUser, setSelectedUser] = useState()

  useEffect(() => {
    fetch(`/user`)
      .then(r => r.json())
      .then(
        response => setData(response),
        error => {
          message.error(error)
          setData([])
        },
      )
  }, [selectedUser])

  const removeUser = userId => {
    fetch(`/user/${userId}`, { method: 'DELETE' })
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
        {user.id !== record.id ? (
          <Tooltip title='Delete User'>
            <Popconfirm
              title='Are you sure？'
              okText='Yes, Delete!'
              cancelText='No'
              onConfirm={() => removeUser(record.id)}>
              <DeleteOutlined className='icon-size' />
            </Popconfirm>
          </Tooltip>
        ) : (
          <DeleteOutlined className='icon-size-disabled' />
        )}
        {user.id !== record.id ? (
          <Tooltip title='Edit User'>
            <EditOutlined className='icon-size' onClick={() => setSelectedUser(record)} />
          </Tooltip>
        ) : (
          <EditOutlined className='icon-size-disabled' />
        )}
      </Space>
    ),
  }

  return (
    <>
      <PageHeader title='User Management' subTitle='Made easy for you!' />
      <PageContentWrapper>
        <Space direction='vertical' size='middle'>
          <Button type='primary' onClick={() => setSelectedUser({})}>
            Add an user
          </Button>
          <Table dataSource={data} columns={[...columns, actionColumn]} rowKey='id' sticky />
          {selectedUser ? <UserManagementModal selectedUser={selectedUser} clear={setSelectedUser} /> : null}
        </Space>
      </PageContentWrapper>
    </>
  )
}

export default UserManagementPage
