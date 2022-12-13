import React from 'react'
import { message, ConfigProvider } from 'antd'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AuthProvider from './providers'
import './index.css'

const root = createRoot(document.getElementById('root'))

const antdTheme = {
  token: {
    colorPrimary: '#36bb20',
    colorInfo: '#36bb20',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0), 0 1px 6px -1px rgba(0, 0, 0, 0), 0 2px 4px 0 rgba(0, 0, 0, 0)',
    boxShadowSecondary:
      '0 6px 16px 0 rgba(0, 0, 0, 0), 0 3px 6px -4px rgba(0, 0, 0, 0), 0 9px 28px 8px rgba(0, 0, 0, 0)',
  },
}

const AppRoot = () => (
  <React.StrictMode>
    <ConfigProvider theme={antdTheme}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  </React.StrictMode>
)

// if (process.env.NODE_ENV === 'development') {
import('./mocks/browser')
  .then(({ worker }) => {
    worker.start()
    message.config({ maxCount: 1 })
  })
  .then(() => {
    root.render(<AppRoot />)
  })
// } else {
//   message.config({ maxCount: 1 })

//   root.render(<AppRoot />)
// }
