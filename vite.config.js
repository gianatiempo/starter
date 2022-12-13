import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: '/index.html',
  },
  resolve: {
    alias: [
      { find: '@components', replacement: path.resolve(__dirname, 'src', 'components') },
      { find: '@hooks', replacement: path.resolve(__dirname, 'src', 'hooks') },
      { find: '@pages', replacement: path.resolve(__dirname, 'src', 'pages') },
      { find: '@providers', replacement: path.resolve(__dirname, 'src', 'providers') },
      { find: '@utils', replacement: path.resolve(__dirname, 'src', 'utils') },
    ],
  },
  plugins: [react()],
})
