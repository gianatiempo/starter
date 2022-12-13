import { useState } from 'react'
import Icon, { TeamOutlined } from '@ant-design/icons'
import { PageHeader } from '@ant-design/pro-layout'
import { Tabs } from 'antd'
import BikeIcon from '@components/BikeIcon'
import PageContentWrapper from '@components/PageContentWrapper'
import { useDocumentTitle } from '@hooks'
import BikeTabContent from './BikeTabContent'
import UserTabContent from './UserTabContent'

const UserManagementPage = () => {
  useDocumentTitle('Reservation Management')
  const [selectedTab, setSelectedTab] = useState('users')
  const switchTab = () => setSelectedTab(selectedTab === 'users' ? 'bikes' : 'users')

  const tabs = [
    {
      label: (
        <>
          <TeamOutlined /> Users
        </>
      ),
      key: 'users',
      children: <UserTabContent />,
    },
    {
      label: (
        <>
          <Icon component={BikeIcon} className='bike-icon' /> Bikes
        </>
      ),
      key: 'bikes',
      children: <BikeTabContent />,
    },
  ]

  return (
    <>
      <PageHeader title='Resv Management' subTitle='Made easy for you!' />
      <PageContentWrapper>
        <Tabs defaultActiveKey={selectedTab} type='card' onChange={switchTab} items={tabs} />
      </PageContentWrapper>
    </>
  )
}

export default UserManagementPage
