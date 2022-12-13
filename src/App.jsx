import { Layout, Menu, message } from 'antd'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import useAuthState from './hooks/useAuthState'
import { routes } from './routes.jsx'
import { ROLE } from './utils'

const { Content, Footer, Sider } = Layout

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isManager, setState } = useAuthState()

  const menuItems = routes.filter(o => o.role.includes(isManager ? ROLE.MANAGER : ROLE.USER))

  const logout = () =>
    fetch('/user/logout', { method: 'POST' })
      .then(r => r.json())
      .then(
        response => {
          if (response.message) {
            message.success(response.message)
            setState({ status: 'error', error: null, user: null })
            navigate('/')
          }
        },
        error => setState({ status: 'error', error, user: null }),
      )

  return (
    <Layout hasSider>
      <Sider theme='light' className='sider'>
        <div className='logo-wrapper'>
          <div className='logo' />
        </div>
        <div className='menu'>
          <Menu
            mode='inline'
            selectedKeys={[location.pathname === '/' ? menuItems[0].key : location.pathname]}
            items={menuItems.filter(o => o.menu === 'top')}
            onClick={({ key }) => key === '/logout' && logout()}
          />
          <Menu mode='inline' selectedKeys={[]} items={menuItems.filter(o => o.menu === 'bottom')} />
        </div>
      </Sider>
      <Layout>
        <Content className='bike-content'>
          <Routes>
            {menuItems.map(o => {
              const Comp = o.Page
              return Comp ? <Route key={o.key} path={o.key.replace('/', '')} element={<Comp />} /> : null
            })}
            <Route path='*' element={<Navigate to={menuItems[0].key} replace />} />
          </Routes>
        </Content>
        <Footer className='bike-footer'>Starter</Footer>
      </Layout>
    </Layout>
  )
}

export default App
