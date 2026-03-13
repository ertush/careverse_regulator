import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'dayjs/locale/en'
import './index.css'
import ThemeRoot from './ThemeRoot'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeRoot />
  </StrictMode>,
)
