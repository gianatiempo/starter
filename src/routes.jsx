import Icon, { LogoutOutlined, WalletOutlined, TeamOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import BikeIcon from './components/BikeIcon'
import BillingPage from './pages/BillingPage'
import BikeManagementPage from './pages/manager/BikeManagementPage'
import ReservationManagementPage from './pages/manager/ReservationManagementPage'
import UserManagementPage from './pages/manager/UserManagementPage'
import BikePage from './pages/user/BikePage'
import UserReservationPage from './pages/user/UserReservationPage'
import { ROLE } from './utils'

export const routes = [
  {
    menu: 'top',
    role: [ROLE.MANAGER],
    icon: <Icon component={BikeIcon} />,
    label: <Link to='/bike-management'>Bike Management</Link>,
    key: '/bike-management',
    Page: () => <BikeManagementPage />,
  },
  {
    menu: 'top',
    role: [ROLE.MANAGER],
    icon: <TeamOutlined />,
    label: <Link to='/user-management'>User Management</Link>,
    key: '/user-management',
    Page: () => <UserManagementPage />,
  },
  {
    menu: 'top',
    role: [ROLE.MANAGER],
    icon: <WalletOutlined />,
    label: <Link to='/reservations'>Resv Management</Link>, //tab to filter by bike or user
    key: '/reservations',
    Page: () => <ReservationManagementPage />,
  },
  {
    menu: 'top',
    role: [ROLE.USER],
    icon: <Icon component={BikeIcon} />,
    label: <Link to='/bikes'>Bikes</Link>,
    key: '/bikes',
    Page: () => <BikePage />,
  },
  {
    menu: 'top',
    role: [ROLE.USER],
    icon: <WalletOutlined />,
    label: <Link to='/reservations'>My Reservations</Link>,
    key: '/reservations',
    Page: () => <UserReservationPage />,
  },
  {
    menu: 'top',
    role: [ROLE.MANAGER, ROLE.USER],
    icon: <LogoutOutlined />,
    label: 'Log Out',
    key: '/logout',
    Page: () => <BillingPage />,
  },
  {
    menu: 'bottom',
    role: [ROLE.MANAGER, ROLE.USER],
    label: <Link to='/billing'>Billing</Link>,
    key: '/billing',
    Page: () => <BillingPage />,
  },
]
