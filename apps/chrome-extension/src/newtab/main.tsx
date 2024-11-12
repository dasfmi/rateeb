import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../assets/index.css'
import NewTab from './NewTab.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NewTab />
  </StrictMode>,
)
